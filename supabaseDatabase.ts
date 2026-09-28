import { supabase, isSupabaseConfigured } from './supabase';
import { ProductItem, ProductCategoryInfo, ProjectItem } from './types';
import { SiteContent } from './siteContentStorage';

// -----------------------------------------------------------------------------
// PRODUCTS CRUD (SUPABASE)
// -----------------------------------------------------------------------------

export function mapProductToSupabaseRow(product: ProductItem): Record<string, any> {
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
    main_image: product.mainImage,
    images: product.images || [product.mainImage],
    gallery_images: product.galleryImages || [],
    media_type: product.mediaType || 'image',
    image_ratio: product.imageRatio || 'Original',
    custom_ratio_width: Number(product.customRatioWidth) || 5,
    custom_ratio_height: Number(product.customRatioHeight) || 7,
    image_fit: product.imageFit || 'cover',
    image_position: product.imagePosition || 'center',
    image_ratios: product.imageRatios || {},
    image_fits: product.imageFits || {},
    image_positions: product.imagePositions || {},
    video_url: product.videoUrl || null,
    product_video: product.productVideo || null,
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
    mainImage: row.main_image,
    images: Array.isArray(row.images) && row.images.length > 0 ? row.images : [row.main_image],
    galleryImages: Array.isArray(row.gallery_images) ? row.gallery_images : [],
    mediaType: row.media_type || 'image',
    imageRatio: row.image_ratio || 'Original',
    customRatioWidth: row.custom_ratio_width || 5,
    customRatioHeight: row.custom_ratio_height || 7,
    imageFit: row.image_fit || 'cover',
    imagePosition: row.image_position || 'center',
    imageRatios: row.image_ratios || {},
    imageFits: row.image_fits || {},
    imagePositions: row.image_positions || {},
    videoUrl: row.video_url || undefined,
    productVideo: row.product_video || undefined,
    videoRatio: row.video_ratio || '16:9',
    videoCustomRatioWidth: row.video_custom_ratio_width || 16,
    videoCustomRatioHeight: row.video_custom_ratio_height || 9,
    videoFit: row.video_fit || 'cover',
    videoPosition: row.video_position || 'center',
    videoPoster: row.video_poster || undefined,
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

export async function saveSupabaseProduct(product: ProductItem): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;

  try {
    const row = mapProductToSupabaseRow(product);
    const { error } = await supabase
      .from('products')
      .upsert(row, { onConflict: 'id' });

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

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      if (isMissingTableError(error)) {
        console.warn('[Supabase Database] Table "projects" not found in schema cache yet (PGRST205). Run supabase_schema.sql in Supabase SQL Editor.');
      } else {
        console.warn('[Supabase Database] fetchProjects notice:', error.message);
      }
      return null;
    }

    if (Array.isArray(data) && data.length > 0) {
      return data.map(mapSupabaseRowToProject);
    }
    return [];
  } catch (err) {
    console.warn('[Supabase Database] fetchProjects exception:', err);
    return null;
  }
}

export async function saveSupabaseProject(project: ProjectItem): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;

  try {
    const row = mapProjectToSupabaseRow(project);
    const { error } = await supabase
      .from('projects')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      if (isMissingTableError(error)) {
        console.warn('[Supabase Database] Table "projects" not found in schema cache yet (PGRST205).');
      } else {
        console.error('[Supabase Database] saveProject error:', error.message || error);
      }
      return false;
    }
    return true;
  } catch (err: any) {
    console.error('[Supabase Database] saveProject exception:', err?.message || err);
    return false;
  }
}

export async function deleteSupabaseProject(projectId: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      if (isMissingTableError(error)) {
        console.warn('[Supabase Database] Table "projects" not found in schema cache.');
      } else {
        console.warn('[Supabase Database] deleteProject notice:', error.message || error);
      }
      return false;
    }
    return true;
  } catch (err: any) {
    console.warn('[Supabase Database] deleteProject exception:', err?.message || err);
    return false;
  }
}

export async function saveSupabaseProjectsOrder(projects: ProjectItem[]): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured() || !projects.length) return false;

  try {
    const rows = projects.map((p, index) => ({
      ...mapProjectToSupabaseRow(p),
      sort_order: index + 1,
    }));

    const { error } = await supabase
      .from('projects')
      .upsert(rows, { onConflict: 'id' });

    if (error) {
      console.warn('[Supabase Database] saveProjectsOrder error:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase Database] saveProjectsOrder exception:', err);
    return false;
  }
}

