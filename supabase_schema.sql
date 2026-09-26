-- ==============================================================================
-- TURATH LUXURY BRASS & COPPER - SUPABASE DATABASE SCHEMA & RLS SETUP
-- Project URL: https://rpyzvhetoviqpjvncqfy.supabase.co
-- Run this script in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ==============================================================================

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_arabic TEXT,
  short_desc TEXT,
  description TEXT,
  cover_image TEXT,
  icon_name TEXT DEFAULT 'Sparkles',
  cover_media_type TEXT DEFAULT 'image',
  cover_video_url TEXT,
  cover_image_ratio TEXT DEFAULT 'Original',
  custom_ratio_width NUMERIC DEFAULT 5,
  custom_ratio_height NUMERIC DEFAULT 7,
  cover_image_fit TEXT DEFAULT 'cover',
  cover_image_position TEXT DEFAULT 'center',
  cover_video_ratio TEXT DEFAULT '16:7',
  cover_video_fit TEXT DEFAULT 'cover',
  cover_video_position TEXT DEFAULT 'center',
  cover_video_muted BOOLEAN DEFAULT false,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  gallery_ratios JSONB DEFAULT '{}'::jsonb,
  gallery_fits JSONB DEFAULT '{}'::jsonb,
  gallery_positions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  sku TEXT,
  category_id TEXT REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_ar TEXT,
  tagline TEXT,
  short_desc_en TEXT,
  short_desc_ar TEXT,
  description TEXT,
  full_description_en TEXT,
  full_description_ar TEXT,
  story TEXT,
  main_image TEXT NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  media_type TEXT DEFAULT 'image',
  image_ratio TEXT DEFAULT 'Original',
  custom_ratio_width NUMERIC DEFAULT 5,
  custom_ratio_height NUMERIC DEFAULT 7,
  image_fit TEXT DEFAULT 'cover',
  image_position TEXT DEFAULT 'center',
  image_ratios JSONB DEFAULT '{}'::jsonb,
  image_fits JSONB DEFAULT '{}'::jsonb,
  image_positions JSONB DEFAULT '{}'::jsonb,
  video_url TEXT,
  product_video TEXT,
  video_ratio TEXT DEFAULT '16:9',
  video_custom_ratio_width NUMERIC DEFAULT 16,
  video_custom_ratio_height NUMERIC DEFAULT 9,
  video_fit TEXT DEFAULT 'cover',
  video_position TEXT DEFAULT 'center',
  video_poster TEXT,
  material TEXT DEFAULT 'Yellow Brass',
  materials TEXT DEFAULT 'Solid High-Grade Egyptian Yellow Brass',
  material_details TEXT,
  finish TEXT DEFAULT 'Antique Patina Brass',
  finish_options JSONB DEFAULT '["Antique Brass", "Polished Gold Brass"]'::jsonb,
  finish_details TEXT,
  craft_technique TEXT,
  technique_details TEXT,
  dimensions TEXT DEFAULT 'Custom sizing available',
  height TEXT,
  width TEXT,
  depth TEXT,
  diameter TEXT,
  weight TEXT,
  custom_dimensions TEXT,
  custom_size TEXT,
  custom_design TEXT,
  custom_finish TEXT,
  custom_details TEXT,
  availability TEXT DEFAULT 'made_to_order',
  lead_time TEXT DEFAULT '10-14 business days',
  applications JSONB DEFAULT '["Homes", "Villas", "Palaces", "Hotels", "Hospitality", "Interior Projects"]'::jsonb,
  price TEXT,
  price_type TEXT DEFAULT 'quote',
  featured BOOLEAN DEFAULT false,
  visibility TEXT DEFAULT 'published',
  seo_slug TEXT,
  seo_title TEXT,
  meta_description TEXT,
  seo_keywords TEXT,
  whatsapp_message TEXT,
  related_product_ids JSONB DEFAULT '[]'::jsonb,
  category_fields JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PRODUCT IMAGES TABLE (Centralized Media Registry)
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_main BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  ratio TEXT DEFAULT 'Original',
  fit TEXT DEFAULT 'cover',
  position TEXT DEFAULT 'center',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. PRODUCT VIDEOS TABLE
CREATE TABLE IF NOT EXISTS public.product_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  video_url TEXT NOT NULL,
  poster_url TEXT,
  ratio TEXT DEFAULT '16:9',
  fit TEXT DEFAULT 'cover',
  position TEXT DEFAULT 'center',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. SITE CONTENT TABLE
CREATE TABLE IF NOT EXISTS public.site_content (
  id TEXT PRIMARY KEY DEFAULT 'current_content',
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. SITE SETTINGS TABLE (Logo & Branding)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'general',
  logo_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- STORAGE BUCKETS INITIALIZATION
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES 
  ('product-images', 'product-images', true, 52428800),
  ('product-videos', 'product-videos', true, 104857600),
  ('site-media', 'site-media', true, 52428800)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = EXCLUDED.file_size_limit;

-- Enable RLS on storage buckets and objects safely
DO $$
BEGIN
  EXECUTE 'ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY';
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Allow public read of public buckets metadata
DROP POLICY IF EXISTS "Public read buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Allow all buckets read" ON storage.buckets;
CREATE POLICY "Public read buckets" ON storage.buckets FOR SELECT TO public USING (true);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Public visitors have READ access
-- Anon/Authenticated users with publishable key have read/write access for Admin
-- ==============================================================================

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Categories RLS
DROP POLICY IF EXISTS "Public read categories" ON public.categories;
DROP POLICY IF EXISTS "Admin write categories" ON public.categories;
CREATE POLICY "Public read categories" ON public.categories FOR SELECT TO public USING (true);
CREATE POLICY "Admin write categories" ON public.categories FOR ALL TO public USING (true) WITH CHECK (true);

-- Products RLS
DROP POLICY IF EXISTS "Public read products" ON public.products;
DROP POLICY IF EXISTS "Admin write products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT TO public USING (true);
CREATE POLICY "Admin write products" ON public.products FOR ALL TO public USING (true) WITH CHECK (true);

-- Product Images RLS
DROP POLICY IF EXISTS "Public read product_images" ON public.product_images;
DROP POLICY IF EXISTS "Admin write product_images" ON public.product_images;
CREATE POLICY "Public read product_images" ON public.product_images FOR SELECT TO public USING (true);
CREATE POLICY "Admin write product_images" ON public.product_images FOR ALL TO public USING (true) WITH CHECK (true);

-- Product Videos RLS
DROP POLICY IF EXISTS "Public read product_videos" ON public.product_videos;
DROP POLICY IF EXISTS "Admin write product_videos" ON public.product_videos;
CREATE POLICY "Public read product_videos" ON public.product_videos FOR SELECT TO public USING (true);
CREATE POLICY "Admin write product_videos" ON public.product_videos FOR ALL TO public USING (true) WITH CHECK (true);

-- Site Content RLS
DROP POLICY IF EXISTS "Public read site_content" ON public.site_content;
DROP POLICY IF EXISTS "Admin write site_content" ON public.site_content;
CREATE POLICY "Public read site_content" ON public.site_content FOR SELECT TO public USING (true);
CREATE POLICY "Admin write site_content" ON public.site_content FOR ALL TO public USING (true) WITH CHECK (true);

-- Site Settings RLS
DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin write site_settings" ON public.site_settings;
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT TO public USING (true);
CREATE POLICY "Admin write site_settings" ON public.site_settings FOR ALL TO public USING (true) WITH CHECK (true);

-- Storage Objects RLS (product-images, product-videos, site-media)
DROP POLICY IF EXISTS "Public read storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin update storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete storage" ON storage.objects;
DROP POLICY IF EXISTS "Allow public storage select" ON storage.objects;
DROP POLICY IF EXISTS "Allow public storage insert" ON storage.objects;
DROP POLICY IF EXISTS "Allow public storage update" ON storage.objects;
DROP POLICY IF EXISTS "Allow public storage delete" ON storage.objects;

CREATE POLICY "Allow public storage select" ON storage.objects 
  FOR SELECT TO public 
  USING (bucket_id IN ('product-images', 'product-videos', 'site-media'));

CREATE POLICY "Allow public storage insert" ON storage.objects 
  FOR INSERT TO public 
  WITH CHECK (bucket_id IN ('product-images', 'product-videos', 'site-media'));

CREATE POLICY "Allow public storage update" ON storage.objects 
  FOR UPDATE TO public 
  USING (bucket_id IN ('product-images', 'product-videos', 'site-media'))
  WITH CHECK (bucket_id IN ('product-images', 'product-videos', 'site-media'));

CREATE POLICY "Allow public storage delete" ON storage.objects 
  FOR DELETE TO public 
  USING (bucket_id IN ('product-images', 'product-videos', 'site-media'));
