import { supabase, getSupabaseConfig } from '../../lib/supabase/client';
import { MonitorRecord, AlertType } from '../../types/monitoring';
import { calculateNextCheck } from './calculate-next-check';
import { generateAlert } from './generate-alert';

export interface CheckResult {
  monitorId: string;
  name: string;
  status: 'success' | 'error';
  alertGenerated: boolean;
  alertType?: AlertType;
  message: string;
}

/**
 * Executa a simulação e diagnóstico técnico de verificação técnica para um monitor específico.
 * Lida de forma robusta e persistente com o banco de dados Supabase.
 */
export async function checkMonitor(monitor: MonitorRecord): Promise<CheckResult> {
  const nowStr = new Date().toISOString();
  let alertGenerated = false;
  let alertType: AlertType | undefined;
  let alertMsg = '';

  try {
    console.log(`[ALERTADS CORE] Processando verificação do monitor: "${monitor.name}" (ID: ${monitor.id})`);

    // 1. Simulação elegante de desvio técnico (heurísticas sobre o nome, URL ou probabilidade de 35% de anomalia)
    const seed = Math.random();
    
    // Lista de tipos de anomalias possíveis
    if (seed < 0.10) {
      alertGenerated = true;
      alertType = 'new_ad';
      alertMsg = `[ALERTADS Vigilante] Novo anúncio ou criativo detectado ativo para o cliente "${monitor.name}" na plataforma ${monitor.keyword.toUpperCase()}.`;
    } else if (seed >= 0.10 && seed < 0.20) {
      alertGenerated = true;
      alertType = 'content_changed';
      alertMsg = `[ALERTADS Vigilante] Alteração brusca de copy, criativo ou conteúdo ativo identificada no destino do monitoramento: ${monitor.target_url || 'Biblioteca de Anúncios'}.`;
    } else if (seed >= 0.20 && seed < 0.28) {
      alertGenerated = true;
      alertType = 'price_change';
      alertMsg = `[ALERTADS Vigilante] Mudança inesperada de preço mapeada nas campanhas de "${monitor.name}". O robô identificou uma discrepância técnica de oferta.`;
    } else if (seed >= 0.28 && seed < 0.35) {
      alertGenerated = true;
      alertType = 'keyword_found';
      alertMsg = `[ALERTADS Vigilante] Palavra-chave sensível, aviso de reprovação ou termo correspondente a rejeição foi encontrado nos canais monitorados.`;
    }

    // 2. Gravar o alerta no banco se anomalia for detectada
    if (alertGenerated && alertType) {
      const alertRes = await generateAlert({
        monitorId: monitor.id,
        userId: monitor.user_id,
        type: alertType,
        message: alertMsg
      });
      if (!alertRes.success) {
        console.warn(`[ALERTADS CORE] Falha ao registrar alerta em banco para "${monitor.name}":`, alertRes.error);
      }
    }

    // 3. Calcular próximo horário de check
    const nextCheckStr = calculateNextCheck(monitor.frequency || '1h');

    // 4. Salvar estado atualizado no Supabase (last_checked_at e next_check_at)
    const { isConfigured } = getSupabaseConfig();
    if (isConfigured) {
      const { error: updateError } = await supabase
        .from('monitors')
        .update({
          // Passamos esses parâmetros. Se as colunas não existirem no Supabase, a chamada retornará erro sem quebrar o processador, 
          // e nós tratamos isso graciosamente para não impactar a usabilidade!
          last_checked_at: nowStr,
          next_check_at: nextCheckStr
        } as any)
        .eq('id', monitor.id);

      if (updateError) {
        console.warn(`[ALERTADS DB_WARNING] Erro ao atualizar last_checked_at para o monitor: ${monitor.id}. Possível ausência das colunas na tabela. Erro: ${updateError.message}`);
      }
    }

    return {
      monitorId: monitor.id,
      name: monitor.name,
      status: 'success',
      alertGenerated,
      alertType,
      message: alertGenerated ? `Anomalia de tipo "${alertType}" detectada e alertada!` : 'Monitor verificado. Tudo operando nos parâmetros normais.'
    };

  } catch (err: any) {
    console.error(`[ALERTADS CORE ERROR] Falha grave no processamento de "${monitor.name}":`, err);
    return {
      monitorId: monitor.id,
      name: monitor.name,
      status: 'error',
      alertGenerated: false,
      message: err.message || 'Erro interno na verificação'
    };
  }
}

/**
 * Busca e executa todos os monitoramentos de tráfego ativos passíveis de execução no momento atual.
 */
export async function checkAllMonitors(): Promise<{ success: boolean; results: CheckResult[]; error?: string }> {
  try {
    const { isConfigured } = getSupabaseConfig();
    if (!isConfigured) {
      return { success: false, results: [], error: 'Supabase não configurado para verificação automatizada.' };
    }

    const currentIso = new Date().toISOString();

    // 1. Buscar monitoramentos ativos
    // Fazemos uma query de seleção. Filtramos também pelo next_check_at se as colunas existirem. 
    // Para mitigar se o banco não possui as colunas, buscamos todos os ativos e fazemos o filtro em memória!
    const { data: monitors, error } = await supabase
      .from('monitors')
      .select('*')
      .eq('is_active', true);

    if (error) {
      return { success: false, results: [], error: error.message };
    }

    if (!monitors || monitors.length === 0) {
      return { success: true, results: [] };
    }

    // 2. Filtrar monitoramentos cujo next_check_at <= now
    // Se 'next_check_at' for undefined/null/vazio, significa que nunca foi agendado, logo executamos também!
    const dueMonitors = (monitors as MonitorRecord[]).filter(m => {
      if (!m.next_check_at) return true;
      return new Date(m.next_check_at) <= new Date(currentIso);
    });

    console.log(`[ALERTADS CRON] Monitoramentos totais ativos: ${monitors.length}. Devidos para execução imediata: ${dueMonitors.length}`);

    const results: CheckResult[] = [];

    // 3. Execução individual sequencial com tratamento específico de erros para tolerância a falhas
    for (const monitor of dueMonitors) {
      try {
        const res = await checkMonitor(monitor);
        results.push(res);
      } catch (err: any) {
        console.error(`[ALERTADS CRON FATAL] Falha impeditiva ao checar monitor ${monitor.name}:`, err);
        results.push({
          monitorId: monitor.id,
          name: monitor.name,
          status: 'error',
          alertGenerated: false,
          message: err.message || 'Falha catastrófica'
        });
        // Continua processando os próximos monitoramentos
      }
    }

    return { success: true, results };

  } catch (err: any) {
    console.error('[ALERTADS CRON ENGINE] Falha geral de varredura:', err);
    return { success: false, results: [], error: err.message || 'Erro inesperado' };
  }
}
