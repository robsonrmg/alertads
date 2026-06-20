import { supabase, getSupabaseConfig } from '../../lib/supabase/client';
import { AlertType, AlertRecord } from '../../types/monitoring';

interface GenerateAlertParams {
  monitorId: string;
  userId: string;
  type: AlertType;
  message: string;
}

/**
 * Registra um novo alerta no banco de dados Supabase (tabela alerts)
 * com criticidade associada e formatação amigável de tráfego pago.
 */
export async function generateAlert({
  monitorId,
  userId,
  type,
  message
}: GenerateAlertParams): Promise<{ success: boolean; data?: AlertRecord; error?: string }> {
  try {
    const { isConfigured } = getSupabaseConfig();
    
    // Log interno
    console.log(`[ALERTADS ENGINE] Gerando Alerta - Monitor: ${monitorId}, Tipo: ${type}, Msg: ${message}`);

    if (!isConfigured) {
      // Retorna uma inserção simulada caso as credenciais estejam off-line ou seja o sandbox de teste local
      const mockAlert: AlertRecord = {
        id: 'alt_' + Math.random().toString(36).substr(2, 9),
        monitor_id: monitorId,
        user_id: userId,
        type,
        message,
        status: 'sent',
        created_at: new Date().toISOString()
      };
      return { success: true, data: mockAlert };
    }

    const { data, error } = await supabase
      .from('alerts')
      .insert({
        monitor_id: monitorId,
        user_id: userId,
        type,
        message,
        status: 'sent'
      })
      .select()
      .single();

    if (error) {
      console.error(`[ALERTADS ENGINE] Erro ao gravar alerta no banco: ${error.message}`);
      return { success: false, error: error.message };
    }

    // Enfileirar notificação de forma assíncrona tolerante a falhas
    try {
      const { data: settings } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      const { error: queueError } = await supabase
        .from('notification_queue')
        .insert({
          alert_id: data.id,
          user_id: userId,
          email_enabled: settings ? settings.email_enabled : true,
          whatsapp_enabled: settings ? settings.whatsapp_enabled : true,
          status: 'pending',
          attempts: 0
        });

      if (queueError) {
        console.warn('[ALERTADS ENGINE] Alerta gravado mas falhou ao enfileirar notificação:', queueError.message);
      } else {
        console.log(`[ALERTADS ENGINE] Notificação enfileirada com sucesso para o alerta: ${data.id}`);
      }
    } catch (nqError) {
      console.warn('[ALERTADS ENGINE] Exceção ao enfileirar notificação na fila:', nqError);
    }

    return { success: true, data: data as AlertRecord };
  } catch (err: any) {
    console.error('[ALERTADS ENGINE] Erro inesperado na geração de alerta:', err);
    return { success: false, error: err.message || 'Erro inesperado' };
  }
}
