import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://rpyzvhetoviqpjvncqfy.supabase.co';
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_xJpsJH--P7kPUwmrVNOwwQ_T12KVuWG';

export function getSupabaseUrl(): string {
  try {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      const local = window.localStorage.getItem('turath_supabase_url');
      if (local && local.trim()) return local.trim();
    }
  } catch {}
  return (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || DEFAULT_SUPABASE_URL;
}

export function getSupabasePublishableKey(): string {
  try {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      const local = window.localStorage.getItem('turath_supabase_key');
      if (local && local.trim()) return local.trim();
    }
  } catch {}
  return (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY) || DEFAULT_SUPABASE_PUBLISHABLE_KEY;
}

function createSupabaseInstance(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const key = getSupabasePublishableKey();
  if (!url || !key) return null;
  try {
    return createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  } catch (e) {
    console.error('[Supabase] Failed to init client:', e);
    return null;
  }
}

export let supabase: SupabaseClient | null = createSupabaseInstance();

export function setSupabaseCredentials(key: string, url?: string): boolean {
  try {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      if (key && key.trim()) {
        window.localStorage.setItem('turath_supabase_key', key.trim());
      } else {
        window.localStorage.removeItem('turath_supabase_key');
      }
      if (url && url.trim()) {
        window.localStorage.setItem('turath_supabase_url', url.trim());
      }
    }
  } catch {}
  supabase = createSupabaseInstance();
  return Boolean(supabase);
}

/**
 * Returns whether Supabase is configured with a valid URL and publishable key
 */
export function isSupabaseConfigured(): boolean {
  const key = getSupabasePublishableKey();
  const url = getSupabaseUrl();
  if (!key || !url) return false;
  if (!supabase) {
    supabase = createSupabaseInstance();
  }
  return Boolean(supabase);
}

export const SUPABASE_BUCKETS = {
  PRODUCT_IMAGES: 'product-images',
  PRODUCT_VIDEOS: 'product-videos',
  SITE_MEDIA: 'site-media',
} as const;

