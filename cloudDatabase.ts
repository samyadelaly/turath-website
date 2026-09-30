import { 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  collection, 
  onSnapshot, 
  writeBatch,
  getDocs,
  disableNetwork,
  Unsubscribe 
} from 'firebase/firestore';
import { db } from './firebase';
import { ProductItem, ProductCategoryInfo, ProjectItem, ClientPartnerItem } from './types';
import { PRODUCT_CATEGORIES } from './initialCatalog';
import { DEFAULT_LOGO_URL } from './logoStorage';
import { SiteContent, DEFAULT_SITE_CONTENT, ensureSiteContentSections } from './siteContentStorage';
import { 
  getStoredProjects, 
  saveStoredProjects, 
  saveProject, 
  deleteProject, 
  saveProjectsOrder, 
  normalizeProject, 
  getDeletedProjectIds,
  markProjectDeleted,
  loadProjectsFromIndexedDB 
} from './projectStorage';
import { 
  setCategoryCoversCache, 
  setCategoriesListCache, 
  saveCategoryCover, 
  CategoryCoverOptions,
  getDeletedCategoryIds,
  markCategoryDeleted
} from './categoryStorage';
import { normalizeProduct, saveStoredProducts, isDemoVideoUrl, deleteSingleStoredProduct } from './storage';
import { recompressBase64Image } from './imageCompressor';
import { isAdminLoggedIn, getAuthHeaders } from './adminAuth';
import {
  FIRESTORE_CHUNK_INDICATOR,
  saveCloudCategoryVideoChunks,
  loadCloudCategoryVideoChunks,
  deleteCloudCategoryVideoChunks,
  saveLocalCategoryVideo,
  saveCloudProductVideoChunks,
  loadCloudProductVideoChunks,
  deleteCloudProductVideoChunks,
  saveLocalProductVideo,
  deleteLocalProductVideo,
  getLocalProductVideo,
  saveLocalProjectVideo,
  getLocalProjectVideo,
  deleteLocalProjectVideo,
  saveCloudProjectVideoChunks,
  loadCloudProjectVideoChunks,
  deleteCloudProjectVideoChunks,
} from './mediaStorage';
import {
  saveSupabaseProduct,
  deleteSupabaseProduct,
  fetchSupabaseProducts,
  saveSupabaseCategory,
  deleteSupabaseCategory,
  fetchSupabaseCategories,
  saveSupabaseSiteContent,
  fetchSupabaseSiteContent,
  saveSupabaseLogo,
  fetchSupabaseLogo,
  fetchSupabaseProjects,
  saveSupabaseProject,
  deleteSupabaseProject,
  saveSupabaseProjectsOrder,
  fetchSupabaseClientsPartners,
  saveSupabaseClientPartner,
  deleteSupabaseClientPartner,
  saveSupabaseClientsPartnersOrder,
} from './supabaseDatabase';
import {
  getStoredClientsPartners,
  saveStoredClientsPartners,
  saveClientPartner,
  deleteClientPartner,
  saveClientsPartnersOrder,
  getDeletedClientsPartnersIds,
  markClientPartnerDeleted,
} from './clientsPartnersStorage';
import { isSupabaseConfigured, setSupabaseCredentials, supabase } from './supabase';
import { uploadToSupabaseStorage, deleteFromSupabaseStorage } from './supabaseStorage';

const SETTINGS_DOC = 'general';
const SETTINGS_COLLECTION = 'site_settings';
const CONTENT_COLLECTION = 'site_content';
const CONTENT_DOC = 'current_content';
const COVERS_COLLECTION = 'category_covers';
const CATEGORIES_COLLECTION = 'categories';
const PRODUCTS_COLLECTION = 'products';
const PROJECTS_COLLECTION = 'projects';

// --- CIRCUIT BREAKER FOR FIRESTORE QUOTA EXHAUSTION ---
export const FIRESTORE_QUOTA_STORAGE_KEY = 'turath_firestore_write_quota_exhausted_v1';
const QUOTA_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour cooldown if quota is genuinely reached

// Online cloud database is active and ready
let isFirestoreWriteQuotaExhausted = false;

// Check stored quota status from localStorage
if (typeof window !== 'undefined') {
  try {
    const stored = localStorage.getItem(FIRESTORE_QUOTA_STORAGE_KEY);
    if (stored) {
      if (Date.now() < Number(stored)) {
        isFirestoreWriteQuotaExhausted = true;
      } else {
        localStorage.removeItem(FIRESTORE_QUOTA_STORAGE_KEY);
        isFirestoreWriteQuotaExhausted = false;
      }
    }
  } catch {}
}

export function markWriteQuotaExhausted() {
  isFirestoreWriteQuotaExhausted = true;
  try {
    localStorage.setItem(FIRESTORE_QUOTA_STORAGE_KEY, String(Date.now() + QUOTA_COOLDOWN_MS));
  } catch {}
  console.warn('[Firestore] Online write quota limit reached. Preserving locally & in Supabase.');
}

export function markQuotaExhausted() {
  markWriteQuotaExhausted();
}

export function shouldSkipFirestoreWrite(): boolean {
  if (isFirestoreWriteQuotaExhausted) return true;
  try {
    const stored = localStorage.getItem(FIRESTORE_QUOTA_STORAGE_KEY);
    if (stored) {
      if (Date.now() < Number(stored)) {
        isFirestoreWriteQuotaExhausted = true;
        return true;
      } else {
        localStorage.removeItem(FIRESTORE_QUOTA_STORAGE_KEY);
        isFirestoreWriteQuotaExhausted = false;
      }
    }
  } catch {}
  return false;
}

export function isResourceExhaustedError(err: any): boolean {
  if (!err) return false;
  return (
    err?.code === 'resource-exhausted' ||
    (typeof err?.message === 'string' && (
      err.message.includes('Quota limit exceeded') ||
      err.message.includes('resource-exhausted') ||
      err.message.includes('Free daily write units') ||
      err.message.includes('maximum allowed queued writes') ||
      err.message.includes('exhausted maximum allowed queued writes')
    ))
  );
}

// --- SUPABASE CONFIG MULTI-BROWSER SYNC ---

export function subscribeToCloudSupabaseConfig(): Unsubscribe {
  const docRef = doc(db, SETTINGS_COLLECTION, 'supabase_config');
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      if (data?.publishableKey && typeof data.publishableKey === 'string' && data.publishableKey.trim()) {
        const currentKey = typeof window !== 'undefined' ? localStorage.getItem('turath_supabase_key') : null;
        if (currentKey !== data.publishableKey.trim()) {
          setSupabaseCredentials(data.publishableKey.trim(), data.url);
          console.log('[Supabase] Automatically synced publishable key from cloud across browsers!');
        }
      }
    }
  }, () => {});
}

export async function saveCloudSupabaseConfig(key: string, url?: string): Promise<void> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, 'supabase_config');
    await setDoc(docRef, {
      publishableKey: key.trim(),
      url: url?.trim() || undefined,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    console.log('[Supabase] Saved credentials to cloud for multi-browser sync.');
  } catch (e) {
    console.warn('Could not save Supabase config to cloud:', e);
  }
}

// --- LOGO CLOUD SYNC ---

export function subscribeToCloudLogo(onLogoChange: (logoUrl: string) => void): Unsubscribe {
  // If Supabase is configured, check for logo from Supabase
  if (isSupabaseConfigured()) {
    fetchSupabaseLogo().then((logo) => {
      if (logo) {
        try {
          localStorage.setItem('turath_custom_logo_v1', logo);
        } catch {}
        onLogoChange(logo);
        window.dispatchEvent(new Event('turath-logo-updated'));
      }
    }).catch(() => {});
  }

  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC);
  
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      if (data && typeof data.logoUrl === 'string' && data.logoUrl.trim().length > 0) {
        try {
          localStorage.setItem('turath_custom_logo_v1', data.logoUrl);
        } catch {
          // Ignore localStorage quota
        }
        onLogoChange(data.logoUrl);
        window.dispatchEvent(new Event('turath-logo-updated'));
        return;
      }
    }
  }, (error) => {
    if (isResourceExhaustedError(error)) {
      markQuotaExhausted();
      console.warn('[Firestore] Free daily write/read quota reached for logo. Serving from local storage.');
    } else {
      console.warn('Error subscribing to cloud logo:', error);
    }
  });
}

export async function saveCloudLogo(logoUrl: string): Promise<void> {
  if (!isAdminLoggedIn()) {
    throw new Error('Unauthorized: Admin session required to modify logo');
  }

  let safeLogo = logoUrl;

  // If Supabase is configured, upload to Supabase Storage if base64
  if (isSupabaseConfigured()) {
    try {
      if (typeof safeLogo === 'string' && safeLogo.startsWith('data:image/')) {
        try {
          const uploadedUrl = await uploadToSupabaseStorage(
            'site-media',
            `logo/turath_logo_${Date.now()}`,
            safeLogo
          );
          safeLogo = uploadedUrl;
        } catch (logoMediaErr) {
          console.warn('[Supabase Storage] Notice: Could not upload logo to storage bucket, saving logo directly:', logoMediaErr);
        }
      }
      await saveSupabaseLogo(safeLogo);
    } catch (supErr) {
      console.warn('[Supabase] Failed to save logo:', supErr);
    }
  }

  if (typeof safeLogo === 'string' && safeLogo.startsWith('data:image/') && safeLogo.length > 160000) {
    safeLogo = await recompressBase64Image(safeLogo, 150000);
  }

  // Always update locally first
  try {
    localStorage.setItem('turath_custom_logo_v1', safeLogo);
  } catch {
    // Ignore localStorage error
  }
  window.dispatchEvent(new Event('turath-logo-updated'));

  if (shouldSkipFirestoreWrite()) {
    console.warn('[Firestore] Quota limit active: Logo saved locally.');
    return;
  }

  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC);
    await setDoc(docRef, sanitizeForFirestore({
      logoUrl: safeLogo,
      updatedAt: new Date().toISOString(),
    }), { merge: true });
  } catch (err) {
    if (isResourceExhaustedError(err)) {
      markWriteQuotaExhausted();
      console.warn('[Firestore] Quota exceeded saving logo. Fallback to local storage.');
      return;
    }
    console.error('Failed to save logo to cloud database:', err);
    throw err;
  }
}

export async function resetCloudLogo(): Promise<void> {
  if (!isAdminLoggedIn()) {
    throw new Error('Unauthorized: Admin session required to reset logo');
  }

  if (isSupabaseConfigured()) {
    try {
      await saveSupabaseLogo(DEFAULT_LOGO_URL);
    } catch (supErr) {
      console.warn('[Supabase] Failed to reset logo:', supErr);
    }
  }

  try {
    localStorage.removeItem('turath_custom_logo_v1');
  } catch {
    // Ignore localStorage error
  }
  window.dispatchEvent(new Event('turath-logo-updated'));

  if (shouldSkipFirestoreWrite()) {
    return;
  }

  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC);
    await setDoc(docRef, {
      logoUrl: DEFAULT_LOGO_URL,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    if (isResourceExhaustedError(err)) {
      markQuotaExhausted();
      return;
    }
    console.error('Failed to reset logo in cloud:', err);
    throw err;
  }
}

// --- CATEGORY COVERS CLOUD SYNC ---

export function subscribeToCloudCategoryCovers(
  onCoversChange: (coversMap: Record<string, string>, optionsMap?: Record<string, CategoryCoverOptions>) => void
): Unsubscribe {
  const colRef = collection(db, COVERS_COLLECTION);

  return onSnapshot(colRef, (snapshot) => {
    const covers: Record<string, string> = {};
    const optionsMap: Record<string, CategoryCoverOptions> = {};
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data) {
        if (typeof data.coverImage === 'string' && data.coverImage.trim().length > 0) {
          covers[docSnap.id] = data.coverImage.trim();
        }

        const isChunked = data.hasVideoChunks === true || 
          data.coverVideoUrl === FIRESTORE_CHUNK_INDICATOR || 
          data.coverVideoUrl === '__CHUNKED__';

        const isDemo = isDemoVideoUrl(data.coverVideoUrl);

        optionsMap[docSnap.id] = {
          coverMediaType: isDemo ? 'image' : data.coverMediaType,
          coverVideoUrl: (isChunked || isDemo) ? '' : data.coverVideoUrl,
          hasVideoChunks: data.hasVideoChunks,
          videoChunksCount: data.videoChunksCount,
          coverImageRatio: data.coverImageRatio,
          customRatioWidth: data.customRatioWidth,
          customRatioHeight: data.customRatioHeight,
          coverImageFit: data.coverImageFit,
          coverImagePosition: data.coverImagePosition,
          coverVideoRatio: data.coverVideoRatio,
          coverVideoFit: data.coverVideoFit,
          coverVideoPosition: data.coverVideoPosition,
          coverVideoMuted: data.coverVideoMuted,
          galleryImages: Array.isArray(data.galleryImages) ? data.galleryImages : undefined,
          galleryRatios: data.galleryRatios,
          galleryFits: data.galleryFits,
          galleryPositions: data.galleryPositions,
        };

        // If video is chunked across documents, hydrate from IndexedDB cache or fetch chunks
        if (isChunked && data.coverMediaType === 'video') {
          const catId = docSnap.id;
          loadCloudCategoryVideoChunks(catId).then((assembledVideo) => {
            if (assembledVideo) {
              if (optionsMap[catId]) {
                optionsMap[catId].coverVideoUrl = assembledVideo;
              }
              setCategoryCoversCache(covers, optionsMap);
              onCoversChange(covers, optionsMap);
              window.dispatchEvent(
                new CustomEvent('turath-categories-updated', { detail: { covers, optionsMap } })
              );
            }
          }).catch((err) => {
            console.warn('Could not load chunked video for category:', catId, err);
          });
        }
      }
    });

    try {
      localStorage.setItem('turath_category_covers_v1', JSON.stringify(covers));
    } catch {
      // Ignore localStorage error
    }

    setCategoryCoversCache(covers, optionsMap);
    onCoversChange(covers, optionsMap);
    window.dispatchEvent(new CustomEvent('turath-categories-updated', { detail: { covers, optionsMap } }));
  }, (error) => {
    if (isResourceExhaustedError(error)) {
      markQuotaExhausted();
      console.warn('[Firestore] Free daily write/read quota reached for category covers. Serving from local storage.');
    } else {
      console.warn('Error subscribing to cloud category covers:', error);
    }
  });
}

export async function saveCloudCategoryCover(
  categoryId: string, 
  coverImageUrl: string,
  options?: CategoryCoverOptions
): Promise<void> {
  if (!isAdminLoggedIn()) {
    throw new Error('Unauthorized: Admin session required to update category covers');
  }

  let safeCoverUrl = (coverImageUrl || '').trim();
  const safeOptions: any = options ? { ...options } : {};

  // If Supabase is configured, upload cover image/video to Supabase Storage if Base64
  if (isSupabaseConfigured()) {
    try {
      if (safeCoverUrl.startsWith('data:image/')) {
        const uploadedUrl = await uploadToSupabaseStorage(
          'site-media',
          `categories/${categoryId}/cover_${Date.now()}`,
          safeCoverUrl
        );
        safeCoverUrl = uploadedUrl;
      }
      if (safeOptions?.coverVideoUrl && typeof safeOptions.coverVideoUrl === 'string' && safeOptions.coverVideoUrl.startsWith('data:video/')) {
        const uploadedVid = await uploadToSupabaseStorage(
          'product-videos',
          `categories/${categoryId}/video_${Date.now()}`,
          safeOptions.coverVideoUrl
        );
        safeOptions.coverVideoUrl = uploadedVid;
      }
    } catch (supErr) {
      console.warn('[Supabase Storage] Cover upload notice:', supErr);
    }
  }

  if (safeCoverUrl.startsWith('data:image/') && safeCoverUrl.length > 160000) {
    safeCoverUrl = await recompressBase64Image(safeCoverUrl, 150000);
  }

  if (Array.isArray(safeOptions.galleryImages)) {
    const compressedGalleries: string[] = [];
    for (const img of safeOptions.galleryImages) {
      if (typeof img === 'string' && img.startsWith('data:image/') && img.length > 160000) {
        compressedGalleries.push(await recompressBase64Image(img, 150000));
      } else {
        compressedGalleries.push(img);
      }
    }
    safeOptions.galleryImages = compressedGalleries;
  }

  const rawVideoUrl = typeof safeOptions.coverVideoUrl === 'string' ? safeOptions.coverVideoUrl.trim() : '';

  // Always save locally immediately
  const localOptions = { ...safeOptions, coverVideoUrl: rawVideoUrl || safeOptions.coverVideoUrl };
  saveCategoryCover(categoryId, safeCoverUrl, localOptions);

  if (rawVideoUrl.startsWith('data:video/')) {
    saveLocalCategoryVideo(categoryId, rawVideoUrl).catch(() => {});
  }

  if (shouldSkipFirestoreWrite()) {
    console.warn('[Firestore] Quota active: Category cover saved locally.');
    return;
  }

  try {
    let isVideoChunked = false;
    let videoChunksCount = 0;

    if (rawVideoUrl.startsWith('data:video/') && rawVideoUrl.length > 400000) {
      // Chunk the large video into subcollection documents
      videoChunksCount = await saveCloudCategoryVideoChunks(categoryId, rawVideoUrl);
      isVideoChunked = true;
      safeOptions.coverVideoUrl = FIRESTORE_CHUNK_INDICATOR;
      safeOptions.hasVideoChunks = true;
      safeOptions.videoChunksCount = videoChunksCount;
    } else if (rawVideoUrl && rawVideoUrl !== FIRESTORE_CHUNK_INDICATOR && rawVideoUrl !== '__CHUNKED__') {
      // Small video data URL or web link - clean any previously existing chunks
      await deleteCloudCategoryVideoChunks(categoryId);
      safeOptions.hasVideoChunks = false;
      safeOptions.videoChunksCount = 0;
    }

    const docRef = doc(db, COVERS_COLLECTION, categoryId);
    const payload: any = {
      categoryId,
      coverImage: safeCoverUrl,
      updatedAt: new Date().toISOString(),
    };
    if (safeOptions) {
      if (safeOptions.coverMediaType !== undefined) payload.coverMediaType = safeOptions.coverMediaType;
      if (safeOptions.coverVideoUrl !== undefined) payload.coverVideoUrl = safeOptions.coverVideoUrl;
      if (safeOptions.hasVideoChunks !== undefined) payload.hasVideoChunks = safeOptions.hasVideoChunks;
      if (safeOptions.videoChunksCount !== undefined) payload.videoChunksCount = safeOptions.videoChunksCount;
      if (safeOptions.coverImageRatio !== undefined) payload.coverImageRatio = safeOptions.coverImageRatio;
      if (safeOptions.customRatioWidth !== undefined) payload.customRatioWidth = safeOptions.customRatioWidth;
      if (safeOptions.customRatioHeight !== undefined) payload.customRatioHeight = safeOptions.customRatioHeight;
      if (safeOptions.coverImageFit !== undefined) payload.coverImageFit = safeOptions.coverImageFit;
      if (safeOptions.coverImagePosition !== undefined) payload.coverImagePosition = safeOptions.coverImagePosition;
      if (safeOptions.coverVideoRatio !== undefined) payload.coverVideoRatio = safeOptions.coverVideoRatio;
      if (safeOptions.coverVideoFit !== undefined) payload.coverVideoFit = safeOptions.coverVideoFit;
      if (safeOptions.coverVideoPosition !== undefined) payload.coverVideoPosition = safeOptions.coverVideoPosition;
      if (safeOptions.coverVideoMuted !== undefined) payload.coverVideoMuted = safeOptions.coverVideoMuted;
      if (safeOptions.galleryImages !== undefined) payload.galleryImages = safeOptions.galleryImages;
      if (safeOptions.galleryRatios !== undefined) payload.galleryRatios = safeOptions.galleryRatios;
      if (safeOptions.galleryFits !== undefined) payload.galleryFits = safeOptions.galleryFits;
      if (safeOptions.galleryPositions !== undefined) payload.galleryPositions = safeOptions.galleryPositions;
    }

    const sanitizedPayload = sanitizeForFirestore(payload);
    await setDoc(docRef, sanitizedPayload, { merge: true });

    // Also update categories collection if document exists
    try {
      const catDocRef = doc(db, CATEGORIES_COLLECTION, categoryId);
      await setDoc(catDocRef, sanitizedPayload, { merge: true });
    } catch {
      // Ignore if category doc update not needed
    }
  } catch (err) {
    if (isResourceExhaustedError(err)) {
      markWriteQuotaExhausted();
      console.warn('[Firestore] Quota exceeded while saving cover. Preserved locally.');
      return;
    }
    console.error('Failed to save category cover to cloud:', err);
    throw err;
  }
}

export async function resetCloudCategoryCover(categoryId: string): Promise<void> {
  if (!isAdminLoggedIn()) {
    throw new Error('Unauthorized: Admin session required to reset category cover');
  }

  if (shouldSkipFirestoreWrite()) {
    return;
  }

  try {
    await deleteCloudCategoryVideoChunks(categoryId);
    const docRef = doc(db, COVERS_COLLECTION, categoryId);
    await deleteDoc(docRef);
  } catch (err) {
    if (isResourceExhaustedError(err)) {
      markWriteQuotaExhausted();
      return;
    }
    console.error('Failed to reset category cover in cloud:', err);
    throw err;
  }
}

// --- PRODUCTS CLOUD SYNC ---

let isSeeding = false;

// Helper to recursively strip undefined values and prepare Firestore-safe JSON
export function sanitizeForFirestore<T>(val: T): T {
  if (val === undefined) return null as unknown as T;
  if (val === null || typeof val !== 'object') return val;
  if (Array.isArray(val)) {
    return val.map((item) => sanitizeForFirestore(item)).filter((item) => item !== undefined) as unknown as T;
  }
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(val as Record<string, any>)) {
    if (value !== undefined) {
      result[key] = sanitizeForFirestore(value);
    }
  }
  return result as T;
}

export function subscribeToCloudProducts(
  onProductsChange: (products: ProductItem[]) => void
): Unsubscribe {
  let cloudDeletedIds = new Set<string>();

  // Helper to load deleted IDs from local cache
  const getDeletedIds = () => {
    const deleted = new Set<string>(cloudDeletedIds);
    try {
      const stored = localStorage.getItem('turath_deleted_product_ids_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          parsed.forEach((id: string) => deleted.add(id));
        }
      }
    } catch {
      // Ignore
    }
    return deleted;
  };

  // Sync strictly from Supabase as single source of truth
  const syncFromSupabase = async () => {
    if (!isSupabaseConfigured()) return;
    try {
      const supProds = await fetchSupabaseProducts();
      if (Array.isArray(supProds)) {
        const deletedIds = getDeletedIds();
        const cleanedCatalog = supProds
          .filter((p) => !deletedIds.has(p.id) && p.categoryId !== 'wall-art' && p.id !== 'turath-wallart-01')
          .map((p) => normalizeProduct(p));
        saveStoredProducts(cleanedCatalog);
        onProductsChange(cleanedCatalog);
      }
    } catch (err) {
      console.warn('[Supabase] Products sync notice:', err);
    }
  };

  // 1. Initial sync immediately from Supabase if configured
  if (isSupabaseConfigured()) {
    syncFromSupabase();
  }

  // 2. Real-time Supabase subscription across all browsers and devices
  let supabaseChannel: any = null;
  if (supabase && isSupabaseConfigured()) {
    try {
      supabaseChannel = supabase
        .channel('turath-products-realtime-sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
          syncFromSupabase();
        })
        .subscribe();
    } catch (chanErr) {
      console.warn('[Supabase Realtime] Channel subscription warning:', chanErr);
    }
  }

  // 3. Window focus listener for instant multi-tab & cross-device refresh
  const handleFocus = () => {
    if (isSupabaseConfigured()) {
      syncFromSupabase();
    }
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('focus', handleFocus);
  }

  // 4. Firestore real-time listener (fallback only when Supabase is not configured)
  const colRef = collection(db, PRODUCTS_COLLECTION);

  // Real-time synchronization of deleted initial product IDs across all browsers and devices
  try {
    const metaDocRef = doc(db, SETTINGS_COLLECTION, 'catalog_metadata');
    onSnapshot(metaDocRef, (metaSnap) => {
      if (metaSnap.exists()) {
        const metaData = metaSnap.data();
        if (Array.isArray(metaData?.deletedProductIds)) {
          cloudDeletedIds = new Set(metaData.deletedProductIds);
          try {
            localStorage.setItem('turath_deleted_product_ids_v1', JSON.stringify(metaData.deletedProductIds));
          } catch {
            // Ignore
          }
        }
      }
    }, () => {});
  } catch {
    // Ignore
  }

  const firestoreUnsub = onSnapshot(colRef, async (snapshot) => {
    // If Supabase is configured, Supabase is the strict single source of truth for products & media
    if (isSupabaseConfigured()) {
      return;
    }

    const deletedIds = getDeletedIds();
    const loadedCloudMap = new Map<string, ProductItem>();
    const chunkedProductIds: string[] = [];
    const mergedMap = new Map<string, ProductItem>();

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data && data.id && !deletedIds.has(data.id)) {
        if (data.videoUrl === FIRESTORE_CHUNK_INDICATOR) {
          chunkedProductIds.push(data.id);
          data.videoUrl = '';
          getLocalProductVideo(data.id).then((cached) => {
            if (cached) {
              const currentList = Array.from(mergedMap.values());
              const target = currentList.find(p => p.id === data.id);
              if (target) {
                target.videoUrl = cached;
                onProductsChange([...currentList]);
              }
            }
          }).catch(() => {});
        }
        const normalized = normalizeProduct(data as Partial<ProductItem>);
        loadedCloudMap.set(normalized.id, normalized);
      }
    });

    for (const [id, cloudProd] of loadedCloudMap.entries()) {
      if (!deletedIds.has(id)) {
        mergedMap.set(id, cloudProd);
      }
    }

    const completeCatalog = Array.from(mergedMap.values()).filter(
      (p) => p.categoryId !== 'wall-art' && p.id !== 'turath-wallart-01'
    );

    saveStoredProducts(completeCatalog);
    onProductsChange(completeCatalog);

    // Hydrate any cloud-chunked product videos across devices
    if (chunkedProductIds.length > 0) {
      chunkedProductIds.forEach((pid) => {
        loadCloudProductVideoChunks(pid).then((assembled) => {
          if (assembled) {
            const currentCatalog = Array.from(mergedMap.values());
            const target = currentCatalog.find(p => p.id === pid);
            if (target && target.videoUrl !== assembled) {
              target.videoUrl = assembled;
              saveStoredProducts(currentCatalog);
              onProductsChange([...currentCatalog]);
            }
          }
        }).catch((err) => {
          console.warn('Could not load cloud video chunks for product:', pid, err);
        });
      });
    }
  }, (error) => {
    if (isResourceExhaustedError(error)) {
      markQuotaExhausted();
      console.warn('[Firestore] Free daily write/read quota reached. App is operating smoothly using cached local data.');
    } else {
      console.warn('Error subscribing to cloud products:', error);
    }
  });

  return () => {
    firestoreUnsub();
    if (supabaseChannel) {
      try {
        supabaseChannel.unsubscribe();
      } catch {}
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('focus', handleFocus);
    }
  };
}

export async function seedInitialProducts(): Promise<void> {
  // Products must come ONLY from explicit Turath data in Supabase. Never auto-seed.
  return;
}

export async function prepareProductForFirestore(product: ProductItem): Promise<Record<string, any>> {
  const rawObj: Record<string, any> = sanitizeForFirestore({
    ...product,
    updatedAt: new Date().toISOString(),
  });

  // Never store redundant galleryImages in Firestore:
  // images array already contains [mainImage, ...galleryImages].
  delete rawObj.galleryImages;

  // Consolidate images list
  let imagesList: string[] = Array.isArray(rawObj.images) && rawObj.images.length > 0
    ? [...rawObj.images]
    : rawObj.mainImage ? [rawObj.mainImage] : [];

  // Filter empty and remove exact duplicate image strings
  imagesList = Array.from(new Set(imagesList.filter((img) => typeof img === 'string' && img.trim().length > 0)));

  if (imagesList.length > 0) {
    rawObj.images = imagesList;
    rawObj.mainImage = imagesList[0];
  }

  // Handle Base64 video file uploads:
  // If video is base64, save chunked video into Firestore products/{productId}/video_chunks
  // and mark videoUrl with FIRESTORE_CHUNK_INDICATOR so all devices know video is stored in cloud
  let hasBase64Video = false;
  let base64VideoContent = '';
  if (typeof rawObj.videoUrl === 'string' && rawObj.videoUrl.startsWith('data:video/')) {
    hasBase64Video = true;
    base64VideoContent = rawObj.videoUrl;
    rawObj.videoUrl = FIRESTORE_CHUNK_INDICATOR;
    // Also cache locally in IndexedDB immediately for this admin session
    saveLocalProductVideo(product.id, base64VideoContent).catch(() => {});
  }

  // Check document byte size
  let jsonStr = JSON.stringify(rawObj);
  let byteSize = new Blob([jsonStr]).size;

  // If payload approaches 700KB, compress any oversized base64 images
  if (byteSize > 700000 && Array.isArray(rawObj.images)) {
    const compressedImages: string[] = [];
    for (const img of rawObj.images) {
      if (typeof img === 'string' && img.startsWith('data:image/') && img.length > 150000) {
        const smaller = await recompressBase64Image(img, 130000);
        compressedImages.push(smaller);
      } else {
        compressedImages.push(img);
      }
    }
    rawObj.images = compressedImages;
    if (compressedImages.length > 0) {
      rawObj.mainImage = compressedImages[0];
    }
    jsonStr = JSON.stringify(rawObj);
    byteSize = new Blob([jsonStr]).size;
  }

  // If still above 850KB, keep the top 3 images to strictly respect Firestore's 1MB limit
  if (byteSize > 850000 && Array.isArray(rawObj.images) && rawObj.images.length > 3) {
    rawObj.images = rawObj.images.slice(0, 3);
    rawObj.mainImage = rawObj.images[0];
  }

  // Attach temporary flag for saveCloudProduct so it writes chunks
  if (hasBase64Video) {
    (rawObj as any).__rawBase64Video = base64VideoContent;
  }

  return rawObj;
}

export async function saveCloudProduct(product: ProductItem): Promise<void> {
  if (!isAdminLoggedIn()) {
    throw new Error('Unauthorized: Admin session required to save product');
  }

  // 1. If Supabase is configured, prioritize saving product & media to Supabase
  if (isSupabaseConfigured()) {
    try {
      let finalProduct = { ...product };

      // Check if mainImage is Base64 or Blob -> upload to Supabase Storage
      if (finalProduct.mainImage && (finalProduct.mainImage.startsWith('data:') || finalProduct.mainImage.startsWith('blob:'))) {
        try {
          const uploadedUrl = await uploadToSupabaseStorage(
            'product-images',
            `${finalProduct.id}/main_${Date.now()}`,
            finalProduct.mainImage
          );
          finalProduct.mainImage = uploadedUrl;
        } catch (upErr: any) {
          console.error('[Supabase Storage] Failed to upload main image:', upErr);
          throw new Error(`تعذر حفظ الصورة الرئيسية في Supabase: ${upErr?.message || upErr}`);
        }
      }

      // Check gallery images -> upload to Supabase Storage if base64 or blob
      const rawImages = Array.isArray(finalProduct.images) ? [...finalProduct.images] : (finalProduct.mainImage ? [finalProduct.mainImage] : []);
      const uploadedImages: string[] = [];
      for (let i = 0; i < rawImages.length; i++) {
        const img = rawImages[i];
        if (img && (img.startsWith('data:') || img.startsWith('blob:'))) {
          try {
            const url = await uploadToSupabaseStorage(
              'product-images',
              `${finalProduct.id}/gallery_${i}_${Date.now()}`,
              img
            );
            uploadedImages.push(url);
          } catch (imgErr) {
            console.warn(`[Supabase Storage] Failed to upload gallery image ${i}:`, imgErr);
            uploadedImages.push(img);
          }
        } else if (img) {
          uploadedImages.push(img);
        }
      }

      if (uploadedImages.length > 0) {
        finalProduct.images = uploadedImages;
        if (!finalProduct.mainImage || finalProduct.mainImage.startsWith('data:') || finalProduct.mainImage.startsWith('blob:')) {
          finalProduct.mainImage = uploadedImages[0];
        }
        finalProduct.galleryImages = uploadedImages.slice(1);
      }

      // Check product video -> upload to Supabase Storage if base64 or blob
      const rawVideo = finalProduct.videoUrl || finalProduct.productVideo;
      if (rawVideo && (rawVideo.startsWith('data:') || rawVideo.startsWith('blob:'))) {
        // Save locally to IndexedDB immediately so user never loses their video
        saveLocalProductVideo(finalProduct.id, rawVideo).catch(() => {});
        try {
          const uploadedVideoUrl = await uploadToSupabaseStorage(
            'product-videos',
            `${finalProduct.id}/video_${Date.now()}`,
            rawVideo
          );
          finalProduct.videoUrl = uploadedVideoUrl;
          finalProduct.productVideo = uploadedVideoUrl;
        } catch (vidErr: any) {
          console.error('[Supabase Storage] Failed to upload video:', vidErr);
          // Video upload failed to storage; do not keep multi-megabyte string in row to avoid PostgREST 413
          finalProduct.videoUrl = undefined;
          finalProduct.productVideo = undefined;
          throw new Error(`تعذر حفظ الفيديو في مخزن Supabase: ${vidErr?.message || vidErr}. تأكد من إنشاء وعاء product-videos في Supabase Storage وجعله Public.`);
        }
      }

      const savedOk = await saveSupabaseProduct(finalProduct);
      if (savedOk) {
        console.log(`[Supabase] Successfully saved product ${finalProduct.id} to Supabase database.`);
      } else {
        throw new Error(`تعذر حفظ سجل المنتج في جدول products بـ Supabase. تأكد من تهيئة الجداول عبر supabase_schema.sql.`);
      }

      // Update local object to reflect uploaded URLs
      product.mainImage = finalProduct.mainImage;
      product.images = finalProduct.images;
      product.galleryImages = finalProduct.galleryImages;
      product.videoUrl = finalProduct.videoUrl;
      product.productVideo = finalProduct.productVideo;
    } catch (supErr: any) {
      console.error('[Supabase] Save error:', supErr);
      throw supErr;
    }
  }

  if (shouldSkipFirestoreWrite()) {
    console.warn('[Firestore] Quota active: Product saved locally.');
    return;
  }

  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
    const prepared = await prepareProductForFirestore(product);
    
    const pendingVideo = (prepared as any).__rawBase64Video;
    delete (prepared as any).__rawBase64Video;

    // If a new base64 video was uploaded, upload chunks to Firestore
    if (pendingVideo && typeof pendingVideo === 'string') {
      try {
        await saveCloudProductVideoChunks(product.id, pendingVideo);
        console.log(`[CloudDatabase] Successfully stored video chunks for product ${product.id} to Firestore.`);
      } catch (videoErr) {
        if (isResourceExhaustedError(videoErr)) {
          markWriteQuotaExhausted();
        } else {
          console.warn('Could not store video chunks to cloud for product:', product.id, videoErr);
        }
      }
    } else if (!product.videoUrl) {
      // If user cleared or removed the video, clean up any previous video chunks and local cached video
      deleteCloudProductVideoChunks(product.id).catch(() => {});
      deleteLocalProductVideo(product.id).catch(() => {});
      try {
        localStorage.removeItem(`turath_video_${product.id}`);
      } catch {}
    }

    // Save product document to Firestore with merge to guarantee document integrity across browsers
    await setDoc(docRef, prepared, { merge: true });
    console.log(`[CloudDatabase] Successfully saved product ${product.id} to Firestore.`);
  } catch (err) {
    if (isResourceExhaustedError(err)) {
      markWriteQuotaExhausted();
      console.warn('[Firestore] Quota exceeded saving product. Local catalog preserved.');
      return;
    }
    console.error('Failed to save product to cloud Firestore:', err);
    throw err;
  }
}

export async function deleteCloudProduct(productId: string): Promise<void> {
  if (!isAdminLoggedIn()) {
    throw new Error('Unauthorized: Admin session required to delete product');
  }

  // 1. If Supabase is configured, delete from Supabase
  if (isSupabaseConfigured()) {
    try {
      await deleteSupabaseProduct(productId);
      console.log(`[Supabase] Deleted product ${productId} from Supabase.`);
    } catch (supErr) {
      console.warn('[Supabase] deleteProduct warning:', supErr);
    }
  }

  // 2. Remove immediately from local storage, IndexedDB, and clean up any local cached video
  deleteSingleStoredProduct(productId);
  deleteLocalProductVideo(productId).catch(() => {});
  try {
    localStorage.removeItem(`turath_video_${productId}`);
  } catch {}

  // 3. Track in deleted list so initial products aren't re-added
  try {
    const deletedKey = 'turath_deleted_product_ids_v1';
    const existing = localStorage.getItem(deletedKey);
    const list: string[] = existing ? JSON.parse(existing) : [];
    if (!list.includes(productId)) {
      list.push(productId);
      localStorage.setItem(deletedKey, JSON.stringify(list));
    }
  } catch {
    // Ignore localStorage error
  }

  if (shouldSkipFirestoreWrite()) {
    return;
  }

  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(docRef);

    // Delete any associated video chunks in Firestore
    deleteCloudProductVideoChunks(productId).catch(() => {});

    try {
      const deletedKey = 'turath_deleted_product_ids_v1';
      const existing = localStorage.getItem(deletedKey);
      const list: string[] = existing ? JSON.parse(existing) : [];
      const metaDocRef = doc(db, SETTINGS_COLLECTION, 'catalog_metadata');
      await setDoc(metaDocRef, sanitizeForFirestore({ deletedProductIds: list, updatedAt: new Date().toISOString() }), { merge: true });
    } catch {
      // Ignore localStorage error
    }
  } catch (err) {
    if (isResourceExhaustedError(err)) {
      markWriteQuotaExhausted();
      return;
    }
    console.error('Failed to delete product from cloud:', err);
    throw err;
  }
}

export async function resetCloudProducts(): Promise<void> {
  if (!isAdminLoggedIn()) {
    throw new Error('Unauthorized: Admin session required to reset products');
  }

  if (shouldSkipFirestoreWrite()) {
    return;
  }

  try {
    // Clear deleted product IDs
    try {
      localStorage.removeItem('turath_deleted_product_ids_v1');
      const metaDocRef = doc(db, SETTINGS_COLLECTION, 'catalog_metadata');
      await setDoc(metaDocRef, { deletedProductIds: [], updatedAt: new Date().toISOString() }, { merge: true });
    } catch {
      // Ignore
    }

    // Delete existing products
    const colRef = collection(db, PRODUCTS_COLLECTION);
    const existing = await getDocs(colRef);
    const deleteBatch = writeBatch(db);
    existing.forEach((docSnap) => {
      deleteBatch.delete(docSnap.ref);
    });
    await deleteBatch.commit();
  } catch (err) {
    if (isResourceExhaustedError(err)) {
      markQuotaExhausted();
      return;
    }
    console.error('Failed to reset cloud products:', err);
    throw err;
  }
}

// --- SITE CONTENT (HEADLINES & TEXTS) CLOUD SYNC ---

const SITE_CONTENT_STORAGE_KEY = 'turath_site_content_v2';

export function subscribeToCloudSiteContent(
  onContentChange: (content: SiteContent) => void
): Unsubscribe {
  // If Supabase is configured, fetch site content from Supabase
  if (isSupabaseConfigured()) {
    fetchSupabaseSiteContent().then((content) => {
      if (content) {
        const enriched = ensureSiteContentSections(content);
        try {
          localStorage.setItem(SITE_CONTENT_STORAGE_KEY, JSON.stringify(enriched));
        } catch {}
        onContentChange(enriched);
        window.dispatchEvent(new CustomEvent('turath-site-content-updated', { detail: enriched }));
      }
    }).catch(() => {});
  }

  const docRef = doc(db, CONTENT_COLLECTION, CONTENT_DOC);

  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data && typeof data === 'object') {
          const merged = ensureSiteContentSections({
            ...DEFAULT_SITE_CONTENT,
            ...(data as Partial<SiteContent>),
          });
          try {
            localStorage.setItem(SITE_CONTENT_STORAGE_KEY, JSON.stringify(merged));
          } catch {
            // Ignore localStorage quota
          }
          onContentChange(merged);
          window.dispatchEvent(new CustomEvent('turath-site-content-updated', { detail: merged }));
        }
      }
    },
    (error) => {
      if (isResourceExhaustedError(error)) {
        markQuotaExhausted();
        console.warn('[Firestore] Free daily write/read quota reached for site content. Serving from local storage.');
      } else {
        console.warn('Error subscribing to cloud site content:', error);
      }
    }
  );
}

export async function saveCloudSiteContent(content: SiteContent): Promise<void> {
  if (!isAdminLoggedIn()) {
    throw new Error('Unauthorized: Admin session required to save site content');
  }

  const clone = { ...content };

  // If Supabase is configured, upload about/founder photos to Supabase Storage if Base64
  if (isSupabaseConfigured()) {
    try {
      if (typeof clone.aboutImage === 'string' && clone.aboutImage.startsWith('data:image/')) {
        try {
          const url = await uploadToSupabaseStorage('site-media', `about/about_${Date.now()}`, clone.aboutImage);
          clone.aboutImage = url;
          if (clone.about) clone.about.image = url;
        } catch (aboutErr) {
          console.warn('[Supabase Storage] Notice: Could not upload about photo to bucket, preserving image in document:', aboutErr);
        }
      }
      if (typeof clone.founderImage === 'string' && clone.founderImage.startsWith('data:image/')) {
        try {
          const url = await uploadToSupabaseStorage('site-media', `founder/founder_${Date.now()}`, clone.founderImage);
          clone.founderImage = url;
        } catch (founderErr) {
          console.warn('[Supabase Storage] Notice: Could not upload founder photo to bucket, preserving image in document:', founderErr);
        }
      }
      await saveSupabaseSiteContent(clone);
      console.log('[Supabase] Successfully saved site content to Supabase database.');
    } catch (supErr) {
      console.warn('[Supabase] Failed to save site content to Supabase:', supErr);
    }
  }

  if (typeof clone.aboutImage === 'string' && clone.aboutImage.startsWith('data:image/') && clone.aboutImage.length > 160000) {
    clone.aboutImage = await recompressBase64Image(clone.aboutImage, 150000);
  }
  if (typeof clone.founderImage === 'string' && clone.founderImage.startsWith('data:image/') && clone.founderImage.length > 160000) {
    clone.founderImage = await recompressBase64Image(clone.founderImage, 150000);
  }
  if (clone.about && typeof clone.about.image === 'string' && clone.about.image.startsWith('data:image/') && clone.about.image.length > 160000) {
    clone.about.image = await recompressBase64Image(clone.about.image, 150000);
  }

  // Always update locally first
  try {
    localStorage.setItem(SITE_CONTENT_STORAGE_KEY, JSON.stringify(clone));
  } catch {
    // Ignore localStorage error
  }
  window.dispatchEvent(new CustomEvent('turath-site-content-updated', { detail: clone }));

  if (shouldSkipFirestoreWrite()) {
    console.warn('[Firestore] Quota active: Site content saved locally.');
    return;
  }

  try {
    const sanitized = sanitizeForFirestore({
      ...clone,
      updatedAt: new Date().toISOString(),
    });

    const docRef = doc(db, CONTENT_COLLECTION, CONTENT_DOC);
    await setDoc(docRef, sanitized, { merge: true });
  } catch (err) {
    if (isResourceExhaustedError(err)) {
      markWriteQuotaExhausted();
      console.warn('[Firestore] Quota exceeded saving site content. Local update preserved.');
      return;
    }
    console.error('Failed to save site content to cloud:', err);
    throw err;
  }
}

export async function resetCloudSiteContent(): Promise<void> {
  if (!isAdminLoggedIn()) {
    throw new Error('Unauthorized: Admin session required to reset site content');
  }

  if (isSupabaseConfigured()) {
    try {
      await saveSupabaseSiteContent(DEFAULT_SITE_CONTENT);
    } catch (supErr) {
      console.warn('[Supabase] Failed to reset site content:', supErr);
    }
  }

  try {
    localStorage.removeItem(SITE_CONTENT_STORAGE_KEY);
  } catch {
    // Ignore localStorage error
  }
  window.dispatchEvent(new CustomEvent('turath-site-content-updated', { detail: DEFAULT_SITE_CONTENT }));

  if (shouldSkipFirestoreWrite()) {
    return;
  }

  try {
    const docRef = doc(db, CONTENT_COLLECTION, CONTENT_DOC);
    await setDoc(docRef, sanitizeForFirestore({
      ...DEFAULT_SITE_CONTENT,
      updatedAt: new Date().toISOString(),
    }));
  } catch (err) {
    if (isResourceExhaustedError(err)) {
      markWriteQuotaExhausted();
      return;
    }
    console.error('Failed to reset cloud site content:', err);
    throw err;
  }
}

// --- DYNAMIC CATEGORIES CLOUD SYNC ---

export function subscribeToCloudCategories(
  onCategoriesChange: (categories: ProductCategoryInfo[]) => void
): Unsubscribe {
  // If Supabase is configured, fetch categories from Supabase
  if (isSupabaseConfigured()) {
    fetchSupabaseCategories().then((cats) => {
      if (Array.isArray(cats) && cats.length > 0) {
        const deletedIds = getDeletedCategoryIds();
        const filteredList = cats.filter((c) => c.id !== 'wall-art' && !deletedIds.has(c.id));
        try {
          localStorage.setItem('turath_categories_list_v3', JSON.stringify(filteredList));
        } catch {}
        setCategoriesListCache(filteredList);
        onCategoriesChange(filteredList);
        window.dispatchEvent(
          new CustomEvent('turath-categories-updated', { detail: { categories: filteredList } })
        );
      }
    }).catch(() => {});
  }

  const colRef = collection(db, CATEGORIES_COLLECTION);

  return onSnapshot(
    colRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const list: ProductCategoryInfo[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data && data.id && data.name) {
            list.push({
              id: data.id,
              name: data.name,
              nameArabic: data.nameArabic || data.name,
              shortDesc: data.shortDesc || '',
              description: data.description || '',
              coverImage: data.coverImage || '',
              coverMediaType: data.coverMediaType || 'image',
              coverVideoUrl: data.coverVideoUrl || '',
              iconName: data.iconName || 'Sparkles',
              coverImageRatio: data.coverImageRatio || 'Original',
              customRatioWidth: data.customRatioWidth,
              customRatioHeight: data.customRatioHeight,
              coverImageFit: data.coverImageFit || 'cover',
              coverImagePosition: data.coverImagePosition || 'center',
              coverVideoRatio: data.coverVideoRatio || data.coverImageRatio || 'Original',
              coverVideoFit: data.coverVideoFit || 'cover',
              coverVideoPosition: data.coverVideoPosition || 'center',
              galleryImages: data.galleryImages || [],
              galleryRatios: data.galleryRatios || {},
              galleryFits: data.galleryFits || {},
              galleryPositions: data.galleryPositions || {},
              order: typeof data.order === 'number' ? data.order : undefined,
            });
          }
        });

        const deletedIds = getDeletedCategoryIds();
        const filteredList = list.filter((c) => c.id !== 'wall-art' && !deletedIds.has(c.id));

        // Sort by order if defined
        filteredList.sort((a, b) => {
          const orderA = typeof a.order === 'number' ? a.order : 999;
          const orderB = typeof b.order === 'number' ? b.order : 999;
          if (orderA !== orderB) return orderA - orderB;
          return 0;
        });

        try {
          localStorage.setItem('turath_categories_list_v3', JSON.stringify(filteredList));
        } catch {
          // Ignore localStorage error
        }
        setCategoriesListCache(filteredList);
        onCategoriesChange(filteredList);
        window.dispatchEvent(
          new CustomEvent('turath-categories-updated', { detail: { categories: filteredList } })
        );
      }
    },
    (error) => {
      if (isResourceExhaustedError(error)) {
        markQuotaExhausted();
        console.warn('[Firestore] Free daily write/read quota reached for categories. Serving from local storage.');
      } else {
        console.warn('Error subscribing to cloud categories:', error);
      }
    }
  );
}

export async function saveCloudCategory(category: ProductCategoryInfo): Promise<void> {
  if (!isAdminLoggedIn()) {
    throw new Error('Unauthorized: Admin session required to save category');
  }

  const clone = { ...category };

  // If Supabase is configured, upload cover image/video to Supabase Storage if Base64
  if (isSupabaseConfigured()) {
    try {
      if (typeof clone.coverImage === 'string' && (clone.coverImage.startsWith('data:') || clone.coverImage.startsWith('blob:'))) {
        try {
          const url = await uploadToSupabaseStorage('site-media', `categories/${clone.id}/cover_${Date.now()}`, clone.coverImage);
          clone.coverImage = url;
        } catch (covImgErr) {
          console.warn(`[Supabase Storage] Cover image upload fallback for ${clone.id}:`, covImgErr);
        }
      }
      if (typeof clone.coverVideoUrl === 'string' && (clone.coverVideoUrl.startsWith('data:') || clone.coverVideoUrl.startsWith('blob:'))) {
        try {
          const url = await uploadToSupabaseStorage('product-videos', `categories/${clone.id}/video_${Date.now()}`, clone.coverVideoUrl);
          clone.coverVideoUrl = url;
        } catch (covVidErr) {
          console.warn(`[Supabase Storage] Cover video upload fallback for ${clone.id}:`, covVidErr);
        }
      }
      await saveSupabaseCategory(clone);
      console.log(`[Supabase] Successfully saved category ${clone.id} to Supabase database.`);
      category.coverImage = clone.coverImage;
      category.coverVideoUrl = clone.coverVideoUrl;
    } catch (supErr) {
      console.warn('[Supabase] Failed to save category to Supabase:', supErr);
    }
  }

  if (typeof clone.coverImage === 'string' && clone.coverImage.startsWith('data:image/') && clone.coverImage.length > 160000) {
    clone.coverImage = await recompressBase64Image(clone.coverImage, 150000);
  }

  // Always update locally first
  try {
    const existing = localStorage.getItem('turath_categories_list_v3');
    const list: ProductCategoryInfo[] = existing ? JSON.parse(existing) : [];
    const idx = list.findIndex(c => c.id === category.id);
    if (idx >= 0) {
      list[idx] = clone;
    } else {
      list.push(clone);
    }
    localStorage.setItem('turath_categories_list_v3', JSON.stringify(list));
    setCategoriesListCache(list);
  } catch {
    // Ignore localStorage error
  }

  if (shouldSkipFirestoreWrite()) {
    console.warn('[Firestore] Quota active: Category saved locally.');
    return;
  }

  try {
    // Protect against video > 400,000 chars exceeding Firestore 1MB doc limit
    if (typeof clone.coverVideoUrl === 'string' && clone.coverVideoUrl.startsWith('data:video/') && clone.coverVideoUrl.length > 400000) {
      await saveCloudCategoryVideoChunks(category.id, clone.coverVideoUrl);
      clone.coverVideoUrl = FIRESTORE_CHUNK_INDICATOR;
      clone.hasVideoChunks = true;
    }

    const sanitized = sanitizeForFirestore({
      ...clone,
      updatedAt: new Date().toISOString(),
    });

    const docRef = doc(db, CATEGORIES_COLLECTION, category.id);
    await setDoc(docRef, sanitized, { merge: true });

    // Also sync to COVERS_COLLECTION so cover subscribers update simultaneously
    try {
      const coverDocRef = doc(db, COVERS_COLLECTION, category.id);
      await setDoc(coverDocRef, sanitizeForFirestore({
        categoryId: category.id,
        coverImage: clone.coverImage || '',
        coverMediaType: clone.coverMediaType || 'image',
        coverVideoUrl: clone.coverVideoUrl || '',
        hasVideoChunks: clone.hasVideoChunks || false,
        videoChunksCount: clone.videoChunksCount || 0,
        coverImageRatio: clone.coverImageRatio || '16:7',
        customRatioWidth: clone.customRatioWidth,
        customRatioHeight: clone.customRatioHeight,
        coverImageFit: clone.coverImageFit || 'cover',
        coverImagePosition: clone.coverImagePosition || 'center',
        coverVideoRatio: clone.coverVideoRatio || clone.coverImageRatio || '16:7',
        coverVideoFit: clone.coverVideoFit || 'cover',
        coverVideoPosition: clone.coverVideoPosition || 'center',
        coverVideoMuted: clone.coverVideoMuted || false,
        updatedAt: new Date().toISOString(),
      }), { merge: true });
    } catch {
      // Ignore secondary update error
    }
  } catch (err) {
    if (isResourceExhaustedError(err)) {
      markWriteQuotaExhausted();
      console.warn('[Firestore] Quota exceeded saving category. Preserved locally.');
      return;
    }
    console.error('Failed to save category to cloud:', err);
    throw err;
  }
}

export async function deleteCloudCategory(categoryId: string): Promise<void> {
  if (!isAdminLoggedIn()) {
    throw new Error('Unauthorized: Admin session required to delete category');
  }
  markCategoryDeleted(categoryId);

  if (isSupabaseConfigured()) {
    try {
      await deleteSupabaseCategory(categoryId);
      console.log(`[Supabase] Deleted category ${categoryId} from Supabase.`);
    } catch (supErr) {
      console.warn('[Supabase] Failed to delete category:', supErr);
    }
  }

  try {
    const existing = localStorage.getItem('turath_categories_list_v3');
    if (existing) {
      const list: ProductCategoryInfo[] = JSON.parse(existing);
      const filtered = list.filter(c => c.id !== categoryId);
      localStorage.setItem('turath_categories_list_v3', JSON.stringify(filtered));
      setCategoriesListCache(filtered);
    }
  } catch {
    // Ignore localStorage error
  }

  if (shouldSkipFirestoreWrite()) {
    return;
  }

  try {
    await deleteCloudCategoryVideoChunks(categoryId);
    const docRef = doc(db, CATEGORIES_COLLECTION, categoryId);
    await deleteDoc(docRef);

    try {
      const coverDocRef = doc(db, COVERS_COLLECTION, categoryId);
      await deleteDoc(coverDocRef);
    } catch {
      // Ignore
    }
  } catch (err) {
    if (isResourceExhaustedError(err)) {
      markWriteQuotaExhausted();
      return;
    }
    console.error('Failed to delete category from cloud:', err);
    throw err;
  }
}

export async function saveCloudCategoriesOrder(orderedCategories: ProductCategoryInfo[]): Promise<void> {
  const updated = orderedCategories.map((cat, idx) => ({
    ...cat,
    order: idx + 1,
  }));

  try {
    localStorage.setItem('turath_categories_list_v3', JSON.stringify(updated));
    setCategoriesListCache(updated);
  } catch {
    // Ignore localStorage error
  }

  if (shouldSkipFirestoreWrite()) {
    return;
  }

  try {
    const promises = updated.map((cat) => {
      const docRef = doc(db, CATEGORIES_COLLECTION, cat.id);
      return setDoc(docRef, { order: cat.order, updatedAt: new Date().toISOString() }, { merge: true });
    });
    await Promise.all(promises);
  } catch (err) {
    console.warn('[Firestore] Error saving categories order to cloud:', err);
  }
}

// -----------------------------------------------------------------------------
// PROJECTS CLOUD SYNCHRONIZATION (SUPABASE & FIRESTORE)
// -----------------------------------------------------------------------------

export function subscribeToCloudProjects(onProjectsChange: (projects: ProjectItem[]) => void): Unsubscribe {
  // 1. Initial hydration from local cache
  const initialDeleted = getDeletedProjectIds();
  const localProjects = getStoredProjects().filter((p) => !initialDeleted.has(p.id));
  onProjectsChange(localProjects);

  const syncFromSupabase = async () => {
    if (!isSupabaseConfigured()) return;
    try {
      const supProjects = await fetchSupabaseProjects();
      if (Array.isArray(supProjects) && supProjects.length > 0) {
        const liveDeleted = getDeletedProjectIds();
        const currentProjects = getStoredProjects();
        const mergedMap = new Map<string, ProjectItem>();

        currentProjects.forEach((p) => {
          if (!liveDeleted.has(p.id)) mergedMap.set(p.id, p);
        });

        for (const sp of supProjects) {
          if (!liveDeleted.has(sp.id)) {
            const existing = mergedMap.get(sp.id);
            const resolved: ProjectItem = existing
              ? {
                  ...sp,
                  videoUrl: sp.videoUrl || existing.videoUrl,
                  gallery: (Array.isArray(sp.gallery) && sp.gallery.length > 0) ? sp.gallery : existing.gallery,
                  coverImage: sp.coverImage || existing.coverImage,
                }
              : sp;

            if (!resolved.videoUrl) {
              try {
                const localVid = await getLocalProjectVideo(resolved.id);
                if (localVid) resolved.videoUrl = localVid;
              } catch {}
            }

            mergedMap.set(sp.id, resolved);
          }
        }

        const finalProjects = Array.from(mergedMap.values()).sort(
          (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
        );
        saveStoredProjects(finalProjects);
        onProjectsChange(finalProjects);
      }
    } catch (err) {
      console.warn('[Supabase Database] Projects fetch notice:', err);
    }
  };

  // 2. Hydrate from server-side API (works across all browsers, independent of Firebase quota)
  if (typeof window !== 'undefined') {
    fetch('/api/projects')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && Array.isArray(data.projects) && data.projects.length > 0) {
          const liveDeleted = getDeletedProjectIds();
          const valid = data.projects.filter((p: ProjectItem) => !liveDeleted.has(p.id));
          if (valid.length > 0) {
            saveStoredProjects(valid);
            onProjectsChange(valid);
          }
        }
      })
      .catch(() => {});
  }

  // Cross-browser sync of deleted projects metadata from Firestore
  try {
    const metaDocRef = doc(db, SETTINGS_COLLECTION, 'projects_metadata');
    onSnapshot(metaDocRef, (metaSnap) => {
      if (metaSnap.exists()) {
        const metaData = metaSnap.data();
        if (Array.isArray(metaData?.deletedProjectIds)) {
          metaData.deletedProjectIds.forEach((id: string) => markProjectDeleted(id));
          const refreshed = getStoredProjects();
          onProjectsChange(refreshed);
        }
      }
    }, () => {});
  } catch {
    // Ignore
  }

  // 3. Hydrate from IndexedDB for high-fidelity offline/persistent cache
  loadProjectsFromIndexedDB().then(async (idbProjects) => {
    if (Array.isArray(idbProjects) && idbProjects.length > 0) {
      const liveDeleted = getDeletedProjectIds();
      const filtered = idbProjects.filter((p) => !liveDeleted.has(p.id));
      if (filtered.length > 0) {
        const withVideos = await Promise.all(
          filtered.map(async (p) => {
            if (!p.videoUrl || p.videoUrl === '__IDB_VIDEO__') {
              try {
                const vid = await getLocalProjectVideo(p.id);
                if (vid) return { ...p, videoUrl: vid };
              } catch {}
            }
            return p;
          })
        );
        saveStoredProjects(withVideos);
        onProjectsChange(withVideos);
      }
    }
  }).catch(() => {});

  // 4. Initial sync from Supabase
  syncFromSupabase();

  // 5. Real-time Supabase subscription across browsers
  let supabaseChannel: any = null;
  if (supabase && isSupabaseConfigured()) {
    try {
      supabaseChannel = supabase
        .channel('turath-projects-sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'site_content' }, (payload: any) => {
          if (payload?.new && (payload.new.id === 'projects_catalog' || payload.new.id === 'deleted_projects_registry')) {
            syncFromSupabase();
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
          syncFromSupabase();
        })
        .subscribe();
    } catch {}
  }

  // 6. Window focus listener for instant multi-tab & multi-browser update
  const handleFocus = () => {
    syncFromSupabase();
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('focus', handleFocus);
  }

  // 7. Firestore real-time listener (if available/quota allows)
  let firestoreUnsub: Unsubscribe = () => {};
  try {
    const colRef = collection(db, PROJECTS_COLLECTION);
    firestoreUnsub = onSnapshot(colRef, async (snap) => {
      const currentDeleted = getDeletedProjectIds();

      snap.docChanges().forEach((change) => {
        if (change.type === 'removed') {
          markProjectDeleted(change.doc.id);
          deleteProject(change.doc.id);
        }
      });

      if (snap.empty) return;
      const loadedMap = new Map<string, ProjectItem>();
      
      snap.docs.forEach((d) => {
        const data = d.data();
        if (data && data.id && !currentDeleted.has(data.id)) {
          const normalized = normalizeProject(data as Partial<ProjectItem>);
          loadedMap.set(normalized.id, normalized);
        }
      });

      if (loadedMap.size > 0) {
        const current = getStoredProjects();
        const mergedMap = new Map<string, ProjectItem>();
        current.forEach((p) => {
          if (!currentDeleted.has(p.id)) mergedMap.set(p.id, p);
        });

        for (const [id, p] of loadedMap.entries()) {
          if (!currentDeleted.has(id)) {
            const existing = mergedMap.get(id);
            const resolved: ProjectItem = existing
              ? {
                  ...p,
                  videoUrl: (p.videoUrl && p.videoUrl !== FIRESTORE_CHUNK_INDICATOR) ? p.videoUrl : existing.videoUrl,
                  gallery: (Array.isArray(p.gallery) && p.gallery.length > 0) ? p.gallery : existing.gallery,
                  coverImage: p.coverImage || existing.coverImage,
                }
              : p;

            if (!resolved.videoUrl || resolved.videoUrl === FIRESTORE_CHUNK_INDICATOR) {
              try {
                const localVid = await getLocalProjectVideo(id);
                if (localVid) {
                  resolved.videoUrl = localVid;
                } else if (p.hasVideoChunks || p.videoUrl === FIRESTORE_CHUNK_INDICATOR) {
                  loadCloudProjectVideoChunks(id).then((assembled) => {
                    if (assembled) {
                      const currentAll = getStoredProjects();
                      const updatedAll = currentAll.map((item) => item.id === id ? { ...item, videoUrl: assembled } : item);
                      saveStoredProjects(updatedAll);
                      onProjectsChange(updatedAll);
                    }
                  });
                }
              } catch {}
            }

            mergedMap.set(id, resolved);
          }
        }

        const finalProjects = Array.from(mergedMap.values()).sort(
          (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
        );
        saveStoredProjects(finalProjects);
        onProjectsChange(finalProjects);
      }
    }, (error) => {
      if (isResourceExhaustedError(error)) {
        markQuotaExhausted();
        console.warn('[Firestore] Quota reached for projects. Using Supabase & local storage.');
      } else {
        console.warn('Notice from cloud projects listener:', error);
      }
    });
  } catch {}

  return () => {
    firestoreUnsub();
    if (supabaseChannel && supabase) {
      try {
        supabase.removeChannel(supabaseChannel);
      } catch {}
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('focus', handleFocus);
    }
  };
}

export async function saveCloudProject(project: ProjectItem): Promise<ProjectItem> {
  let finalProject: ProjectItem = {
    ...project,
    updatedAt: new Date().toISOString(),
  };

  // 1. If video is raw Base64/blob, immediately save to local IndexedDB
  if (finalProject.videoUrl && (finalProject.videoUrl.startsWith('data:video/') || finalProject.videoUrl.startsWith('blob:'))) {
    try {
      await saveLocalProjectVideo(finalProject.id, finalProject.videoUrl);
    } catch (vidLocalErr) {
      console.warn('[MediaStorage] Could not cache project video to IndexedDB:', vidLocalErr);
    }
  }

  // 2. Always persist locally and in IndexedDB first
  saveProject(finalProject);

  // 3. Upload media to Supabase Storage if configured
  if (isSupabaseConfigured()) {
    try {
      // Cover image with fallback bucket support
      if (finalProject.coverImage && (finalProject.coverImage.startsWith('data:') || finalProject.coverImage.startsWith('blob:'))) {
        try {
          const uploadedCover = await uploadToSupabaseStorage(
            'site-media',
            `projects/${finalProject.id}/cover_${Date.now()}`,
            finalProject.coverImage
          );
          finalProject.coverImage = uploadedCover;
        } catch (coverErr) {
          // Fallback to product-images bucket
          try {
            const uploadedFallback = await uploadToSupabaseStorage(
              'product-images',
              `projects/${finalProject.id}/cover_${Date.now()}`,
              finalProject.coverImage
            );
            finalProject.coverImage = uploadedFallback;
          } catch (fbErr) {
            console.warn('[Supabase Storage] Notice: Could not upload project cover to storage, preserving locally:', fbErr);
          }
        }
      }

      // Gallery images with fallback bucket support
      if (Array.isArray(finalProject.gallery) && finalProject.gallery.length > 0) {
        const uploadedGallery: string[] = [];
        for (let i = 0; i < finalProject.gallery.length; i++) {
          const img = finalProject.gallery[i];
          if (img && (img.startsWith('data:') || img.startsWith('blob:'))) {
            try {
              const url = await uploadToSupabaseStorage(
                'site-media',
                `projects/${finalProject.id}/gallery_${i}_${Date.now()}`,
                img
              );
              uploadedGallery.push(url);
            } catch (gErr) {
              try {
                const fbUrl = await uploadToSupabaseStorage(
                  'product-images',
                  `projects/${finalProject.id}/gallery_${i}_${Date.now()}`,
                  img
                );
                uploadedGallery.push(fbUrl);
              } catch {
                uploadedGallery.push(img);
              }
            }
          } else if (img) {
            uploadedGallery.push(img);
          }
        }
        finalProject.gallery = uploadedGallery;
      }

      // Video upload to Supabase Storage
      if (finalProject.videoUrl && (finalProject.videoUrl.startsWith('data:') || finalProject.videoUrl.startsWith('blob:'))) {
        try {
          const uploadedVideo = await uploadToSupabaseStorage(
            'product-videos',
            `projects/${finalProject.id}/video_${Date.now()}`,
            finalProject.videoUrl
          );
          finalProject.videoUrl = uploadedVideo;
        } catch (vidErr) {
          console.warn('[Supabase Storage] Notice: Could not upload project video to storage, keeping local:', vidErr);
        }
      }

      // Prepare safe object for Supabase Database row (avoid PostgREST 413 if video is still Base64)
      const rowProject: ProjectItem = {
        ...finalProject,
        videoUrl: (finalProject.videoUrl && (finalProject.videoUrl.startsWith('data:') || finalProject.videoUrl.startsWith('blob:')))
          ? undefined
          : finalProject.videoUrl,
      };

      // Save to Supabase table
      await saveSupabaseProject(rowProject);

      // Re-persist updated URLs locally
      saveProject(finalProject);
    } catch (supErr) {
      console.warn('[Supabase] Failed to save project to Supabase database:', supErr);
    }
  }

  // 4. Firestore update with size protection
  if (!shouldSkipFirestoreWrite()) {
    try {
      const docRef = doc(db, PROJECTS_COLLECTION, finalProject.id);
      
      // If video is base64 and not yet on CDN, chunk it into Firestore
      const firestorePayload: any = { ...finalProject };
      if (finalProject.videoUrl && (finalProject.videoUrl.startsWith('data:video/') || finalProject.videoUrl.startsWith('blob:'))) {
        try {
          const chunkCount = await saveCloudProjectVideoChunks(finalProject.id, finalProject.videoUrl);
          if (chunkCount > 0) {
            firestorePayload.videoUrl = FIRESTORE_CHUNK_INDICATOR;
            firestorePayload.hasVideoChunks = true;
          } else {
            delete firestorePayload.videoUrl;
          }
        } catch (chunkErr) {
          console.warn('[Firestore] Error chunking project video:', chunkErr);
          delete firestorePayload.videoUrl;
        }
      }

      const sanitized = sanitizeForFirestore({
        ...firestorePayload,
        updatedAt: new Date().toISOString(),
      });
      await setDoc(docRef, sanitized, { merge: true });
    } catch (err) {
      if (isResourceExhaustedError(err)) {
        markWriteQuotaExhausted();
      } else {
        console.warn('[Firestore] Error saving project to Firestore:', err);
      }
    }
  }

  // 5. Always sync to server API for universal cross-browser persistence
  if (typeof window !== 'undefined') {
    fetch('/api/admin/sync-project', {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(finalProject),
    }).catch(() => {});
  }

  return finalProject;
}

export async function deleteCloudProject(projectId: string): Promise<void> {
  // 1. Delete locally and mark permanently deleted immediately
  markProjectDeleted(projectId);
  deleteProject(projectId);
  deleteLocalProjectVideo(projectId).catch(() => {});
  deleteCloudProjectVideoChunks(projectId).catch(() => {});

  // 2. Sync deletion to server API
  if (typeof window !== 'undefined') {
    fetch(`/api/admin/sync-project?id=${encodeURIComponent(projectId)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ id: projectId }),
    }).catch(() => {});

    // Also send to express route format /:id
    fetch(`/api/admin/sync-project/${encodeURIComponent(projectId)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    }).catch(() => {});
  }

  // 3. Track deleted ID in cloud metadata so other browsers & devices sync the deletion in real time
  if (!shouldSkipFirestoreWrite()) {
    try {
      const metaDocRef = doc(db, SETTINGS_COLLECTION, 'projects_metadata');
      const currentDeleted = Array.from(getDeletedProjectIds());
      await setDoc(metaDocRef, { deletedProjectIds: currentDeleted, updatedAt: new Date().toISOString() }, { merge: true });
    } catch {
      // Ignore metadata sync error
    }
  }

  // 4. Delete from Supabase
  if (isSupabaseConfigured()) {
    try {
      await deleteSupabaseProject(projectId);
    } catch (supErr) {
      console.warn('[Supabase] Failed to delete project from Supabase:', supErr);
    }
  }

  // 5. Delete document from Firestore
  if (!shouldSkipFirestoreWrite()) {
    try {
      const docRef = doc(db, PROJECTS_COLLECTION, projectId);
      await deleteDoc(docRef);
    } catch (err) {
      if (isResourceExhaustedError(err)) {
        markWriteQuotaExhausted();
      } else {
        console.warn('[Firestore] Error deleting project document:', err);
      }
    }
  }
}

export async function saveCloudProjectsOrder(orderedProjects: ProjectItem[]): Promise<void> {
  if (!isAdminLoggedIn()) return;

  saveProjectsOrder(orderedProjects);

  // Sync order to server API
  if (typeof window !== 'undefined') {
    fetch('/api/admin/save-projects-order', {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ orderedProjects }),
    }).catch(() => {});
  }

  if (isSupabaseConfigured()) {
    try {
      await saveSupabaseProjectsOrder(orderedProjects);
    } catch (supErr) {
      console.warn('[Supabase] Error saving projects order:', supErr);
    }
  }
}

// -----------------------------------------------------------------------------
// CLIENTS & PARTNERS REAL-TIME CLOUD & STORAGE SYNC
// -----------------------------------------------------------------------------

export function subscribeToCloudClientsPartners(onChange: (items: ClientPartnerItem[]) => void): Unsubscribe {
  // 1. Initial hydration from local cache
  const initialDeleted = getDeletedClientsPartnersIds();
  const localItems = getStoredClientsPartners().filter((item) => !initialDeleted.has(item.id));
  onChange(localItems);

  const syncFromSupabase = async () => {
    if (!isSupabaseConfigured()) return;
    try {
      const supItems = await fetchSupabaseClientsPartners();
      if (Array.isArray(supItems)) {
        const liveDeleted = getDeletedClientsPartnersIds();
        const valid = supItems.filter((item) => !liveDeleted.has(item.id));
        saveStoredClientsPartners(valid);
        onChange(valid);
      }
    } catch (err) {
      console.warn('[Supabase Database] Clients/partners sync notice:', err);
    }
  };

  // 2. Initial fetch from Supabase
  syncFromSupabase();

  // 3. Real-time Supabase subscription
  let supabaseChannel: any = null;
  if (supabase && isSupabaseConfigured()) {
    try {
      supabaseChannel = supabase
        .channel('turath-clients-partners-sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'site_content' }, (payload: any) => {
          if (payload?.new && (payload.new.id === 'clients_partners_catalog' || payload.new.id === 'deleted_clients_partners_registry')) {
            syncFromSupabase();
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'clients_partners' }, () => {
          syncFromSupabase();
        })
        .subscribe();
    } catch {}
  }

  // 4. Focus listener for cross-tab sync
  const handleFocus = () => {
    syncFromSupabase();
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('focus', handleFocus);
  }

  return () => {
    if (supabaseChannel && supabase) {
      try {
        supabase.removeChannel(supabaseChannel);
      } catch {}
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('focus', handleFocus);
    }
  };
}

export async function saveCloudClientPartner(item: ClientPartnerItem): Promise<ClientPartnerItem> {
  const finalItem: ClientPartnerItem = {
    ...item,
    updatedAt: new Date().toISOString(),
  };

  // 1. Upload logo to Supabase Storage if it's base64 or blob
  if (isSupabaseConfigured() && finalItem.logo && (finalItem.logo.startsWith('data:') || finalItem.logo.startsWith('blob:'))) {
    try {
      const publicUrl = await uploadToSupabaseStorage(
        'site-media',
        `clients-partners/${finalItem.id}_${Date.now()}`,
        finalItem.logo
      );
      finalItem.logo = publicUrl;
    } catch (err) {
      console.warn('[Supabase Storage] Notice: Could not upload client/partner logo:', err);
    }
  }

  // 2. Persist locally
  saveClientPartner(finalItem);

  // 3. Persist to Supabase
  if (isSupabaseConfigured()) {
    try {
      await saveSupabaseClientPartner(finalItem);
    } catch (err) {
      console.warn('[Supabase Database] Error saving client/partner:', err);
    }
  }

  return finalItem;
}

export async function deleteCloudClientPartner(id: string): Promise<void> {
  // 1. Delete locally
  markClientPartnerDeleted(id);
  deleteClientPartner(id);

  // 2. Delete from Supabase
  if (isSupabaseConfigured()) {
    try {
      await deleteSupabaseClientPartner(id);
    } catch (err) {
      console.warn('[Supabase Database] Error deleting client/partner:', err);
    }
  }
}

export async function saveCloudClientsPartnersOrder(items: ClientPartnerItem[]): Promise<void> {
  saveClientsPartnersOrder(items);
  if (isSupabaseConfigured()) {
    try {
      await saveSupabaseClientsPartnersOrder(items);
    } catch (err) {
      console.warn('[Supabase Database] Error saving clients/partners order:', err);
    }
  }
}



