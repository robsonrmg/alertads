-- AlertAds - Atualização de Banco para a Etapa 6
-- Adiciona campos necessários para o motor de agendamento automático de monitoramento

ALTER TABLE public.monitors 
ADD COLUMN IF NOT EXISTS last_checked_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS next_check_at TIMESTAMPTZ DEFAULT NULL;

-- Atualiza dados legados para preencher o next_check_at inicial e garantir que rodem imediatamente
UPDATE public.monitors 
SET next_check_at = NOW() 
WHERE next_check_at IS NULL;
