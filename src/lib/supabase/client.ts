import { createClient } from '@supabase/supabase-js';

// Get clean configuration from environment variables (checking both Vite and Next.js prefixes)
const getEnvVar = (key: string): string => {
  const env = (import.meta as any).env || {};
  return (
    env[`VITE_${key}`] || 
    env[`NEXT_PUBLIC_${key}`] || 
    env[key] || 
    localStorage.getItem(`__alertads_temp_${key}`) || 
    ''
  );
};

// Lazy initialize variables
export const getSupabaseConfig = () => {
  let url = getEnvVar('SUPABASE_URL');
  const anonKey = getEnvVar('SUPABASE_ANON_KEY');
  
  // Sanitize trailing REST paths (e.g. /rest/v1/ or /rest/v1/o) that can break the Supabase client
  if (url) {
    url = url.trim().replace(/\/rest\/v1\/?.*$/, '');
  }
  
  return { url, anonKey, isConfigured: !!(url && anonKey) };
};

export const saveTemporaryCredentials = (url: string, anonKey: string) => {
  localStorage.setItem('__alertads_temp_SUPABASE_URL', url.trim());
  localStorage.setItem('__alertads_temp_SUPABASE_ANON_KEY', anonKey.trim());
  window.location.reload();
};

export const clearTemporaryCredentials = () => {
  localStorage.removeItem('__alertads_temp_SUPABASE_URL');
  localStorage.removeItem('__alertads_temp_SUPABASE_ANON_KEY');
  window.location.reload();
};

const config = getSupabaseConfig();

// Initialize the default Supabase Client
// If credentials are not present, we build a dummy or lazy proxy client, so the app loads safely.
export const supabase = createClient(
  config.url || 'https://placeholder-project.supabase.co',
  config.anonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);
