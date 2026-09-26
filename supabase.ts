import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://rpyzvhetoviqpjvncqfy.supabase.co';

export function getSupabaseUrl(): string {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('turath_supabase_url');
    if (local && local.trim()) return local.trim();
  }
  return import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
}

export function getSupabasePublishableKey(): string {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('turath_supabase_key');
    if (local && local.trim()) return local.trim();
  }
  return import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
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
  if (typeof window !== 'undefined') {
    if (key && key.trim()) {
      localStorage.setItem('turath_supabase_key', key.trim());
    } else {
      localStorage.removeItem('turath_supabase_key');
    }
    if (url && url.trim()) {
      localStorage.setItem('turath_supabase_url', url.trim());
    }
  }
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

