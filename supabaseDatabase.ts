import { supabase, isSupabaseConfigured } from './supabase';
import { ProductItem, ProductCategoryInfo } from './types';
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
        console.warn('[Supabase Database] saveProduct notice:', error.message || error);
      }
      return false;
    }
    return true;
  } catch (err: any) {
    console.warn('[Supabase Database] saveProduct exception:', err?.message || err);
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
