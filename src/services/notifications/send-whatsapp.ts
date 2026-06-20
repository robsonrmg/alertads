import { getAlertWhatsAppMessage, AlertTemplateData } from '../../lib/notifications/notification-templates';

export interface SendWhatsAppResult {
  success: boolean;
  messageId?: string;
  error?: string;
  simulated?: boolean;
}

export async function sendWhatsApp(
  number: string,
  data: AlertTemplateData
): Promise<SendWhatsAppResult> {
  const getEnv = (key: string): string => {
    const env = (import.meta as any).env || {};
    return env[`VITE_${key}`] || (typeof process !== 'undefined' && process.env ? process.env[key] : '') || '';
  };

  const apiUrl = getEnv('EVOLUTION_API_URL');
  const apiKey = getEnv('EVOLUTION_API_KEY');
  const instanceName = getEnv('EVOLUTION_INSTANCE_NAME');

  const formattedMsg = getAlertWhatsAppMessage(data);

  // Sanitize phone number (remove all non-digits)
  let cleanNumber = number.replace(/\D/g, '');
  if (cleanNumber.length === 11 && !cleanNumber.startsWith('55')) {
    cleanNumber = '55' + cleanNumber;
  }

  console.log(`[ALERTADS EVOLUTION] Preparando envio de WhatsApp para: ${cleanNumber}`);

  if (!apiUrl || !apiKey || !instanceName) {
    console.warn('[ALERTADS EVOLUTION] Credenciais Evolution API ausentes no .env. Simulando envio de WhatsApp...');
    return {
      success: true,
      messageId: 'mock_wa_' + Math.random().toString(36).substring(2, 11),
      simulated: true
    };
  }

  try {
    let cleanUrl = apiUrl.trim().replace(/\/$/, '');
    let endpoint = `${cleanUrl}/message/sendText/${instanceName}`;
    if (cleanUrl.includes('/message/sendText')) {
      endpoint = cleanUrl;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey
      },
      body: JSON.stringify({
        number: cleanNumber,
        text: formattedMsg
      })
    });

    const resJson = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('[ALERTADS EVOLUTION] Falha no Envio pela Evolution API:', resJson);
      return {
        success: false,
        error: resJson.message || 'Erro retornado pela Evolution API'
      };
    }

    console.log('[ALERTADS EVOLUTION] WhatsApp enviado com sucesso!');
    return {
      success: true,
      messageId: resJson.key?.id || 'wa_sent_ok'
    };
  } catch (err: any) {
    console.error('[ALERTADS EVOLUTION] Exceção ao enviar WhatsApp:', err);
    return {
      success: false,
      error: err.message || 'Erro de conexão na Evolution API'
    };
  }
}
