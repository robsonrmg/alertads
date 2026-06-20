import { AlertType } from '../../types/monitoring';

export interface AlertTemplateData {
  monitorName: string;
  alertType: AlertType;
  message: string;
  dateTime: string;
  dashboardUrl: string;
}

export function getAlertTypeEmoji(type: AlertType): string {
  switch (type) {
    case 'new_ad':
      return '🟢'; // Aprovação importante / Novo anúncio
    case 'content_changed':
      return '⚠️'; // Aviso / Alteração
    case 'price_change':
      return '⚠️'; // Mudança de preço / Ajuste
    case 'keyword_found':
      return '🔴'; // Bloqueio / Termo proibido ou sensível
    default:
      return '🔔';
  }
}

export function getAlertTypeLabel(type: AlertType): string {
  switch (type) {
    case 'new_ad':
      return 'Novo Anúncio Detectado';
    case 'content_changed':
      return 'Conteúdo / Cópia Alterada';
    case 'price_change':
      return 'Discrepância de Preço/Oferta';
    case 'keyword_found':
      return 'Palavra-chave ou Termo Reprovado';
    default:
      return 'Alerta Geral de Anúncios';
  }
}

/**
 * Retorna o HTML do e-mail de alerta para o Resend
 */
export function getAlertEmailHtml(data: AlertTemplateData): string {
  const emoji = getAlertTypeEmoji(data.alertType);
  const label = getAlertTypeLabel(data.alertType);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>AlertAds - Novo Alerta Detectado</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; color: #1E293B; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { background: #0F172A; padding: 32px; text-align: center; color: #FFFFFF; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; }
        .content { padding: 32px; }
        .alert-badge { display: inline-flex; align-items: center; background-color: #F1F5F9; border: 1px solid #E2E8F0; padding: 6px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 24px; }
        .info-card { background-color: #F8FAFC; border: 1px solid #F1F5F9; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
        .info-row:last-child { margin-bottom: 0; }
        .info-label { color: #64748B; font-weight: 500; }
        .info-value { color: #0F172A; font-weight: 700; }
        .message-box { background-color: #FEF2F2; border-left: 4px solid #EF4444; border-radius: 4px; padding: 16px; margin-bottom: 28px; }
        .message-text { margin: 0; font-size: 14px; line-height: 1.6; color: #991B1B; font-weight: 500; }
        .cta-btn { display: block; text-align: center; background: linear-gradient(135deg, #F59E0B 0%, #EA580C 100%); color: #FFFFFF; padding: 14px 24px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; margin-bottom: 24px; }
        .footer { padding: 24px 32px; background-color: #F8FAFC; border-t: 1px solid #E2E8F0; text-align: center; font-size: 12px; color: #64748B; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>AlertAds Vigilante</h1>
        </div>
        <div class="content">
          <div class="alert-badge">
            <span>${emoji} ${label}</span>
          </div>
          
          <div class="info-card">
            <div class="info-row">
              <span class="info-label">Monitoramento:</span>
              <span class="info-value">${data.monitorName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Detectado em:</span>
              <span class="info-value">${data.dateTime}</span>
            </div>
          </div>

          <div class="message-box">
            <p class="message-text"><strong>Motivo Técnico:</strong><br/>${data.message}</p>
          </div>

          <a href="${data.dashboardUrl}" class="cta-btn" target="_blank">Acessar Painel Direct</a>
        </div>
        <div class="footer">
          <p>Este é um alerta automático gerado pelo micro-SaaS AlertAds.<br/>Configure suas notificações a qualquer momento no painel de configurações.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Retorna a mensagem de WhatsApp formatada
 */
export function getAlertWhatsAppMessage(data: AlertTemplateData): string {
  const emoji = getAlertTypeEmoji(data.alertType);
  const label = getAlertTypeLabel(data.alertType);

  return `${emoji} *Novo alerta no AlertAds*

*Monitoramento:* ${data.monitorName}
*Tipo:* ${label}
*Horário:* ${data.dateTime}

*Mensagem:*
${data.message}

Acesse seu dashboard para mais detalhes:
${data.dashboardUrl}`;
}
