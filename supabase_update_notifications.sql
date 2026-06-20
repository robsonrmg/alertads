-- AlertAds - Atualização do Banco para a Etapa 7
-- Cria a tabela de fila de notificações (notification_queue) para e-mail e WhatsApp

CREATE TABLE IF NOT EXISTS public.notification_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_id UUID REFERENCES public.alerts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    email_enabled BOOLEAN DEFAULT TRUE,
    whatsapp_enabled BOOLEAN DEFAULT TRUE,
    status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'sent', 'failed'
    attempts INTEGER DEFAULT 0,
    last_attempt_at TIMESTAMPTZ DEFAULT NULL,
    error_message TEXT,
    response_log TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ativar RLS para segurança multi-tenant
ALTER TABLE public.notification_queue ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para a fila de notificações
CREATE POLICY "Users can view their own notification cue" 
ON public.notification_queue FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own notification cue" 
ON public.notification_queue FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Índice explicativo para velocidade de varredura
CREATE INDEX IF NOT EXISTS idx_notification_queue_status_attempts 
ON public.notification_queue (status, attempts);
