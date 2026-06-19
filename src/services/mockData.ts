import { AdAccount, Alert, PlatformIntegration, Platform } from '../types';

export const INITIAL_INTEGRATIONS: PlatformIntegration[] = [
  { platform: 'facebook', connected: true, accountCount: 3, lastSync: 'Há 5 minutos' },
  { platform: 'google', connected: true, accountCount: 2, lastSync: 'Há 12 minutos' },
  { platform: 'tiktok', connected: false, accountCount: 0, lastSync: 'Nunca' },
  { platform: 'pinterest', connected: false, accountCount: 0, lastSync: 'Nunca' },
];

export const INITIAL_ACCOUNTS: AdAccount[] = [
  {
    id: 'acc_1',
    name: 'Vanguard Ecommerce - Principal',
    platform: 'facebook',
    status: 'error',
    activeCampaigns: 8,
    spend24h: 1840.50,
    unusualActivityCount: 2,
    lastSync: 'Há 5 minutos',
  },
  {
    id: 'acc_2',
    name: 'Infinity Cosméticos - Escala',
    platform: 'facebook',
    status: 'active',
    activeCampaigns: 14,
    spend24h: 3450.20,
    unusualActivityCount: 0,
    lastSync: 'Há 5 minutos',
  },
  {
    id: 'acc_3',
    name: 'Alpha Construtora - Leads',
    platform: 'google',
    status: 'active',
    activeCampaigns: 4,
    spend24h: 890.00,
    unusualActivityCount: 0,
    lastSync: 'Há 12 minutos',
  },
  {
    id: 'acc_4',
    name: 'Nexus Tech - Lançamentos',
    platform: 'google',
    status: 'error',
    activeCampaigns: 3,
    spend24h: 120.40,
    unusualActivityCount: 1,
    lastSync: 'Há 12 minutos',
  },
  {
    id: 'acc_5',
    name: 'Lumina Fashion - Retargeting',
    platform: 'facebook',
    status: 'paused',
    activeCampaigns: 0,
    spend24h: 0.00,
    unusualActivityCount: 0,
    lastSync: 'Há 45 minutos',
  }
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'alt_1',
    title: 'Anúncio Reprovado (Política de Sistemas de Elisão)',
    accountName: 'Vanguard Ecommerce - Principal',
    platform: 'facebook',
    severity: 'critical',
    timestamp: 'Hoje, 07:15',
    status: 'active',
    message: 'O criativo "Banner_Oferta_Inverno_v3.mp4" foi reprovado por infringir a política de sistemas de elisão do Facebook.',
    technicalReason: 'Uso de redirecionamento duplo no link de destino ou caracteres especiais mascarados na descrição de vendas.',
    recommendation: 'Verifique se a URL de destino possui redirecionadores ativos. Altere o texto removendo caracteres como asteriscos ou emojis em excesso que simulam termos proibidos. Submeta a nova versão sem camuflar o texto principal.'
  },
  {
    id: 'alt_2',
    title: 'Discrepância Crítica no Pixel (Conversões Zeradas)',
    accountName: 'Vanguard Ecommerce - Principal',
    platform: 'facebook',
    severity: 'critical',
    timestamp: 'Hoje, 06:40',
    status: 'active',
    message: 'Nenhum evento Purchase foi detectado nas últimas 4 horas, apesar de um investimento ativo de R$ 450,00 neste período.',
    technicalReason: 'A tag do pixel falhou ou a página de agradecimento ("thank-you") retornou erro 502/atualização de script de checkout.',
    recommendation: 'Acesse o Gerenciador de Eventos e use o Teste de Eventos em Tempo Real para simular uma compra. Peça para a equipe de desenvolvimento validar se o script do GTM ou da Shopify não foi modificado na última madrugada.'
  },
  {
    id: 'alt_3',
    title: 'Limite de Gasto Diário Excedido',
    accountName: 'Nexus Tech - Lançamentos',
    platform: 'google',
    severity: 'warning',
    timestamp: 'Hoje, 05:22',
    status: 'active',
    message: 'A campanha "[SEARCH] Leads Quentes Prime" alcançou 100% de seu orçamento diário às 10h da manhã.',
    technicalReason: 'Aumento drástico no volume de busca ou lances automáticos agressivos esgotaram a verba antes do horário nobre.',
    recommendation: 'Aumente o orçamento diário em 20% para colher conversões à tarde/noite, ou mude a estratégia de lances para Maximizar Conversões com um teto de CPA controlado.'
  },
  {
    id: 'alt_4',
    title: 'Cartão de Crédito Recusado pelo Gateway',
    accountName: 'Vanguard Ecommerce - Principal',
    platform: 'facebook',
    severity: 'critical',
    timestamp: 'Ontem, 21:30',
    status: 'resolved',
    message: 'A cobrança automática de R$ 2.500,00 falhou no cartão final 4810.',
    technicalReason: 'Transação negada pelo banco emissor sob o código de segurança 51 (saldo insuficiente ou bloqueio temporário por suspeita de fraude).',
    recommendation: 'Entre em contato com o gerente do banco empresarial para liberar pagamentos internacionais ou adicione um cartão de backup na conta de anúncios imediatamente para evitar pausa geral dos anúncios.'
  }
];

export interface ErrorTemplate {
  id: string;
  title: string;
  platform: Platform;
  errorLog: string;
}

export const ERROR_TEMPLATES: ErrorTemplate[] = [
  {
    id: 'tpl_1',
    title: 'Anúncio Rejeitado - Política de Marcas Registradas',
    platform: 'facebook',
    errorLog: 'Ad rejected: Brand infringement policy. Ad ID: ad_980128. Mention of "Nike" in ad copy without certified authorization.'
  },
  {
    id: 'tpl_2',
    title: 'URL de Destino Quebrada (Error 404)',
    platform: 'google',
    errorLog: 'Destination URL Unreachable. Campaign: Search_General_Sales. Ad ID: ad_651239. HTTP Status code returned: 404 Not Found.'
  },
  {
    id: 'tpl_3',
    title: 'Salto Drástico no Custo por Lead (CPA > 250%)',
    platform: 'facebook',
    errorLog: 'Anomaly detected: KPI threshold breached. Campaign: [CONV] Joias de Luxo. Metric: Cost per Acquisition. Threshold set: R$ 15.00. Current: R$ 38.50 (+256% compared to 7-day average).'
  },
  {
    id: 'tpl_4',
    title: 'Cartão Limite Excedido (Google Ads)',
    platform: 'google',
    errorLog: 'Billing Alert: Payment declined. Account: 302-894-1182. Reason: Account on hold due to unpaid balance of R$ 5,000.00. Primary Visa Card declined.'
  }
];

/**
 * Simulates generating a WhatsApp formatted response using local logic 
 * in perfect accordance with the rules of the premium SaaS "AlertAds":
 */
export function generateWhatsAppAlert(
  platform: Platform,
  title: string,
  accountName: string,
  errorLog: string
): { message: string; technicalReason: string; recommendation: string } {
  
  const formattedPlatform = platform === 'facebook' ? 'Meta Ads' : 'Google Ads';
  
  // Decide severity emoji
  let emoji = '🔴';
  if (title.toLowerCase().includes('cpa') || title.toLowerCase().includes('custo') || title.toLowerCase().includes('faturamento') || errorLog.toLowerCase().includes('warning')) {
    emoji = '⚠️';
  }

  let technicalReason = '';
  let recommendation = '';

  if (errorLog.includes('Brand infringement')) {
    technicalReason = 'Uso não autorizado de marca registrada de terceiros no criativo ou texto do anúncio.';
    recommendation = 'Substitua todas as menções diretas à marca proprietária por termos genéricos (ex: ao invés de "Tênis Nike original", use "Tênis esportivo premium importado") ou envie os documentos de licenciamento de marca para suporte da Meta.';
  } else if (errorLog.includes('404 Not Found') || errorLog.includes('Destination URL')) {
    technicalReason = 'A inteligência artificial do Google Ads detectou que a página de vendas está retornando um código de erro 404 (página desativada ou link digitado com erro de digitação).';
    recommendation = 'Corrija imediatamente a URL no anúncio para apontar para a página correta e ativa, ou configure um redirecionamento 301 caso o slug da página tenha sido alterado pela equipe de desenvolvimento.';
  } else if (errorLog.includes('Anomaly detected') || errorLog.includes('CPA')) {
    technicalReason = 'Fadiga repentina de criativos, perda brusca do índice de qualidade do anúncio ou sobreposição extrema de público na última madrugada.';
    recommendation = 'Pause imediatamente os 2 criativos de pior desempenho e suba e lance uma nova variação de vídeo com gancho curto. Revise se há duas campanhas mirando exatamente o mesmo interesse da agência.';
  } else if (errorLog.includes('Payment declined') || errorLog.includes('unpaid balance')) {
    technicalReason = 'O cartão empresarial configurado atingiu o limite de crédito ou a instituição emissora bloqueou a transação por atividade suspeita de segurança.';
    recommendation = 'Acesse o painel financeiro do Google Ads, processe o pagamento manualmente usando um cartão de backup ou emita um boleto expresso/Pix para evitar o banimento total da conta de anúncios.';
  } else {
    // Fallback dynamic generation
    technicalReason = 'A campanha de anúncios gerou uma falha operacional identificada nos logs devido a desalinhamento de diretrizes ou falha no rastreamento de eventos.';
    recommendation = 'Acesse as Configurações de Negócios da plataforma de anúncio, realize uma nova verificação de conformidade do link de destino e atualize os identificadores do pixel.';
  }

  const cleanTitle = title.replace('Anúncio Rejeitado - ', '').replace('URL de Destino ', '');

  const whatsappMessage = `${emoji} *ALERTADS • ALERTA DE TRÁFEGO EM TEMPO REAL*

*Conta:* ${accountName}
*Plataforma:* ${formattedPlatform}
*Problema:* ${cleanTitle}

*O que aconteceu (Técnico):*
${technicalReason}

*Ação recomendada imediata:*
👉 ${recommendation}

_Mensagem enviada automaticamente para o gestor responsável via AlertAds._`;

  return {
    message: whatsappMessage,
    technicalReason,
    recommendation
  };
}
