import { isSupabaseConfigured } from './supabase';
import { uploadToSupabaseStorage } from './supabaseStorage';
import { 
  saveSupabaseProduct, 
  saveSupabaseCategory, 
  saveSupabaseSiteContent, 
  saveSupabaseLogo,
  fetchSupabaseProducts,
  checkSupabaseSchemaStatus,
} from './supabaseDatabase';
import { ProductItem, ProductCategoryInfo } from './types';
import { SiteContent } from './siteContentStorage';
import { getStoredProducts } from './storage';
import { getStoredCategories } from './categoryStorage';
import { getStoredSiteContent } from './siteContentStorage';
import { getStoredLogo } from './logoStorage';

export interface MigrationProgress {
  status: 'idle' | 'running' | 'completed' | 'error';
  totalSteps: number;
  completedSteps: number;
  currentMessage: string;
  error?: string;
}

/**
 * Migrates existing TURATH catalog, categories, site content, and logo to Supabase
 * Safely preserves all data, uploading Base64 media into Supabase Storage.
 */
export async function migrateTurathToSupabase(
  onProgress?: (progress: MigrationProgress) => void
): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured()) {
    const msg = 'Supabase publishable key is not configured yet. Please configure VITE_SUPABASE_PUBLISHABLE_KEY in Vercel or your environment.';
    onProgress?.({
      status: 'error',
      totalSteps: 1,
      completedSteps: 0,
      currentMessage: msg,
      error: msg,
    });
    return { success: false, message: msg };
  }

  // Pre-check: Verify if Supabase tables (public.products & public.categories) are created
  const schemaStatus = await checkSupabaseSchemaStatus();
  if (!schemaStatus.isReady) {
    const msg = 'جداول Supabase (public.products) لم يتم إنشاؤها بعد في مشروعك (خطأ PGRST205). يُرجى تشغيل كود SQL من ملف supabase_schema.sql في Supabase SQL Editor أولاً.';
    onProgress?.({
      status: 'error',
      totalSteps: 1,
      completedSteps: 0,
      currentMessage: msg,
      error: msg,
    });
    return { success: false, message: msg };
  }

  try {
    const products: ProductItem[] = getStoredProducts();
    const categories: ProductCategoryInfo[] = getStoredCategories();
    const siteContent: SiteContent = getStoredSiteContent();
    const logo: string = getStoredLogo();

    const totalSteps = categories.length + products.length + 2; // +1 for site content, +1 for logo
    let completedSteps = 0;

    const report = (message: string) => {
      onProgress?.({
        status: 'running',
        totalSteps,
        completedSteps,
        currentMessage: message,
      });
      console.log(`[Supabase Migration] ${message}`);
    };

    // 1. Categories Migration
    report('Migrating categories to Supabase...');
    for (const cat of categories) {
      const catClone = { ...cat };
      if (catClone.coverImage && catClone.coverImage.startsWith('data:image/')) {
        try {
          catClone.coverImage = await uploadToSupabaseStorage(
            'site-media',
            `categories/${catClone.id}/cover_${Date.now()}`,
            catClone.coverImage
          );
        } catch (e) {
          console.warn(`Could not upload cover image for category ${cat.id}:`, e);
        }
      }
      if (catClone.coverVideoUrl && catClone.coverVideoUrl.startsWith('data:video/')) {
        try {
          catClone.coverVideoUrl = await uploadToSupabaseStorage(
            'product-videos',
            `categories/${catClone.id}/video_${Date.now()}`,
            catClone.coverVideoUrl
          );
        } catch (e) {
          console.warn(`Could not upload cover video for category ${cat.id}:`, e);
        }
      }
      await saveSupabaseCategory(catClone);
      completedSteps++;
      report(`Category "${cat.name}" migrated (${completedSteps}/${totalSteps})`);
    }

    // 2. Products Migration
    report('Migrating products to Supabase...');
    for (const prod of products) {
      const prodClone = { ...prod };

      // Upload main image if base64
      if (prodClone.mainImage && prodClone.mainImage.startsWith('data:image/')) {
        try {
          prodClone.mainImage = await uploadToSupabaseStorage(
            'product-images',
            `${prodClone.id}/main_${Date.now()}`,
            prodClone.mainImage
          );
        } catch (e) {
          console.warn(`Could not upload main image for product ${prod.id}:`, e);
        }
      }

      // Upload gallery images if base64
      if (Array.isArray(prodClone.images)) {
        const uploadedImages: string[] = [];
        for (let i = 0; i < prodClone.images.length; i++) {
          const img = prodClone.images[i];
          if (img.startsWith('data:image/')) {
            try {
              const url = await uploadToSupabaseStorage(
                'product-images',
                `${prodClone.id}/gallery_${i}_${Date.now()}`,
                img
              );
              uploadedImages.push(url);
            } catch {
              uploadedImages.push(img);
            }
          } else {
            uploadedImages.push(img);
          }
        }
        prodClone.images = uploadedImages;
        if (uploadedImages.length > 0 && (!prodClone.mainImage || prodClone.mainImage.startsWith('data:image/'))) {
          prodClone.mainImage = uploadedImages[0];
        }
      }

      // Upload product video if base64
      if (prodClone.videoUrl && prodClone.videoUrl.startsWith('data:video/')) {
        try {
          const vidUrl = await uploadToSupabaseStorage(
            'product-videos',
            `${prodClone.id}/video_${Date.now()}`,
            prodClone.videoUrl
          );
          prodClone.videoUrl = vidUrl;
          prodClone.productVideo = vidUrl;
        } catch (e) {
          console.warn(`Could not upload video for product ${prod.id}:`, e);
        }
      }

      await saveSupabaseProduct(prodClone);
      completedSteps++;
      report(`Product "${prod.nameEN || prod.name}" migrated (${completedSteps}/${totalSteps})`);
    }

    // 3. Site Content Migration
    report('Migrating site content and story...');
    const contentClone = { ...siteContent };
    if (contentClone.aboutImage && contentClone.aboutImage.startsWith('data:image/')) {
      try {
        contentClone.aboutImage = await uploadToSupabaseStorage(
          'site-media',
          `about/about_${Date.now()}`,
          contentClone.aboutImage
        );
        if (contentClone.about) contentClone.about.image = contentClone.aboutImage;
      } catch (e) {
        console.warn('Could not upload about photo to Supabase:', e);
      }
    }
    if (contentClone.founderImage && contentClone.founderImage.startsWith('data:image/')) {
      try {
        contentClone.founderImage = await uploadToSupabaseStorage(
          'site-media',
          `founder/founder_${Date.now()}`,
          contentClone.founderImage
        );
      } catch (e) {
        console.warn('Could not upload founder photo to Supabase:', e);
      }
    }
    await saveSupabaseSiteContent(contentClone);
    completedSteps++;
    report(`Site content migrated (${completedSteps}/${totalSteps})`);

    // 4. Logo Migration
    report('Migrating custom logo...');
    let finalLogo = logo;
    if (finalLogo && finalLogo.startsWith('data:image/')) {
      try {
        finalLogo = await uploadToSupabaseStorage(
          'site-media',
          `logo/turath_logo_${Date.now()}`,
          finalLogo
        );
      } catch (e) {
        console.warn('Could not upload logo to Supabase:', e);
      }
    }
    await saveSupabaseLogo(finalLogo);
    completedSteps++;
    report(`Logo migrated (${completedSteps}/${totalSteps})`);

    onProgress?.({
      status: 'completed',
      totalSteps,
      completedSteps,
      currentMessage: 'All Turath catalog data and media have been safely migrated to Supabase!',
    });

    return {
      success: true,
      message: `Successfully migrated ${products.length} products, ${categories.length} categories, site content, and media to Supabase.`,
    };
  } catch (err: any) {
    const errorMsg = err?.message || 'Unknown migration error';
    onProgress?.({
      status: 'error',
      totalSteps: 1,
      completedSteps: 0,
      currentMessage: errorMsg,
      error: errorMsg,
    });
    return { success: false, message: errorMsg };
  }
}
