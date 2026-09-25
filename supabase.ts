import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve configuration safely from Vite environment variables
const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL || 'https://rpyzvhetoviqpjvncqfy.supabase.co';
const supabasePublishableKey: string = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

// Singleton Supabase client instance
export const supabase: SupabaseClient | null = (supabaseUrl && supabasePublishableKey)
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

/**
 * Returns whether Supabase is configured with a valid URL and publishable key
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabasePublishableKey && supabase);
}

export const SUPABASE_BUCKETS = {
  PRODUCT_IMAGES: 'product-images',
  PRODUCT_VIDEOS: 'product-videos',
  SITE_MEDIA: 'site-media',
} as const;
