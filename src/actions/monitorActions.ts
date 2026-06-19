import { z } from 'zod';
import { supabase, getSupabaseConfig } from '../lib/supabase/client';

// 1. Zod Validation Schema for pristine inputs
export const monitorSchema = z.object({
  name: z.string().min(2, { message: 'O nome da conta/cliente deve ter no mínimo 2 caracteres.' }),
  target_url: z
    .string()
    .url({ message: 'Por favor, insira um endereço URL válido (Ex: https://exemplo.com).' })
    .or(z.string().length(0)),
  keyword: z.string().min(1, { message: 'Selecione uma plataforma ou palavra-chave.' }),
  frequency: z.string().min(1, { message: 'A frequência do rastreamento é obrigatória.' }),
  email: z.string(),
  whatsapp_number: z
    .string()
    .min(10, { message: 'WhatsApp com DDD inválido. Digite apenas números.' })
    .or(z.string().length(0)),
  is_active: z.boolean(),
});

export type MonitorInput = z.infer<typeof monitorSchema>;

export interface MonitorRecord {
  id: string;
  user_id: string;
  name: string;
  target_url: string;
  keyword: string;
  frequency: string;
  email: string;
  whatsapp_number: string;
  is_active: boolean;
  created_at: string;
}

// Helper to retrieve the current active user ID from the session or profiles table
async function getEffectiveUserId(): Promise<string | null> {
  try {
    // 1. Get cached session first (fastest, does not execute REST validation)
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.id) {
      return session.user.id;
    }
    
    // 2. Fallback to server-side user verification
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) {
      return user.id;
    }

    // 3. Fallback to public profiles first entry if configured
    const { data: firstProfile } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (firstProfile?.id) {
      return firstProfile.id;
    }
  } catch (e) {
    console.warn('Erro ao determinar id de usuário ativo:', e);
  }
  return null;
}

// 2. Server Action to list monitors
export async function getMonitorsAction(): Promise<{ success: boolean; data?: MonitorRecord[]; error?: string }> {
  try {
    const { url, anonKey, isConfigured } = getSupabaseConfig();
    if (!isConfigured) {
      return { success: false, error: 'Supabase não está configurado. Por favor, configure as credenciais.' };
    }

    const userId = await getEffectiveUserId();
    if (!userId) {
      return { success: false, error: 'Incapaz de localizar um perfil ou sessão de usuário ativa no sistema.' };
    }

    const { data, error } = await supabase
      .from('monitors')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as MonitorRecord[] };
  } catch (err: any) {
    return { success: false, error: err.message || 'Erro inesperado na sincronização.' };
  }
}

// 3. Server Action to create a new monitor validated with Zod
export async function createMonitorAction(input: MonitorInput): Promise<{ success: boolean; data?: MonitorRecord; error?: string }> {
  try {
    const parsed = monitorSchema.safeParse(input);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map(e => e.message).join(' | ');
      return { success: false, error: errorMsg };
    }

    const { isConfigured } = getSupabaseConfig();
    if (!isConfigured) {
      return { success: false, error: 'Supabase não está configurado. Cadastros estão desabilitados temporariamente.' };
    }

    const userId = await getEffectiveUserId();
    if (!userId) {
      return { success: false, error: 'Incapaz de localizar um usuário para associar o monitoramento.' };
    }

    const { data, error } = await supabase
      .from('monitors')
      .insert({
        user_id: userId,
        name: parsed.data.name,
        target_url: parsed.data.target_url || null,
        keyword: parsed.data.keyword,
        frequency: parsed.data.frequency || 'hourly',
        email: parsed.data.email || null,
        whatsapp_number: parsed.data.whatsapp_number || null,
        is_active: parsed.data.is_active
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as MonitorRecord };
  } catch (err: any) {
    return { success: false, error: err.message || 'Erro durante a criação.' };
  }
}

// 4. Server Action to update an existing monitor validated with Zod
export async function updateMonitorAction(id: string, input: MonitorInput): Promise<{ success: boolean; data?: MonitorRecord; error?: string }> {
  try {
    const parsed = monitorSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues.map(e => e.message).join(' | ') };
    }

    const { isConfigured } = getSupabaseConfig();
    if (!isConfigured) {
      return { success: false, error: 'Supabase não está configurado.' };
    }

    const userId = await getEffectiveUserId();
    if (!userId) {
      return { success: false, error: 'Usuário não localizado no sistema.' };
    }

    const { data, error } = await supabase
      .from('monitors')
      .update({
        name: parsed.data.name,
        target_url: parsed.data.target_url || null,
        keyword: parsed.data.keyword,
        frequency: parsed.data.frequency,
        email: parsed.data.email || null,
        whatsapp_number: parsed.data.whatsapp_number || null,
        is_active: parsed.data.is_active
      })
      .eq('id', id)
      .eq('user_id', userId) // security isolation double-check
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as MonitorRecord };
  } catch (err: any) {
    return { success: false, error: err.message || 'Erro durante a atualização.' };
  }
}

// 5. Server Action to toggle active status
export async function toggleMonitorStatusAction(id: string, nextStatus: boolean): Promise<{ success: boolean; error?: string }> {
  try {
    const { isConfigured } = getSupabaseConfig();
    if (!isConfigured) {
      return { success: false, error: 'Supabase off-line.' };
    }

    const userId = await getEffectiveUserId();
    if (!userId) {
      return { success: false, error: 'Usuário não localizado.' };
    }

    const { error } = await supabase
      .from('monitors')
      .update({ is_active: nextStatus })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// 6. Server Action to delete a monitor
export async function deleteMonitorAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { isConfigured } = getSupabaseConfig();
    if (!isConfigured) {
      return { success: false, error: 'Supabase off-line.' };
    }

    const userId = await getEffectiveUserId();
    if (!userId) {
      return { success: false, error: 'Usuário não autenticado.' };
    }

    const { error } = await supabase
      .from('monitors')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
