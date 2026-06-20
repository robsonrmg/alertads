import { supabase, getSupabaseConfig } from '../../lib/supabase/client';
import { NotificationQueueItem } from '../../types/notifications';
import { sendEmail } from './send-email';
import { sendWhatsApp } from './send-whatsapp';
import { AlertTemplateData } from '../../lib/notifications/notification-templates';

export interface ProcessQueueResult {
  success: boolean;
  processedCount: number;
  successCount: number;
  failedCount: number;
  details: {
    queueItemId: string;
    status: 'sent' | 'failed' | 'processing';
    emailResult?: any;
    whatsappResult?: any;
    error?: string;
  }[];
}

/**
 * Processador da fila baseada na tabela notification_queue.
 * Executa as seguintes regras:
 * - Filtra por itens 'pending' ou 'failed' com attempts < 3.
 * - Garante intervalo de 5 minutos caso seja uma nova tentativa pós-falha.
 * - Dispara e-mails via Resend e mensagens via Evolution API se habilitados.
 * - Atualiza os registros e status correspondentes de forma segura.
 */
export async function processNotificationQueue(): Promise<ProcessQueueResult> {
  const now = new Date();
  const nowStr = now.toISOString();
  const { isConfigured } = getSupabaseConfig();

  console.log('[ALERTADS QUEUE] Iniciando processamento da fila de notificações...');

  const results: ProcessQueueResult['details'] = [];
  let processedCount = 0;
  let successCount = 0;
  let failedCount = 0;

  if (!isConfigured) {
    console.log('[ALERTADS QUEUE Sandbox] Supabase offline. Rodando simulação de fila de notificações.');
    
    // Gerar notificações simuladas caso não existam alertas/tráfego no banco de dados local
    return {
      success: true,
      processedCount: 1,
      successCount: 1,
      failedCount: 0,
      details: [{
        queueItemId: 'mock_queue_1',
        status: 'sent',
        emailResult: { success: true, simulated: true },
        whatsappResult: { success: true, simulated: true }
      }]
    };
  }

  try {
    // 1. Buscar itens pendentes ou falhados com menos de 3 tentativas
    const { data: queueItems, error: fetchError } = await supabase
      .from('notification_queue')
      .select('*')
      .in('status', ['pending', 'failed'])
      .lt('attempts', 3);

    if (fetchError) {
      console.error('[ALERTADS QUEUE] Erro ao buscar fila de notificações:', fetchError.message);
      return { success: false, processedCount: 0, successCount: 0, failedCount: 0, details: [], error: fetchError.message } as any;
    }

    if (!queueItems || queueItems.length === 0) {
      console.log('[ALERTADS QUEUE] Nenhum item pendente de envio encontrado.');
      return { success: true, processedCount: 0, successCount: 0, failedCount: 0, details: [] };
    }

    // 2. Filtrar os elegíveis respeitando intervalo de 5 minutos entre tentativas
    const eligibleItems = (queueItems as NotificationQueueItem[]).filter(item => {
      if (item.status === 'pending') return true;
      if (item.status === 'failed') {
        if (!item.last_attempt_at) return true;
        
        const lastAttempt = new Date(item.last_attempt_at);
        const diffMs = now.getTime() - lastAttempt.getTime();
        const diffMinutes = diffMs / (1000 * 60);
        return diffMinutes >= 5; // Esperar 5 minutos entre tentativas
      }
      return false;
    });

    console.log(`[ALERTADS QUEUE] Encontrados ${queueItems.length} itens no total. Elegíveis agora: ${eligibleItems.length}`);

    for (const item of eligibleItems) {
      processedCount++;
      let emailSuccess = true;
      let whatsappSuccess = true;
      let emailErr = '';
      let whatsappErr = '';
      let emailLog: any = null;
      let whatsappLog: any = null;

      try {
        // a. Marcar item como 'processing' e atualizar attempts
        const nextAttempts = (item.attempts || 0) + 1;
        await supabase
          .from('notification_queue')
          .update({
            status: 'processing',
            attempts: nextAttempts,
            last_attempt_at: nowStr
          })
          .eq('id', item.id);

        // b. Buscar dados do Alerta associado
        const { data: alert, error: alertError } = await supabase
          .from('alerts')
          .select('*')
          .eq('id', item.alert_id)
          .single();

        if (alertError || !alert) {
          throw new Error(`Alerta ID ${item.alert_id} não encontrado: ${alertError?.message || 'Inexistente'}`);
        }

        // c. Buscar dados do Monitor para extrair canais específicos de contato
        const { data: monitor, error: monitorError } = await supabase
          .from('monitors')
          .select('*')
          .eq('id', alert.monitor_id)
          .single();

        // Buscar configurações globais do usuário caso o monitoramento não tenha dados específicos
        const { data: globalSettings } = await supabase
          .from('notification_settings')
          .select('*')
          .eq('user_id', item.user_id)
          .single();

        // Determinar destinos
        const emailTo = monitor?.email || globalSettings?.email_enabled ? (globalSettings?.whatsapp_number ? globalSettings.user_id : 'ribeiromoreira91@gmail.com') : 'ribeiromoreira91@gmail.com';
        const whatsappTo = monitor?.whatsapp_number || globalSettings?.whatsapp_number || '';

        // Obter URL do Dashboard para o e-mail
        const appUrl = typeof process !== 'undefined' && process.env?.APP_URL ? process.env.APP_URL : 'https://ai.studio/build';
        const templateData: AlertTemplateData = {
          monitorName: monitor?.name || 'Monitoramento Desconhecido',
          alertType: alert.type,
          message: alert.message,
          dateTime: new Date(alert.created_at).toLocaleString('pt-BR'),
          dashboardUrl: appUrl
        };

        // d. Enviar E-mail se habilitado
        if (item.email_enabled && emailTo) {
          const emailSubject = `🚨 Alerta de Tráfego: ${monitor?.name || 'Aviso'}`;
          const emailRes = await sendEmail(emailTo, emailSubject, templateData);
          emailSuccess = emailRes.success;
          emailLog = emailRes;
          if (!emailRes.success) {
            emailErr = emailRes.error || 'Falha genérica de envio por email';
          }
        }

        // e. Enviar WhatsApp se habilitado
        if (item.whatsapp_enabled && whatsappTo) {
          const waRes = await sendWhatsApp(whatsappTo, templateData);
          whatsappSuccess = waRes.success;
          whatsappLog = waRes;
          if (!waRes.success) {
            whatsappErr = waRes.error || 'Falha genérica de envio por WhatsApp';
          }
        }

        // f. Consolidar os status
        const isFullySent = (!item.email_enabled || emailSuccess) && (!item.whatsapp_enabled || whatsappSuccess);

        if (isFullySent) {
          successCount++;
          const successDetails = {
            status: 'sent',
            error_message: null,
            response_log: JSON.stringify({ email: emailLog, whatsapp: whatsappLog })
          };

          await supabase
            .from('notification_queue')
            .update(successDetails)
            .eq('id', item.id);

          // Atualizar status do Alerta para enviado/processado
          await supabase
            .from('alerts')
            .update({ status: 'sent' })
            .eq('id', item.alert_id);

          results.push({
            queueItemId: item.id,
            status: 'sent',
            emailResult: emailLog,
            whatsappResult: whatsappLog
          });
        } else {
          failedCount++;
          const errorsStr = `E-mail: ${emailErr || 'OK'} | WhatsApp: ${whatsappErr || 'OK'}`;
          
          await supabase
            .from('notification_queue')
            .update({
              status: 'failed',
              error_message: errorsStr,
              response_log: JSON.stringify({ email: emailLog, whatsapp: whatsappLog })
            })
            .eq('id', item.id);

          results.push({
            queueItemId: item.id,
            status: 'failed',
            emailResult: emailLog,
            whatsappResult: whatsappLog,
            error: errorsStr
          });
        }

      } catch (err: any) {
        failedCount++;
        console.error(`[ALERTADS QUEUE] Erro ao processar item individual ${item.id}:`, err);

        await supabase
          .from('notification_queue')
          .update({
            status: 'failed',
            error_message: err.message || 'Exceção inesperada na rotina',
            response_log: JSON.stringify({ error: err })
          })
          .eq('id', item.id);

        results.push({
          queueItemId: item.id,
          status: 'failed',
          error: err.message || 'Exceção interna'
        });
      }
    }

    return {
      success: true,
      processedCount,
      successCount,
      failedCount,
      details: results
    };

  } catch (globalErr: any) {
    console.error('[ALERTADS QUEUE CRITICAL] Falha catastrófica no processamento da fila:', globalErr);
    return {
      success: false,
      processedCount,
      successCount,
      failedCount,
      details: results,
      error: globalErr.message || 'Erro inesperado global'
    } as any;
  }
}
