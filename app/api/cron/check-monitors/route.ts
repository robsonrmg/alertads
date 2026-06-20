import { NextResponse } from 'next/server';
import { checkAllMonitors } from '../../../../services/monitoring/check-monitor';

/**
 * Endpoint de Cron Job automatizado para o AlertAds.
 * 
 * Atendente as regras de roteamento do Next.js 15 App Router.
 * Pode ser engatilhado por serviços externos (e.g., Vercel Cron, Cron-job, GitHub Actions)
 * de forma a ser executado periodicamente (Recomendado: a cada 5 minutos).
 * 
 * Rota: GET /api/cron/check-monitors
 */
export async function GET(request: Request) {
  try {
    // 1. Opcional - Proteção por Header de Autorização (Prevenir execuções maliciosas)
    const { searchParams } = new URL(request.url);
    const cronSecret = searchParams.get('secret') || request.headers.get('Authorization');
    const expectedSecret = process.env.CRON_SECRET;

    if (expectedSecret && cronSecret !== `Bearer ${expectedSecret}` && cronSecret !== expectedSecret) {
      console.warn('[CRON UNAUTHORIZED] Tentativa inválida de disparo do robô de monitoria.');
      return NextResponse.json(
        { success: false, error: 'Acesso Não Autorizado. Token inválido.' },
        { status: 401 }
      );
    }

    console.log('[CRON START] Robô AlertAds Iniciando verificação de rotinas...');

    // 2. Executa a varredura geral de canais ativos
    const runResult = await checkAllMonitors();

    if (!runResult.success) {
      console.error('[CRON FAILURE] Falha geral no processador central:', runResult.error);
      return NextResponse.json(
        { 
          success: false, 
          error: runResult.error,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    const { results } = runResult;
    const errors = results.filter(r => r.status === 'error');
    const successes = results.filter(r => r.status === 'success');
    const alertsCreated = results.filter(r => r.alertGenerated);

    console.log(`[CRON COMPLETE] Sucesso: ${successes.length}, Erros: ${errors.length}, Alertas Gerados: ${alertsCreated.length}`);

    // 3. Retorna diagnóstico consolidado da execução para persistência lógica
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        total_processed: results.length,
        success_count: successes.length,
        failed_count: errors.length,
        alerts_raised: alertsCreated.length
      },
      details: results
    }, { status: 200 });

  } catch (err: any) {
    console.error('[CRON CRITICAL ERROR] Falha de exceção insolúvel:', err);
    return NextResponse.json(
      { 
        success: false, 
        error: err.message || 'Erro inesperado no roteamento de cron',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
