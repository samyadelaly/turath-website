import React, { useState } from 'react';
import { Database, CheckCircle2, AlertCircle, Loader2, UploadCloud, X, Copy, Check, ExternalLink, Code, KeyRound, ChevronDown, ChevronUp, Activity, ShieldCheck, RefreshCw } from 'lucide-react';
import { isSupabaseConfigured, getSupabasePublishableKey, setSupabaseCredentials } from './supabase';
import { migrateTurathToSupabase, MigrationProgress } from './supabaseMigration';
import { testSupabaseFullSetup, SupabaseFullTestResult } from './supabaseDatabase';

interface SupabaseMigrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMigrationComplete?: () => void;
}

const SUPABASE_SQL_SCRIPT = `-- ==============================================================================
-- TURATH LUXURY BRASS & COPPER - SUPABASE DATABASE SCHEMA SETUP
-- Project URL: https://rpyzvhetoviqpjvncqfy.supabase.co
-- Run this in your Supabase SQL Editor:
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

-- 3. PRODUCT IMAGES TABLE
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

-- 6. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'general',
  logo_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('product-images', 'product-images', true),
  ('product-videos', 'product-videos', true),
  ('site-media', 'site-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 8. RLS POLICIES
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read categories" ON public.categories;
DROP POLICY IF EXISTS "Admin write categories" ON public.categories;
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin write categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read products" ON public.products;
DROP POLICY IF EXISTS "Public read products" ON public.products;
DROP POLICY IF EXISTS "Admin write products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT TO public USING (true);
CREATE POLICY "Admin write products" ON public.products FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read product_images" ON public.product_images;
DROP POLICY IF EXISTS "Admin write product_images" ON public.product_images;
CREATE POLICY "Public read product_images" ON public.product_images FOR SELECT TO public USING (true);
CREATE POLICY "Admin write product_images" ON public.product_images FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read product_videos" ON public.product_videos;
DROP POLICY IF EXISTS "Admin write product_videos" ON public.product_videos;
CREATE POLICY "Public read product_videos" ON public.product_videos FOR SELECT TO public USING (true);
CREATE POLICY "Admin write product_videos" ON public.product_videos FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read site_content" ON public.site_content;
DROP POLICY IF EXISTS "Admin write site_content" ON public.site_content;
CREATE POLICY "Public read site_content" ON public.site_content FOR SELECT TO public USING (true);
CREATE POLICY "Admin write site_content" ON public.site_content FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin write site_settings" ON public.site_settings;
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT TO public USING (true);
CREATE POLICY "Admin write site_settings" ON public.site_settings FOR ALL TO public USING (true) WITH CHECK (true);

-- Storage Buckets & Objects RLS
DO $$
BEGIN
  EXECUTE 'ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY';
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

DROP POLICY IF EXISTS "Public read buckets" ON storage.buckets;
CREATE POLICY "Public read buckets" ON storage.buckets FOR SELECT TO public USING (true);

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
`;

const STORAGE_ONLY_SQL_SCRIPT = `-- ==============================================================================
-- 1. إنشاء الـ 3 مخازن (Storage Buckets) للصور والفيديوهات في Supabase
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES 
  ('product-images', 'product-images', true, 52428800),
  ('product-videos', 'product-videos', true, 104857600),
  ('site-media', 'site-media', true, 52428800)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = EXCLUDED.file_size_limit;

-- ==============================================================================
-- 2. إتاحة الصلاحيات للرفع والقراءة العامة بدون أخطاء RLS
-- ==============================================================================
DO $$
BEGIN
  EXECUTE 'ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY';
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

DROP POLICY IF EXISTS "Public read buckets" ON storage.buckets;
CREATE POLICY "Public read buckets" ON storage.buckets FOR SELECT TO public USING (true);

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
`;

export const SupabaseMigrationModal: React.FC<SupabaseMigrationModalProps> = ({
  isOpen,
  onClose,
  onMigrationComplete,
}) => {
  const [progress, setProgress] = useState<MigrationProgress>({
    status: 'idle',
    totalSteps: 0,
    completedSteps: 0,
    currentMessage: '',
  });
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlDetails, setShowSqlDetails] = useState(false);
  const [copiedStorageSql, setCopiedStorageSql] = useState(false);
  const [showStorageDetails, setShowStorageDetails] = useState(false);
  const [keyInput, setKeyInput] = useState(getSupabasePublishableKey());
  const [isConfiguredState, setIsConfiguredState] = useState(isSupabaseConfigured());
  const [keySavedFeedback, setKeySavedFeedback] = useState(false);
  const [showKeyGuide, setShowKeyGuide] = useState(!isSupabaseConfigured());
  const [copiedVarName, setCopiedVarName] = useState(false);
  const [testResult, setTestResult] = useState<SupabaseFullTestResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const isConfigured = isConfiguredState;

  if (!isOpen) return null;

  const handleRunTest = async () => {
    setIsTesting(true);
    try {
      const res = await testSupabaseFullSetup();
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        isConfigured: isSupabaseConfigured(),
        canConnect: false,
        hasTables: false,
        tables: { products: false, categories: false },
        hasBuckets: false,
        buckets: { productImages: false, productVideos: false, siteMedia: false },
        uploadPermission: false,
        message: err?.message || 'تعذر استكمال الفحص.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveKey = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!keyInput.trim()) return;
    const ok = setSupabaseCredentials(keyInput.trim());
    setIsConfiguredState(ok);
    setKeySavedFeedback(true);
    setTimeout(() => setKeySavedFeedback(false), 3000);
  };

  const handleCopyVarName = () => {
    navigator.clipboard.writeText('VITE_SUPABASE_PUBLISHABLE_KEY');
    setCopiedVarName(true);
    setTimeout(() => setCopiedVarName(false), 2500);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleCopyStorageSql = () => {
    navigator.clipboard.writeText(STORAGE_ONLY_SQL_SCRIPT);
    setCopiedStorageSql(true);
    setTimeout(() => setCopiedStorageSql(false), 3000);
  };

  const handleStartMigration = async () => {
    setProgress({
      status: 'running',
      totalSteps: 10,
      completedSteps: 0,
      currentMessage: 'جاري فحص الجداول والاتصال بقاعدة بيانات Supabase...',
    });

    const result = await migrateTurathToSupabase((p) => {
      setProgress(p);
    });

    if (result.success) {
      if (onMigrationComplete) {
        onMigrationComplete();
      }
    }
  };

  const percentage = progress.totalSteps > 0
    ? Math.round((progress.completedSteps / progress.totalSteps) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0e0e13] border border-[#d4c59d]/40 rounded-xl shadow-[0_15px_50px_rgba(0,0,0,0.9)] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#14141c] border-b border-[#d4c59d]/30 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#f5f0e6]">مزامنة ونقل البيانات إلى Supabase Free</h2>
              <p className="text-xs text-[#9e9174]">https://rpyzvhetoviqpjvncqfy.supabase.co</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-sm font-arabic overflow-y-auto">
          {/* Status Box */}
          <div className="p-4 rounded-lg bg-[#14141c] border border-stone-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-400">حالة الربط مع Supabase:</span>
              {isConfigured ? (
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  مفتاح الاتصال متصل
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  <AlertCircle className="w-3.5 h-3.5" />
                  في انتظار مفتاح VITE_SUPABASE_PUBLISHABLE_KEY
                </span>
              )}
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              هذه الأداة تقوم بنسخ جميع منتجات تراث، الأقسام، الصور، الفيديوهات، وشعار الموقع إلى قاعدة بيانات ومخزن Supabase الجديد دون فقدان أي بيانات وبشكل آمن ومستمر.
            </p>
          </div>

          {/* Key Input & Setup Guide Box */}
          <div className="p-4 rounded-lg bg-[#14141c] border border-[#d4c59d]/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#d4c59d] flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#d4c59d]" />
                مفتاح Supabase (Anon / Publishable Key)
              </span>
              <button
                type="button"
                onClick={() => setShowKeyGuide(!showKeyGuide)}
                className="text-[11px] text-stone-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>{showKeyGuide ? 'إخفاء الخطوات' : 'شرح الخطوات'}</span>
                {showKeyGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            <form onSubmit={handleSaveKey} className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="الصق مفتاح anon / public هنا (eyJhbGciOi...)"
                  className="flex-1 px-3 py-2 text-xs bg-black/70 border border-stone-700 rounded-lg text-white font-mono placeholder:text-stone-600 focus:outline-none focus:border-[#d4c59d] transition-colors"
                  dir="ltr"
                />
                <button
                  type="submit"
                  disabled={!keyInput.trim()}
                  className="px-3.5 py-2 text-xs font-bold text-black bg-[#d4c59d] hover:bg-[#c2b28a] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                >
                  {keySavedFeedback ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>تم الحفظ!</span>
                    </>
                  ) : (
                    <span>تفعيل فوراً</span>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-stone-400">
                يمكنك لصق المفتاح هنا مباشرة لتفعيل المزامنة في هذه الجلسة فوراً دون إعادة نشر الموقع.
              </p>
            </form>

            {showKeyGuide && (
              <div className="p-3 bg-black/50 rounded-lg border border-stone-800 space-y-2.5 text-xs text-stone-300">
                <div className="font-bold text-[#d4c59d] flex items-center justify-between">
                  <span>خطوات جلب المفتاح وإضافته:</span>
                  <a
                    href="https://supabase.com/dashboard/project/rpyzvhetoviqpjvncqfy/settings/api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#d4c59d] hover:text-white flex items-center gap-1 underline transition-colors"
                  >
                    فتح صفحة الـ API في Supabase
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <ol className="list-decimal list-inside space-y-1.5 text-stone-300 text-[11px] leading-relaxed">
                  <li>
                    افتح لوحة تحكم مشروعك في <strong>Supabase</strong> ثم اذهب إلى <strong>Settings</strong> ➔ <strong>API</strong>.
                  </li>
                  <li>
                    تحت عنوان <strong>Project API keys</strong>، انسخ قيمة المفتاح المسمى <strong>anon</strong> (public).
                  </li>
                  <li>
                    الصقه في الحقل أعلاه واضغط <strong>«تفعيل فوراً»</strong> للمزامنة المباشرة.
                  </li>
                </ol>

                <div className="pt-2 border-t border-stone-800 text-[11px] space-y-1">
                  <div className="font-bold text-[#e6dcc5]">للتشغيل الدائم على Vercel:</div>
                  <p className="text-stone-400 leading-relaxed">
                    1. افتح مشروعك في Vercel ➔ Settings ➔ Environment Variables.
                  </p>
                  <div className="flex items-center gap-2 py-1">
                    <span className="text-stone-400">اسم المتغير:</span>
                    <code className="px-2 py-0.5 bg-stone-900 border border-stone-700 rounded text-amber-300 font-mono text-[10px]">
                      VITE_SUPABASE_PUBLISHABLE_KEY
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyVarName}
                      className="px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      {copiedVarName ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedVarName ? 'تم النسخ' : 'نسخ الاسم'}</span>
                    </button>
                  </div>
                  <p className="text-stone-400 leading-relaxed">
                    2. في خانة Value الصق المفتاح الذي نسخته من Supabase ثم اضغط <strong>Save</strong>.
                  </p>
                  <p className="text-stone-400 leading-relaxed">
                    3. اذهب إلى Deployments واضغط <strong>Redeploy</strong> ليعمل بشكل دائم.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Test & Diagnostic Box */}
          <div className="p-4 rounded-lg bg-[#14141c] border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                فحص واختبار الجاهزية (Test Supabase)
              </span>
              <button
                type="button"
                onClick={handleRunTest}
                disabled={isTesting || progress.status === 'running'}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 text-xs font-bold border border-cyan-500/40 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    <span>جاري الفحص...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>تشغيل فحص شامل</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-stone-300 leading-relaxed">
              يمكنك التحقق فوراً وبضغطة زر واحدة من أن المفتاح والجداول ومخازن الصور وسياسات الأمان (Policies) تعمل بنجاح 100% قبل بدء النقل.
            </p>

            {testResult && (
              <div className="p-3 bg-black/60 rounded border border-stone-800 space-y-2.5 text-xs">
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    {testResult.canConnect ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                    )}
                    <span className={testResult.canConnect ? 'text-emerald-300' : 'text-stone-400'}>
                      الاتصال بالسيرفر
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {testResult.hasTables ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    )}
                    <span className={testResult.hasTables ? 'text-emerald-300' : 'text-stone-400'}>
                      جداول المنتجات والأقسام
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {testResult.hasBuckets ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    )}
                    <span className={testResult.hasBuckets ? 'text-emerald-300' : 'text-stone-400'}>
                      أوعية الصور (3 Buckets)
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {testResult.uploadPermission ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    )}
                    <span className={testResult.uploadPermission ? 'text-emerald-300' : 'text-stone-400'}>
                      صلاحيات الرفع (Policies)
                    </span>
                  </div>
                </div>

                <div
                  className={`p-2.5 rounded text-[11px] leading-relaxed ${
                    testResult.canConnect && testResult.hasTables && testResult.hasBuckets && testResult.uploadPermission
                      ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                      : 'bg-amber-950/40 border border-amber-500/40 text-amber-300'
                  }`}
                >
                  <p className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                    {testResult.message}
                  </p>
                  {testResult.error && (
                    <p className="mt-1 text-[10px] text-red-300 font-mono">{testResult.error}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SQL Setup Helper */}
          <div className="p-4 rounded-lg bg-[#111116] border border-[#d4c59d]/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#d4c59d] flex items-center gap-2">
                <Code className="w-4 h-4 text-[#d4c59d]" />
                تهيئة الجداول والمخازن (SQL Schema)
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="https://supabase.com/dashboard/project/rpyzvhetoviqpjvncqfy/sql"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#d4c59d] hover:text-white flex items-center gap-1 underline transition-colors"
                >
                  فتح SQL Editor
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              إذا ظهر لك تنبيه عدم العثور على الجداول (<code className="text-amber-400 font-mono">PGRST205</code>)، انسخ كود SQL بالزر أدناه، والصقه في Supabase SQL Editor ثم اضغط Run لإنشاء الجداول فوراً.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopySql}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-[#d4c59d] text-xs font-bold border border-stone-700 transition-colors cursor-pointer"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">تم نسخ كود SQL بنجاح!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ كود SQL لإنشاء الجداول</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowSqlDetails(!showSqlDetails)}
                className="text-[11px] text-stone-400 hover:text-white underline cursor-pointer"
              >
                {showSqlDetails ? 'إخفاء الكود' : 'معاينة الكود'}
              </button>
            </div>
            {showSqlDetails && (
              <pre className="p-3 bg-black/60 rounded text-[10px] text-stone-300 font-mono max-h-40 overflow-y-auto whitespace-pre-wrap border border-stone-800">
                {SUPABASE_SQL_SCRIPT}
              </pre>
            )}
          </div>

          {/* Storage Buckets Setup Card */}
          <div className="p-4 rounded-lg bg-[#111116] border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" />
                مخازن الصور والفيديوهات (Storage Buckets)
              </span>
              <a
                href="https://supabase.com/dashboard/project/rpyzvhetoviqpjvncqfy/storage/buckets"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-amber-300 hover:text-white flex items-center gap-1 underline transition-colors"
              >
                فتح Storage في Supabase
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-stone-300 leading-relaxed">
              لحفظ ورفع الصور والفيديوهات، يحتاج Supabase إلى إنشاء <strong className="text-white">3 أوعية تخزين عامة (Public Buckets)</strong>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="p-2 bg-black/50 border border-stone-800 rounded">
                <span className="font-mono text-emerald-400 block font-bold">product-images</span>
                <span className="text-stone-400 text-[10px]">لصور المنتجات والمعرض</span>
              </div>
              <div className="p-2 bg-black/50 border border-stone-800 rounded">
                <span className="font-mono text-emerald-400 block font-bold">product-videos</span>
                <span className="text-stone-400 text-[10px]">لفيديوهات المنتجات والأقسام</span>
              </div>
              <div className="p-2 bg-black/50 border border-stone-800 rounded">
                <span className="font-mono text-emerald-400 block font-bold">site-media</span>
                <span className="text-stone-400 text-[10px]">لصور من نحن واللوجو</span>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyStorageSql}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 text-xs font-bold border border-amber-500/40 transition-colors cursor-pointer"
              >
                {copiedStorageSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">تم نسخ كود الـ Buckets والصلاحيات!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ كود SQL لإنشاء وتفعيل الـ Buckets</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowStorageDetails(!showStorageDetails)}
                className="text-[11px] text-stone-400 hover:text-white underline cursor-pointer"
              >
                {showStorageDetails ? 'إخفاء' : 'معاينة'}
              </button>
            </div>
            {showStorageDetails && (
              <pre className="p-3 bg-black/60 rounded text-[10px] text-amber-200/90 font-mono max-h-36 overflow-y-auto whitespace-pre-wrap border border-stone-800">
                {STORAGE_ONLY_SQL_SCRIPT}
              </pre>
            )}
          </div>

          {/* Progress Section */}
          {progress.status === 'running' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#d4c59d] flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  {progress.currentMessage}
                </span>
                <span className="font-mono text-emerald-400 font-bold">{percentage}%</span>
              </div>
              <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                <div
                  className="h-full bg-gradient-to-r from-[#d4c59d] to-emerald-500 transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )}

          {progress.status === 'completed' && (
            <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-400" />
              <div>
                <p className="font-bold text-xs">اكتملت المزامنة بنجاح تام!</p>
                <p className="text-xs mt-1 text-emerald-200/80">{progress.currentMessage}</p>
              </div>
            </div>
          )}

          {progress.status === 'error' && (
            <div className="p-4 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
              <div>
                <p className="font-bold text-xs">تنبيه أثناء المزامنة:</p>
                <p className="text-xs mt-1 text-red-200/80 leading-relaxed">{progress.error}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleRunTest}
              disabled={isTesting || progress.status === 'running'}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-cyan-400 hover:text-cyan-300 text-xs font-bold border border-cyan-500/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  <span>جاري الفحص...</span>
                </>
              ) : (
                <>
                  <Activity className="w-3.5 h-3.5" />
                  <span>فحص واختبار (Test)</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-stone-300 hover:text-white transition-colors cursor-pointer"
              >
                إغلاق
              </button>
              <button
                onClick={handleStartMigration}
                disabled={progress.status === 'running'}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-md cursor-pointer"
              >
                {progress.status === 'running' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري النقل...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>بدء النقل والمزامنة</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
