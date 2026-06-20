import { getAlertEmailHtml, AlertTemplateData } from '../../lib/notifications/notification-templates';

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  simulated?: boolean;
}

export async function sendEmail(
  toEmail: string,
  subject: string,
  data: AlertTemplateData
): Promise<SendEmailResult> {
  const getEnv = (key: string): string => {
    const env = (import.meta as any).env || {};
    return env[`VITE_${key}`] || (typeof process !== 'undefined' && process.env ? process.env[key] : '') || '';
  };

  const apiKey = getEnv('RESEND_API_KEY');
  const fromEmail = getEnv('RESEND_FROM_EMAIL') || 'onboarding@resend.dev';

  console.log(`[ALERTADS RESEND] Preparando envio de e-mail para ${toEmail}`);

  if (!apiKey) {
    console.warn('[ALERTADS RESEND] RESEND_API_KEY não configurado no .env. Simulando envio de e-mail...');
    return {
      success: true,
      messageId: 'mock_email_' + Math.random().toString(36).substring(2, 11),
      simulated: true
    };
  }

  try {
    const htmlContent = getAlertEmailHtml(data);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject: subject,
        html: htmlContent
      })
    });

    const resJson = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('[ALERTADS RESEND] Falha no Envio pela API Resend:', resJson);
      return {
        success: false,
        error: resJson.message || 'Erro na API do Resend'
      };
    }

    console.log('[ALERTADS RESEND] E-mail enviado com sucesso! ID:', resJson.id);
    return {
      success: true,
      messageId: resJson.id
    };
  } catch (err: any) {
    console.error('[ALERTADS RESEND] Exceção ao enviar e-mail via Resend:', err);
    return {
      success: false,
      error: err.message || 'Erro de conexão'
    };
  }
}
