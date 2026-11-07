/**
 * Supabase Client & Configuration Bridge
 * Adheres to Supabase PostgreSQL architecture for production deployment.
 */

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

export function getSupabaseConfig(): SupabaseConfig {
  const url = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const anonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';
  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey && !url.includes('placeholder')),
  };
}

export const SUPABASE_CONFIG_INSTRUCTIONS = {
  description: 'Para ligar a sua base de dados PostgreSQL no Supabase:',
  steps: [
    '1. Aceda a https://supabase.com e crie um novo projeto (ex: marketplace-pt)',
    '2. No menu SQL Editor do Supabase, execute as migrações criadas (001_initial_schema.sql e 002_rls_policies.sql)',
    '3. Copie o Project URL e o Anon Public API Key nas definições do Supabase (Project Settings > API)',
    '4. Configure as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY',
  ],
};
