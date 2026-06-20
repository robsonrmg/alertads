import { NextResponse } from 'next/server';
import { processNotificationQueue } from '../../../../services/notifications/process-queue';

/**
 * Endpoint de Cron Job para envio assíncrono das notificações pendentes.
 * Pode ser engatilhada a cada 1 ou 5 minutos para limpar e despachar a fila (notification_queue).
 * 
 * Rota: GET /api/cron/send-notifications
 */
export async function GET(request: Request) {
  try {
    // Validação de token de segurança (CRON_SECRET)
    const { searchParams } = new URL(request.url);
    const cronSecret = searchParams.get('secret') || request.headers.get('Authorization');
    const expectedSecret = process?.env?.CRON_SECRET;

    if (expectedSecret && cronSecret !== `Bearer ${expectedSecret}` && cronSecret !== expectedSecret) {
      console.warn('[CRON NOTIFICATIONS UNAUTHORIZED] Tentativa inválida de disparo da fila.');
      return NextResponse.json(
        { success: false, error: 'Acesso Não Autorizado. Token inválido.' },
        { status: 401 }
      );
    }

    console.log('[CRON QUEUE START] Iniciando disparo de notificações via fila...');

    const runResult = await processNotificationQueue();

    if (!runResult.success) {
      console.error('[CRON QUEUE FAILURE] Falha ao processar a fila de mensagens:', (runResult as any).error);
      return NextResponse.json(
        { 
          success: false, 
          error: (runResult as any).error || 'Falha no processador',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    console.log(`[CRON QUEUE COMPLETE] Itens processados: ${runResult.processedCount}, Sucessos: ${runResult.successCount}, Falhas: ${runResult.failedCount}`);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        total_processed: runResult.processedCount,
        success_count: runResult.successCount,
        failed_count: runResult.failedCount
      },
      details: runResult.details
    }, { status: 200 });

  } catch (err: any) {
    console.error('[CRON QUEUE CRITICAL] Erro catastrófico de roteamento:', err);
    return NextResponse.json(
      { 
        success: false, 
        error: err.message || 'Erro inesperado no roteamento do dispatcher de fila',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
