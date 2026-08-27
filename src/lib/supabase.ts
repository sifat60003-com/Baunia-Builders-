import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const getSupabaseCredentials = () => {
  const metaEnv = (import.meta as any).env || {};
  const url = metaEnv.VITE_SUPABASE_URL || localStorage.getItem('supabase_url') || 'https://hvevhdugdjiuroghesqn.supabase.co';
  const key = metaEnv.VITE_SUPABASE_ANON_KEY || localStorage.getItem('supabase_anon_key') || '';
  return { url: url.trim(), key: key.trim() };
};

export const isSupabaseConfigured = (): boolean => {
  const { url, key } = getSupabaseCredentials();
  return Boolean(url && key && !url.includes('placeholder'));
};

let currentClient: SupabaseClient | null = null;
let currentUrl = '';
let currentKey = '';

export const getSupabase = (): SupabaseClient => {
  const { url, key } = getSupabaseCredentials();
  const validUrl = url || 'https://placeholder.supabase.co';
  const validKey = key || 'placeholder';

  if (!currentClient || currentUrl !== validUrl || currentKey !== validKey) {
    currentUrl = validUrl;
    currentKey = validKey;
    currentClient = createClient(validUrl, validKey);
  }
  return currentClient;
};

export const saveSupabaseCredentials = (url: string, key: string) => {
  if (url.trim()) localStorage.setItem('supabase_url', url.trim());
  else localStorage.removeItem('supabase_url');

  if (key.trim()) localStorage.setItem('supabase_anon_key', key.trim());
  else localStorage.removeItem('supabase_anon_key');

  const validUrl = url.trim() || 'https://placeholder.supabase.co';
  const validKey = key.trim() || 'placeholder';
  currentUrl = validUrl;
  currentKey = validKey;
  currentClient = createClient(validUrl, validKey);
};

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop: keyof SupabaseClient) {
    const client = getSupabase();
    const value = client[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  }
});
