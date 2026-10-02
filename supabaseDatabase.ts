import { supabase, isSupabaseConfigured } from './supabase';
import { ProductItem, ProductCategoryInfo, ProjectItem, ClientPartnerItem } from './types';
import { SiteContent } from './siteContentStorage';
import { getStoredCategories } from './categoryStorage';
import { PRODUCT_CATEGORIES } from './initialCatalog';
import { isFakeOrDemoImage, isFakeOrDemoVideo } from './storage';

// -----------------------------------------------------------------------------
// PRODUCTS CRUD (SUPABASE)
// -----------------------------------------------------------------------------

export function mapProductToSupabaseRow(product: ProductItem): Record<string, any> {
  const cleanMain = (product.mainImage && !isFakeOrDemoImage(product.mainImage)) ? product.mainImage.trim() : null;
  const cleanImages = (Array.isArray(product.images) ? product.images : (cleanMain ? [cleanMain] : []))
    .filter((img) => typeof img === 'string' && img.trim().length > 0 && !isFakeOrDemoImage(img));
  const cleanGallery = (Array.isArray(product.galleryImages) ? product.galleryImages : cleanImages.slice(1))
    .filter((img) => typeof img === 'string' && img.trim().length > 0 && !isFakeOrDemoImage(img));
  const cleanVideo = (product.videoUrl && !isFakeOrDemoVideo(product.videoUrl)) ? product.videoUrl.trim() : null;
  const cleanProductVideo = (product.productVideo && !isFakeOrDemoVideo(product.productVideo)) ? product.productVideo.trim() : null;

  // Guarantee that main_image is never null or empty to satisfy PostgreSQL NOT NULL constraint
  const resolvedMainImage =
    cleanMain ||
    (cleanImages.length > 0 ? cleanImages[0] : null) ||
    (typeof product.mainImage === 'string' && product.mainImage.trim().length > 0 ? product.mainImage.trim() : null) ||
    '/turath_logo.jpg';
  const finalImagesList = cleanImages.length > 0 ? cleanImages : [resolvedMainImage];

  return {
    id: product.id,
    sku: product.sku || product.id,
    category_id: product.categoryId,
    name: product.nameEN || product.name || 'Untitled Piece',
    name_en: product.nameEN || product.name || 'Untitled Piece',
    name_ar: product.nameAR || null,
    tagline: product.tagline || product.shortDescEN || null,
    short_desc_en: product.shortDescEN || product.tagline || null,
    short_desc_ar: product.shortDescAR || null,
    description: product.fullDescriptionEN || product.description || '',
    full_description_en: product.fullDescriptionEN || product.description || null,
    full_description_ar: product.fullDescriptionAR || null,
    story: product.story || null,
    main_image: resolvedMainImage,
    images: finalImagesList,
    gallery_images: cleanGallery,
    media_type: (cleanVideo && product.mediaType === 'video') ? 'video' : 'image',
    image_ratio: product.imageRatio || 'Original',
    custom_ratio_width: Number(product.customRatioWidth) || 5,
    custom_ratio_height: Number(product.customRatioHeight) || 7,
    image_fit: product.imageFit || 'cover',
    image_position: product.imagePosition || 'center',
    image_ratios: product.imageRatios || {},
    image_fits: product.imageFits || {},
    image_positions: product.imagePositions || {},
    video_url: cleanVideo,
    product_video: cleanProductVideo,
    video_ratio: product.videoRatio || '16:9',
    video_custom_ratio_width: Number(product.videoCustomRatioWidth) || 16,
    video_custom_ratio_height: Number(product.videoCustomRatioHeight) || 9,
    video_fit: product.videoFit || 'cover',
    video_position: product.videoPosition || 'center',
    video_poster: product.videoPoster || null,
    material: product.material || 'Yellow Brass',
    materials: product.materials || 'Solid High-Grade Egyptian Yellow Brass',
    material_details: product.materialDetails || null,
    finish: product.finish || 'Antique Patina Brass',
    finish_options: product.finishOptions || ['Antique Brass', 'Polished Gold Brass'],
    finish_details: product.finishDetails || null,
    craft_technique: product.craftTechnique || null,
    technique_details: product.techniqueDetails || null,
    dimensions: product.dimensions || 'Custom sizing available',
    height: product.height || null,
    width: product.width || null,
    depth: product.depth || null,
    diameter: product.diameter || null,
    weight: product.weight || null,
    custom_dimensions: product.customDimensions || null,
    custom_size: product.customSize || null,
    custom_design: product.customDesign || null,
    custom_finish: product.customFinish || null,
    custom_details: product.customDetails || null,
    availability: product.availability || 'made_to_order',
    lead_time: product.leadTime || '10-14 business days',
    applications: product.applications || ['Homes', 'Villas', 'Palaces', 'Hotels', 'Hospitality', 'Interior Projects'],
    price: product.price || null,
    price_type: product.priceType || 'quote',
    featured: Boolean(product.featured),
    visibility: product.visibility || 'published',
    seo_slug: product.seoSlug || product.id,
    seo_title: product.seoTitle || null,
    meta_description: product.metaDescription || null,
    seo_keywords: product.seoKeywords || null,
    whatsapp_message: product.whatsappMessage || null,
    related_product_ids: product.relatedProductIds || [],
    category_fields: product.categoryFields || {},
    updated_at: new Date().toISOString(),
  };
}

export function mapSupabaseRowToProduct(row: Record<string, any>): ProductItem {
  const rawMainClean = (typeof row.main_image === 'string' && row.main_image.trim().length > 0 && !isFakeOrDemoImage(row.main_image)) ? row.main_image.trim() : '';

  const cleanImages = (Array.isArray(row.images) ? row.images : (rawMainClean ? [rawMainClean] : []))
    .filter((img: any) => typeof img === 'string' && img.trim().length > 0 && !isFakeOrDemoImage(img));

  const mainImage = rawMainClean || cleanImages[0] || '';
  const images = cleanImages.length > 0 ? cleanImages : (mainImage ? [mainImage] : []);
  const galleryImages = (Array.isArray(row.gallery_images) ? row.gallery_images : cleanImages.slice(1))
    .filter((img: any) => typeof img === 'string' && img.trim().length > 0 && !isFakeOrDemoImage(img));

  const cleanVideoUrl = (typeof row.video_url === 'string' && row.video_url.trim().length > 0 && !isFakeOrDemoVideo(row.video_url)) ? row.video_url.trim() : undefined;
  const cleanProductVideo = (typeof row.product_video === 'string' && row.product_video.trim().length > 0 && !isFakeOrDemoVideo(row.product_video)) ? row.product_video.trim() : undefined;
  const resolvedMediaType: 'image' | 'video' = (cleanVideoUrl && row.media_type === 'video') ? 'video' : 'image';

  return {
    id: row.id,
    sku: row.sku || row.id,
    categoryId: row.category_id,
    name: row.name_en || row.name,
    nameEN: row.name_en || row.name,
    nameAR: row.name_ar || undefined,
    tagline: row.tagline || row.short_desc_en || '',
    shortDescEN: row.short_desc_en || undefined,
    shortDescAR: row.short_desc_ar || undefined,
    description: row.full_description_en || row.description || '',
    fullDescriptionEN: row.full_description_en || undefined,
    fullDescriptionAR: row.full_description_ar || undefined,
    story: row.story || undefined,
    mainImage,
    images,
    galleryImages,
    mediaType: resolvedMediaType,
    imageRatio: row.image_ratio || 'Original',
    customRatioWidth: row.custom_ratio_width || 5,
    customRatioHeight: row.custom_ratio_height || 7,
    imageFit: row.image_fit || 'cover',
    imagePosition: row.image_position || 'center',
    imageRatios: row.image_ratios || {},
    imageFits: row.image_fits || {},
    imagePositions: row.image_positions || {},
    videoUrl: cleanVideoUrl,
    productVideo: cleanProductVideo,
    videoRatio: row.video_ratio || '16:9',
    videoCustomRatioWidth: row.video_custom_ratio_width || 16,
    videoCustomRatioHeight: row.video_custom_ratio_height || 9,
    videoFit: row.video_fit || 'cover',
    videoPosition: row.video_position || 'center',
    videoPoster: (typeof row.video_poster === 'string' && !isFakeOrDemoImage(row.video_poster)) ? row.video_poster.trim() : undefined,
    material: row.material || 'Yellow Brass',
    materials: row.materials || 'Solid High-Grade Egyptian Yellow Brass',
    materialDetails: row.material_details || undefined,
    finish: row.finish || 'Antique Patina Brass',
    finishOptions: Array.isArray(row.finish_options) ? row.finish_options : ['Antique Brass', 'Polished Gold Brass'],
    finishDetails: row.finish_details || undefined,
    craftTechnique: row.craft_technique || undefined,
    techniqueDetails: row.technique_details || undefined,
    dimensions: row.dimensions || 'Custom sizing available',
    height: row.height || undefined,
    width: row.width || undefined,
    depth: row.depth || undefined,
    diameter: row.diameter || undefined,
    weight: row.weight || undefined,
    customDimensions: row.custom_dimensions || undefined,
    customSize: row.custom_size || undefined,
    customDesign: row.custom_design || undefined,
    customFinish: row.custom_finish || undefined,
    customDetails: row.custom_details || undefined,
    availability: row.availability || 'made_to_order',
    leadTime: row.lead_time || '10-14 business days',
    applications: Array.isArray(row.applications) ? row.applications : undefined,
    price: row.price || undefined,
    priceType: row.price_type || 'quote',
    featured: Boolean(row.featured),
    visibility: row.visibility || 'published',
    seoSlug: row.seo_slug || row.id,
    seoTitle: row.seo_title || undefined,
    metaDescription: row.meta_description || undefined,
    seoKeywords: row.seo_keywords || undefined,
    whatsappMessage: row.whatsapp_message || undefined,
    relatedProductIds: Array.isArray(row.related_product_ids) ? row.related_product_ids : [],
    categoryFields: row.category_fields || {},
    updatedAt: row.updated_at,
  };
}

export function isMissingTableError(error: any): boolean {
  if (!error) return false;
  const msg = typeof error.message === 'string' ? error.message : '';
  return (
    error.code === 'PGRST205' ||
    error.code === '42P01' ||
    msg.includes('Could not find the table') ||
    (msg.includes('relation') && msg.includes('does not exist')) ||
    msg.includes('schema cache')
  );
}

/**
 * Checks if the necessary tables exist in the user's Supabase database
 */
export async function checkSupabaseSchemaStatus(): Promise<{
  isConfigured: boolean;
  hasProductsTable: boolean;
  hasCategoriesTable: boolean;
  isReady: boolean;
}> {
  if (!supabase || !isSupabaseConfigured()) {
    return {
      isConfigured: false,
      hasProductsTable: false,
      hasCategoriesTable: false,
      isReady: false,
    };
  }

  try {
    const { error: prodErr } = await supabase.from('products').select('id').limit(1);
    const { error: catErr } = await supabase.from('categories').select('id').limit(1);

    const hasProductsTable = !prodErr || !isMissingTableError(prodErr);
    const hasCategoriesTable = !catErr || !isMissingTableError(catErr);

    return {
      isConfigured: true,
      hasProductsTable,
      hasCategoriesTable,
      isReady: hasProductsTable && hasCategoriesTable,
    };
  } catch {
    return {
      isConfigured: true,
      hasProductsTable: false,
      hasCategoriesTable: false,
      isReady: false,
    };
  }
}

export interface SupabaseFullTestResult {
  isConfigured: boolean;
  canConnect: boolean;
  hasTables: boolean;
  tables: {
    products: boolean;
    categories: boolean;
  };
  hasBuckets: boolean;
  buckets: {
    productImages: boolean;
    productVideos: boolean;
    siteMedia: boolean;
  };
  uploadPermission: boolean;
  message: string;
  error?: string;
}

/**
 * Runs a complete diagnostic test on Supabase connection, schema tables, buckets, and upload permissions
 */
export async function testSupabaseFullSetup(): Promise<SupabaseFullTestResult> {
  if (!supabase || !isSupabaseConfigured()) {
    return {
      isConfigured: false,
      canConnect: false,
      hasTables: false,
      tables: { products: false, categories: false },
      hasBuckets: false,
      buckets: { productImages: false, productVideos: false, siteMedia: false },
      uploadPermission: false,
      message: 'لم يتم إدخال مفتاح الاتصال VITE_SUPABASE_PUBLISHABLE_KEY بعد.',
    };
  }

  try {
    // 1. Test database connection & tables
    const { error: prodErr } = await supabase.from('products').select('id').limit(1);
    const { error: catErr } = await supabase.from('categories').select('id').limit(1);

    // Check if key is invalid / auth error
    const authError =
      (prodErr && (prodErr.code === 'PGRST301' || prodErr.message?.toLowerCase().includes('jwt') || prodErr.message?.toLowerCase().includes('api key'))) ||
      (catErr && (catErr.code === 'PGRST301' || catErr.message?.toLowerCase().includes('jwt') || catErr.message?.toLowerCase().includes('api key')));

    if (authError) {
      return {
        isConfigured: true,
        canConnect: false,
        hasTables: false,
        tables: { products: false, categories: false },
        hasBuckets: false,
        buckets: { productImages: false, productVideos: false, siteMedia: false },
        uploadPermission: false,
        message: 'مفتاح الاتصال غير صالح أو منتهي الصلاحية. يرجى التأكد من نسخ المفتاح العام (anon public) كاملاً.',
        error: prodErr?.message || catErr?.message,
      };
    }

    const hasProductsTable = !prodErr || !isMissingTableError(prodErr);
    const hasCategoriesTable = !catErr || !isMissingTableError(catErr);
    const hasTables = hasProductsTable && hasCategoriesTable;

    // 2. Test storage buckets
    let hasBuckets = false;
    const buckets = { productImages: false, productVideos: false, siteMedia: false };
    try {
      const { data: bucketList, error: bucketErr } = await supabase.storage.listBuckets();
      if (!bucketErr && bucketList) {
        const bucketSet = new Set(bucketList.map((b) => b.id));
        buckets.productImages = bucketSet.has('product-images');
        buckets.productVideos = bucketSet.has('product-videos');
        buckets.siteMedia = bucketSet.has('site-media');
        hasBuckets = buckets.productImages && buckets.productVideos && buckets.siteMedia;
      }
    } catch {
      // Continue
    }

    // 3. Test storage upload permissions (RLS policy check)
    let uploadPermission = false;
    try {
      const probeBlob = new Blob(['probe'], { type: 'text/plain' });
      const probeFile = `_test/probe-${Date.now()}.txt`;
      const { error: upErr } = await supabase.storage.from('product-images').upload(probeFile, probeBlob, { upsert: true });
      if (!upErr) {
        uploadPermission = true;
        // Clean up immediately
        await supabase.storage.from('product-images').remove([probeFile]);
      } else {
        uploadPermission = false;
      }
    } catch {
      uploadPermission = false;
    }

    let message = 'فحص المزامنة ممتاز 100%! قاعدة البيانات والمخازن وصلاحيات الرفع جاهزة تماماً.';
    if (!hasTables) {
      message = 'الاتصال يعمل ولكن الجداول غير موجودة. اضغط نسخ كود الـ SQL وشغله في Supabase SQL Editor.';
    } else if (!hasBuckets) {
      message = 'الجداول جاهزة ولكن أوعية التخزين (Buckets) لم تنشأ بعد. شغل كود مخازن الصور في SQL Editor.';
    } else if (!uploadPermission) {
      message = 'الأوعية موجودة ولكن سياسة الأمان (RLS Policy) تمنع الرفع. تأكد من تشغيل كود الـ Policy في SQL Editor.';
    }

    return {
      isConfigured: true,
      canConnect: true,
      hasTables,
      tables: { products: hasProductsTable, categories: hasCategoriesTable },
      hasBuckets,
      buckets,
      uploadPermission,
      message,
    };
  } catch (err: any) {
    return {
      isConfigured: true,
      canConnect: false,
      hasTables: false,
      tables: { products: false, categories: false },
      hasBuckets: false,
      buckets: { productImages: false, productVideos: false, siteMedia: false },
      uploadPermission: false,
      message: 'تعذر الاتصال بخادم Supabase. تأكد من اتصال الإنترنت وصحة المفتاح.',
      error: err?.message || String(err),
    };
  }
}

export async function fetchSupabaseProducts(): Promise<ProductItem[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      if (isMissingTableError(error)) {
        console.warn('[Supabase Database] Table "products" does not exist in schema cache yet (PGRST205). Run supabase_schema.sql in Supabase SQL Editor.');
      } else {
        console.warn('[Supabase Database] fetchProducts notice:', error.message);
      }
      return null;
    }

    if (Array.isArray(data) && data.length > 0) {
      return data.map(mapSupabaseRowToProduct);
    }
    return [];
  } catch (err) {
    console.warn('[Supabase Database] fetchProducts exception:', err);
    return null;
  }
}

export async function ensureCategoryExistsInSupabase(categoryId: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured() || !categoryId) return false;

  try {
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('id', categoryId)
      .maybeSingle();

    if (existing && existing.id) {
      return true;
    }

    // Category is missing from Supabase categories table. Let's find its metadata.
    let catToInsert: ProductCategoryInfo | undefined;
    try {
      const stored = getStoredCategories();
      catToInsert = stored.find((c) => c.id === categoryId);
    } catch {}

    if (!catToInsert) {
      catToInsert = PRODUCT_CATEGORIES.find((c) => c.id === categoryId);
    }

    const row = catToInsert
      ? mapCategoryToSupabaseRow(catToInsert)
      : {
          id: categoryId,
          name: categoryId.replace(/[-_]/g, ' ').toUpperCase(),
          short_desc: '',
          description: '',
          cover_image: '',
          icon_name: 'Sparkles',
        };

    const { error: insertErr } = await supabase
      .from('categories')
      .upsert(row, { onConflict: 'id' });

    if (insertErr) {
      console.warn(`[Supabase Database] Notice creating parent category "${categoryId}":`, insertErr.message);
      return false;
    }

    return true;
  } catch (err: any) {
    console.warn(`[Supabase Database] Exception ensuring category "${categoryId}":`, err?.message || err);
    return false;
  }
}

export async function saveSupabaseProduct(product: ProductItem): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;

  try {
    // 1. Proactively ensure the foreign key category exists in Supabase
    if (product.categoryId) {
      await ensureCategoryExistsInSupabase(product.categoryId);
    }

    const row = mapProductToSupabaseRow(product);
    let { error } = await supabase
      .from('products')
      .upsert(row, { onConflict: 'id' });

    // 2. Self-healing retry if foreign key violation still occurs
    if (error && (error.code === '23503' || error.message?.includes('foreign key constraint') || error.details?.includes('categories'))) {
      console.warn('[Supabase Database] Foreign key violation on products_category_id_fkey, auto-resolving category and retrying product save...');
      await ensureCategoryExistsInSupabase(product.categoryId);
      const retryRes = await supabase
        .from('products')
        .upsert(row, { onConflict: 'id' });
      error = retryRes.error;
    }

    if (error) {
      if (isMissingTableError(error)) {
        console.warn('[Supabase Database] Table "products" does not exist in schema cache yet (PGRST205). Run supabase_schema.sql in Supabase SQL Editor to enable persistent sync.');
      } else {
        console.error('[Supabase Database] saveProduct error:', error.message || error, 'Details:', error.details, 'Hint:', error.hint);
      }
      return false;
    }
    return true;
  } catch (err: any) {
    console.error('[Supabase Database] saveProduct exception:', err?.message || err);
    return false;
  }
}

export async function deleteSupabaseProduct(productId: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      if (isMissingTableError(error)) {
        console.warn('[Supabase Database] Table "products" not found in schema cache.');
      } else {
        console.warn('[Supabase Database] deleteProduct notice:', error.message || error);
      }
      return false;
    }
    return true;
  } catch (err: any) {
    console.warn('[Supabase Database] deleteProduct exception:', err?.message || err);
    return false;
  }
}

// -----------------------------------------------------------------------------
// CATEGORIES CRUD (SUPABASE)
// -----------------------------------------------------------------------------

export function mapCategoryToSupabaseRow(cat: ProductCategoryInfo): Record<string, any> {
  return {
    id: cat.id,
    name: cat.name,
    name_arabic: cat.nameArabic || null,
    short_desc: cat.shortDesc || '',
    description: cat.description || '',
    cover_image: cat.coverImage || '',
    icon_name: cat.iconName || 'Sparkles',
    cover_media_type: cat.coverMediaType || 'image',
    cover_video_url: cat.coverVideoUrl || null,
    cover_image_ratio: cat.coverImageRatio || 'Original',
    custom_ratio_width: Number(cat.customRatioWidth) || 5,
    custom_ratio_height: Number(cat.customRatioHeight) || 7,
    cover_image_fit: cat.coverImageFit || 'cover',
    cover_image_position: cat.coverImagePosition || 'center',
    cover_video_ratio: cat.coverVideoRatio || '16:7',
    cover_video_fit: cat.coverVideoFit || 'cover',
    cover_video_position: cat.coverVideoPosition || 'center',
    cover_video_muted: Boolean(cat.coverVideoMuted),
    gallery_images: cat.galleryImages || [],
    gallery_ratios: cat.galleryRatios || {},
    gallery_fits: cat.galleryFits || {},
    gallery_positions: cat.galleryPositions || {},
    updated_at: new Date().toISOString(),
  };
}

export function mapSupabaseRowToCategory(row: Record<string, any>): ProductCategoryInfo {
  return {
    id: row.id,
    name: row.name,
    nameArabic: row.name_arabic || undefined,
    shortDesc: row.short_desc || '',
    description: row.description || '',
    coverImage: row.cover_image || '',
    iconName: row.icon_name || 'Sparkles',
    coverMediaType: row.cover_media_type || 'image',
    coverVideoUrl: row.cover_video_url || undefined,
    coverImageRatio: row.cover_image_ratio || 'Original',
    customRatioWidth: row.custom_ratio_width || 5,
    customRatioHeight: row.custom_ratio_height || 7,
    coverImageFit: row.cover_image_fit || 'cover',
    coverImagePosition: row.cover_image_position || 'center',
    coverVideoRatio: row.cover_video_ratio || '16:7',
    coverVideoFit: row.cover_video_fit || 'cover',
    coverVideoPosition: row.cover_video_position || 'center',
    coverVideoMuted: Boolean(row.cover_video_muted),
    galleryImages: Array.isArray(row.gallery_images) ? row.gallery_images : [],
    galleryRatios: row.gallery_ratios || {},
    galleryFits: row.gallery_fits || {},
    galleryPositions: row.gallery_positions || {},
  };
}

export async function fetchSupabaseCategories(): Promise<ProductCategoryInfo[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      if (isMissingTableError(error)) {
        console.warn('[Supabase Database] Table "categories" not found in schema cache yet (PGRST205). Run supabase_schema.sql in Supabase SQL Editor.');
      } else {
        console.warn('[Supabase Database] fetchCategories notice:', error.message);
      }
      return null;
    }

    if (Array.isArray(data) && data.length > 0) {
      return data.map(mapSupabaseRowToCategory);
    }
    return [];
  } catch (err) {
    console.warn('[Supabase Database] fetchCategories exception:', err);
    return null;
  }
}

export async function saveSupabaseCategory(category: ProductCategoryInfo): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;

  try {
    const row = mapCategoryToSupabaseRow(category);
    const { error } = await supabase
      .from('categories')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      if (isMissingTableError(error)) {
        console.warn('[Supabase Database] Table "categories" not found in schema cache yet (PGRST205). Run supabase_schema.sql in Supabase SQL Editor.');
      } else {
        console.warn('[Supabase Database] saveCategory notice:', error.message || error);
      }
      return false;
    }
    return true;
  } catch (err: any) {
    console.warn('[Supabase Database] saveCategory exception:', err?.message || err);
    return false;
  }
}

export async function deleteSupabaseCategory(categoryId: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (error) {
      if (isMissingTableError(error)) {
        console.warn('[Supabase Database] Table "categories" not found in schema cache.');
      } else {
        console.warn('[Supabase Database] deleteCategory notice:', error.message || error);
      }
      return false;
    }
    return true;
  } catch (err: any) {
    console.warn('[Supabase Database] deleteCategory exception:', err?.message || err);
    return false;
  }
}

// -----------------------------------------------------------------------------
// SITE CONTENT & SETTINGS (SUPABASE)
// -----------------------------------------------------------------------------

export async function fetchSupabaseSiteContent(): Promise<SiteContent | null> {
  if (!supabase || !isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('id', 'current_content')
      .single();

    if (error) {
      if (!isMissingTableError(error)) {
        // Table exists but no row or normal error
      }
      return null;
    }
    if (!data) return null;
    return data.content as SiteContent;
  } catch {
    return null;
  }
}

export async function saveSupabaseSiteContent(content: SiteContent): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase
      .from('site_content')
      .upsert({
        id: 'current_content',
        content,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (error) {
      if (isMissingTableError(error)) {
        console.warn('[Supabase Database] Table "site_content" not found in schema cache yet (PGRST205). Run supabase_schema.sql in Supabase SQL Editor.');
      } else {
        console.warn('[Supabase Database] saveSiteContent notice:', error.message || error);
      }
      return false;
    }
    return true;
  } catch (err: any) {
    console.warn('[Supabase Database] saveSiteContent exception:', err?.message || err);
    return false;
  }
}

export async function fetchSupabaseLogo(): Promise<string | null> {
  if (!supabase || !isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('logo_url')
      .eq('id', 'general')
      .single();

    if (error || !data) return null;
    return data.logo_url || null;
  } catch {
    return null;
  }
}

export async function saveSupabaseLogo(logoUrl: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase
      .from('site_settings')
      .upsert({
        id: 'general',
        logo_url: logoUrl,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (error) {
      if (isMissingTableError(error)) {
        console.warn('[Supabase Database] Table "site_settings" not found in schema cache yet (PGRST205). Run supabase_schema.sql in Supabase SQL Editor.');
      } else {
        console.warn('[Supabase Database] saveLogo notice:', error.message || error);
      }
      return false;
    }
    return true;
  } catch (err: any) {
    console.warn('[Supabase Database] saveLogo exception:', err?.message || err);
    return false;
  }
}

// -----------------------------------------------------------------------------
// PROJECTS CRUD (SUPABASE)
// -----------------------------------------------------------------------------

export function mapProjectToSupabaseRow(project: ProjectItem): Record<string, any> {
  return {
    id: project.id,
    title: project.title,
    title_ar: project.titleAR || null,
    slug: project.slug,
    location: project.location,
    project_type: project.projectType,
    year: project.year ? String(project.year) : null,
    short_description: project.shortDescription || null,
    description: project.description,
    craft_story: project.craftStory || null,
    materials: project.materials,
    finish: project.finish || null,
    work_delivered: Array.isArray(project.workDelivered) ? project.workDelivered : [],
    custom_manufacturing: project.customManufacturing || null,

    // Cover Media
    cover_image: project.coverImage,
    media_type: project.mediaType || 'image',
    cover_ratio: project.coverRatio || 'Original',
    cover_custom_ratio_width: Number(project.coverCustomRatioWidth) || 16,
    cover_custom_ratio_height: Number(project.coverCustomRatioHeight) || 9,
    cover_fit: project.coverFit || 'cover',
    cover_position: project.coverPosition || 'center',

    // Gallery
    gallery: Array.isArray(project.gallery) ? project.gallery : [],
    gallery_ratios: project.galleryRatios || {},
    gallery_fits: project.galleryFits || {},
    gallery_positions: project.galleryPositions || {},

    // Video
    video_url: project.videoUrl || null,
    video_ratio: project.videoRatio || '16:9',
    video_custom_ratio_width: Number(project.videoCustomRatioWidth) || 16,
    video_custom_ratio_height: Number(project.videoCustomRatioHeight) || 9,
    video_fit: project.videoFit || 'cover',
    video_poster: project.videoPoster || null,

    // Related Products
    related_product_ids: Array.isArray(project.relatedProductIds) ? project.relatedProductIds : [],

    // Publication & Sort
    published: Boolean(project.published),
    sort_order: Number(project.sortOrder) || 0,

    // SEO
    seo_title: project.seoTitle || null,
    meta_description: project.metaDescription || null,

    created_at: project.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function mapSupabaseRowToProject(row: Record<string, any>): ProjectItem {
  return {
    id: row.id,
    title: row.title,
    titleAR: row.title_ar || undefined,
    slug: row.slug || row.id,
    location: row.location || 'Cairo, Egypt',
    projectType: row.project_type || 'Custom Project',
    year: row.year || undefined,
    shortDescription: row.short_description || undefined,
    description: row.description || '',
    craftStory: row.craft_story || undefined,
    materials: row.materials || 'Solid Egyptian Yellow Brass',
    finish: row.finish || undefined,
    workDelivered: Array.isArray(row.work_delivered) ? row.work_delivered : [],
    customManufacturing: row.custom_manufacturing || undefined,

    // Cover Media
    coverImage: row.cover_image,
    mediaType: row.media_type || 'image',
    coverRatio: row.cover_ratio || 'Original',
    coverCustomRatioWidth: row.cover_custom_ratio_width || 16,
    coverCustomRatioHeight: row.cover_custom_ratio_height || 9,
    coverFit: row.cover_fit || 'cover',
    coverPosition: row.cover_position || 'center',

    // Gallery
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    galleryRatios: row.gallery_ratios || {},
    galleryFits: row.gallery_fits || {},
    galleryPositions: row.gallery_positions || {},

    // Video
    videoUrl: row.video_url || undefined,
    videoRatio: row.video_ratio || '16:9',
    videoCustomRatioWidth: row.video_custom_ratio_width || 16,
    videoCustomRatioHeight: row.video_custom_ratio_height || 9,
    videoFit: row.video_fit || 'cover',
    videoPoster: row.video_poster || undefined,

    // Related Products
    relatedProductIds: Array.isArray(row.related_product_ids) ? row.related_product_ids : [],

    // Publication & Sort
    published: row.published !== false,
    sortOrder: row.sort_order || 0,

    // SEO
    seoTitle: row.seo_title || undefined,
    metaDescription: row.meta_description || undefined,

    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchSupabaseProjects(): Promise<ProjectItem[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;

  const projectMap = new Map<string, ProjectItem>();

  // 1. Try reading from public.projects table
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && Array.isArray(data) && data.length > 0) {
      data.forEach((row) => {
        const item = mapSupabaseRowToProject(row);
        projectMap.set(item.id, item);
      });
    }
  } catch (err) {
    // Ignore and proceed to site_content fallback
  }

  // 2. Also check site_content projects_catalog for universal fallback & cross-table sync
  try {
    const { data: catData } = await supabase
      .from('site_content')
      .select('content')
      .eq('id', 'projects_catalog')
      .maybeSingle();

    if (catData?.content && Array.isArray(catData.content.projects)) {
      catData.content.projects.forEach((item: ProjectItem) => {
        if (item && item.id && !projectMap.has(item.id)) {
          projectMap.set(item.id, item);
        } else if (item && item.id && projectMap.has(item.id)) {
          // Merge rich media if available
          const existing = projectMap.get(item.id)!;
          projectMap.set(item.id, {
            ...existing,
            ...item,
            coverImage: item.coverImage || existing.coverImage,
            gallery: (Array.isArray(item.gallery) && item.gallery.length > 0) ? item.gallery : existing.gallery,
            videoUrl: item.videoUrl || existing.videoUrl,
          });
        }
      });
    }
  } catch (catErr) {
    // Ignore
  }

  // 3. Remove any projects listed in deleted_projects_registry
  try {
    const { data: delData } = await supabase
      .from('site_content')
      .select('content')
      .eq('id', 'deleted_projects_registry')
      .maybeSingle();

    if (delData?.content && Array.isArray(delData.content.deletedIds)) {
      const deletedSet = new Set<string>(delData.content.deletedIds.map(String));
      for (const delId of deletedSet) {
        projectMap.delete(delId);
      }
    }
  } catch {}

  const result = Array.from(projectMap.values()).sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
  );

  return result;
}

export async function saveSupabaseProject(project: ProjectItem): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;

  let savedDirectTable = false;

  // 1. Try public.projects table
  try {
    const row = mapProjectToSupabaseRow(project);
    const { error } = await supabase
      .from('projects')
      .upsert(row, { onConflict: 'id' });

    if (!error) {
      savedDirectTable = true;
    }
  } catch (err: any) {
    // Expected if projects table not yet run in SQL editor
  }

  // 2. ALWAYS persist to site_content projects_catalog (100% guaranteed working across all browsers)
  try {
    const { data: catData } = await supabase
      .from('site_content')
      .select('content')
      .eq('id', 'projects_catalog')
      .maybeSingle();

    const existingProjects: ProjectItem[] = Array.isArray(catData?.content?.projects)
      ? [...catData.content.projects]
      : [];

    const idx = existingProjects.findIndex((p) => p.id === project.id);
    if (idx >= 0) {
      existingProjects[idx] = { ...existingProjects[idx], ...project, updatedAt: new Date().toISOString() };
    } else {
      existingProjects.push({ ...project, updatedAt: new Date().toISOString() });
    }

    const { error: catErr } = await supabase
      .from('site_content')
      .upsert({
        id: 'projects_catalog',
        content: { projects: existingProjects, updatedAt: new Date().toISOString() },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (!catErr) {
      // Also unmark from deleted_projects_registry if present
      try {
        const { data: delData } = await supabase
          .from('site_content')
          .select('content')
          .eq('id', 'deleted_projects_registry')
          .maybeSingle();

        if (delData?.content && Array.isArray(delData.content.deletedIds) && delData.content.deletedIds.includes(project.id)) {
          const updatedDeleted = delData.content.deletedIds.filter((id: string) => id !== project.id);
          await supabase.from('site_content').upsert({
            id: 'deleted_projects_registry',
            content: { deletedIds: updatedDeleted },
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });
        }
      } catch {}

      return true;
    }
  } catch (catSaveErr) {
    console.warn('[Supabase Database] Error saving project to projects_catalog:', catSaveErr);
  }

  return savedDirectTable;
}

export async function deleteSupabaseProject(projectId: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;

  // 1. Delete from public.projects table if it exists
  try {
    await supabase.from('projects').delete().eq('id', projectId);
  } catch {}

  // 2. Remove from site_content projects_catalog
  try {
    const { data: catData } = await supabase
      .from('site_content')
      .select('content')
      .eq('id', 'projects_catalog')
      .maybeSingle();

    if (catData?.content && Array.isArray(catData.content.projects)) {
      const updatedProjects = catData.content.projects.filter((p: ProjectItem) => p.id !== projectId);
      await supabase.from('site_content').upsert({
        id: 'projects_catalog',
        content: { projects: updatedProjects, updatedAt: new Date().toISOString() },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });
    }
  } catch (err) {
    console.warn('[Supabase Database] Notice updating projects_catalog on delete:', err);
  }

  // 3. Track permanently deleted ID in deleted_projects_registry for instant multi-browser deletion sync
  try {
    const { data: delData } = await supabase
      .from('site_content')
      .select('content')
      .eq('id', 'deleted_projects_registry')
      .maybeSingle();

    const currentDeleted: string[] = Array.isArray(delData?.content?.deletedIds)
      ? delData.content.deletedIds
      : [];

    if (!currentDeleted.includes(projectId)) {
      currentDeleted.push(projectId);
      await supabase.from('site_content').upsert({
        id: 'deleted_projects_registry',
        content: { deletedIds: currentDeleted, updatedAt: new Date().toISOString() },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });
    }
  } catch (err) {
    console.warn('[Supabase Database] Notice updating deleted_projects_registry:', err);
  }

  return true;
}

export async function saveSupabaseProjectsOrder(projects: ProjectItem[]): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured() || !projects.length) return false;

  // 1. Try updating projects table
  try {
    const rows = projects.map((p, index) => ({
      ...mapProjectToSupabaseRow(p),
      sort_order: index + 1,
    }));
    await supabase.from('projects').upsert(rows, { onConflict: 'id' });
  } catch {}

  // 2. ALWAYS update site_content projects_catalog
  try {
    const ordered = projects.map((p, index) => ({
      ...p,
      sortOrder: index + 1,
    }));
    await supabase.from('site_content').upsert({
      id: 'projects_catalog',
      content: { projects: ordered, updatedAt: new Date().toISOString() },
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });
    return true;
  } catch (err) {
    console.warn('[Supabase Database] saveProjectsOrder exception:', err);
    return false;
  }
}

// -----------------------------------------------------------------------------
// CLIENTS & PARTNERS CRUD (SUPABASE)
// -----------------------------------------------------------------------------

export function mapClientPartnerToSupabaseRow(item: ClientPartnerItem): Record<string, any> {
  return {
    id: item.id,
    name: item.name,
    name_ar: item.nameAR || null,
    type: item.type === 'partner' ? 'partner' : 'client',
    logo: item.logo,
    industry: item.industry || null,
    website_url: item.websiteUrl || null,
    location: item.location || null,
    description: item.description || null,
    description_ar: item.descriptionAR || null,
    project_id: item.projectId || null,
    published: Boolean(item.published),
    sort_order: Number(item.sortOrder) || 0,
    created_at: item.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function mapSupabaseRowToClientPartner(row: Record<string, any>): ClientPartnerItem {
  return {
    id: row.id,
    name: row.name,
    nameAR: row.name_ar || undefined,
    type: row.type === 'partner' ? 'partner' : 'client',
    logo: row.logo || '',
    industry: row.industry || undefined,
    websiteUrl: row.website_url || undefined,
    location: row.location || undefined,
    description: row.description || undefined,
    descriptionAR: row.description_ar || undefined,
    projectId: row.project_id || undefined,
    published: row.published !== false,
    sortOrder: Number(row.sort_order) || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchSupabaseClientsPartners(): Promise<ClientPartnerItem[] | null> {
  if (!supabase || !isSupabaseConfigured()) return null;

  const itemMap = new Map<string, ClientPartnerItem>();

  // 1. Try reading from public.clients_partners table
  try {
    const { data, error } = await supabase
      .from('clients_partners')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && Array.isArray(data) && data.length > 0) {
      data.forEach((row) => {
        const item = mapSupabaseRowToClientPartner(row);
        itemMap.set(item.id, item);
      });
    }
  } catch {}

  // 2. Also check site_content clients_partners_catalog for universal fallback & cross-table sync
  try {
    const { data: catData } = await supabase
      .from('site_content')
      .select('content')
      .eq('id', 'clients_partners_catalog')
      .maybeSingle();

    if (catData?.content && Array.isArray(catData.content.items)) {
      catData.content.items.forEach((item: ClientPartnerItem) => {
        if (item && item.id && !itemMap.has(item.id)) {
          itemMap.set(item.id, item);
        }
      });
    }
  } catch {}

  // 3. Filter out any tracked deletions
  try {
    const { data: delData } = await supabase
      .from('site_content')
      .select('content')
      .eq('id', 'deleted_clients_partners_registry')
      .maybeSingle();

    if (delData?.content && Array.isArray(delData.content.deletedIds)) {
      const deletedSet = new Set<string>(delData.content.deletedIds.map(String));
      for (const delId of deletedSet) {
        itemMap.delete(delId);
      }
    }
  } catch {}

  const result = Array.from(itemMap.values()).sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
  );

  return result;
}

export async function saveSupabaseClientPartner(item: ClientPartnerItem): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;

  let savedDirectTable = false;

  // 1. Try public.clients_partners table
  try {
    const row = mapClientPartnerToSupabaseRow(item);
    const { error } = await supabase
      .from('clients_partners')
      .upsert(row, { onConflict: 'id' });

    if (!error) {
      savedDirectTable = true;
    }
  } catch {}

  // 2. ALWAYS persist to site_content clients_partners_catalog (100% resilient)
  try {
    const { data: catData } = await supabase
      .from('site_content')
      .select('content')
      .eq('id', 'clients_partners_catalog')
      .maybeSingle();

    const existing: ClientPartnerItem[] = Array.isArray(catData?.content?.items)
      ? [...catData.content.items]
      : [];

    const idx = existing.findIndex((p) => p.id === item.id);
    if (idx >= 0) {
      existing[idx] = { ...existing[idx], ...item, updatedAt: new Date().toISOString() };
    } else {
      existing.push({ ...item, updatedAt: new Date().toISOString() });
    }

    const { error: catErr } = await supabase
      .from('site_content')
      .upsert({
        id: 'clients_partners_catalog',
        content: { items: existing, updatedAt: new Date().toISOString() },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (!catErr) {
      // Unmark from deleted registry if present
      try {
        const { data: delData } = await supabase
          .from('site_content')
          .select('content')
          .eq('id', 'deleted_clients_partners_registry')
          .maybeSingle();

        if (delData?.content && Array.isArray(delData.content.deletedIds) && delData.content.deletedIds.includes(item.id)) {
          const updatedDeleted = delData.content.deletedIds.filter((id: string) => id !== item.id);
          await supabase.from('site_content').upsert({
            id: 'deleted_clients_partners_registry',
            content: { deletedIds: updatedDeleted },
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });
        }
      } catch {}

      return true;
    }
  } catch (err) {
    console.warn('[Supabase Database] Error saving client/partner to catalog:', err);
  }

  return savedDirectTable;
}

export async function deleteSupabaseClientPartner(id: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;

  // 1. Delete from public.clients_partners table
  try {
    await supabase.from('clients_partners').delete().eq('id', id);
  } catch {}

  // 2. Remove from site_content clients_partners_catalog
  try {
    const { data: catData } = await supabase
      .from('site_content')
      .select('content')
      .eq('id', 'clients_partners_catalog')
      .maybeSingle();

    if (catData?.content && Array.isArray(catData.content.items)) {
      const updated = catData.content.items.filter((p: ClientPartnerItem) => p.id !== id);
      await supabase.from('site_content').upsert({
        id: 'clients_partners_catalog',
        content: { items: updated, updatedAt: new Date().toISOString() },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });
    }
  } catch {}

  // 3. Track permanently deleted ID in registry
  try {
    const { data: delData } = await supabase
      .from('site_content')
      .select('content')
      .eq('id', 'deleted_clients_partners_registry')
      .maybeSingle();

    const currentDeleted: string[] = Array.isArray(delData?.content?.deletedIds)
      ? delData.content.deletedIds
      : [];

    if (!currentDeleted.includes(id)) {
      currentDeleted.push(id);
      await supabase.from('site_content').upsert({
        id: 'deleted_clients_partners_registry',
        content: { deletedIds: currentDeleted, updatedAt: new Date().toISOString() },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });
    }
  } catch {}

  return true;
}

export async function saveSupabaseClientsPartnersOrder(items: ClientPartnerItem[]): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured() || !items.length) return false;

  // 1. Try updating table
  try {
    const rows = items.map((p, index) => ({
      ...mapClientPartnerToSupabaseRow(p),
      sort_order: index + 1,
    }));
    await supabase.from('clients_partners').upsert(rows, { onConflict: 'id' });
  } catch {}

  // 2. Update site_content clients_partners_catalog
  try {
    const ordered = items.map((p, index) => ({
      ...p,
      sortOrder: index + 1,
    }));
    await supabase.from('site_content').upsert({
      id: 'clients_partners_catalog',
      content: { items: ordered, updatedAt: new Date().toISOString() },
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });
    return true;
  } catch (err) {
    console.warn('[Supabase Database] saveClientsPartnersOrder exception:', err);
    return false;
  }
}


