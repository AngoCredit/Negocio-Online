import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase browser client.
 *
 * Only the project URL and publishable/anon key belong in the browser.
 * Never expose the service_role key in VITE_* variables or client code.
 */
export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

export function getSupabaseConfig(): SupabaseConfig {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '';

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey),
  };
}

const config = getSupabaseConfig();

/**
 * Null until the local environment has valid Supabase credentials.
 * Consumers must check availability before making requests.
 */
export const supabase: SupabaseClient | null = config.isConfigured
  ? createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const isSupabaseConfigured = config.isConfigured;
