import { 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  collection, 
  onSnapshot, 
  writeBatch,
  getDocs,
  Unsubscribe 
} from 'firebase/firestore';
import { db } from './firebase';
import { ProductItem, ProductCategoryInfo } from './types';
import { INITIAL_PRODUCTS, PRODUCT_CATEGORIES } from './initialCatalog';
import { DEFAULT_LOGO_URL } from './logoStorage';
import { SiteContent, DEFAULT_SITE_CONTENT } from './siteContentStorage';
import { 
  setCategoryCoversCache, 
  setCategoriesListCache, 
  saveCategoryCover, 
  CategoryCoverOptions,
  getDeletedCategoryIds,
  markCategoryDeleted
} from './categoryStorage';
import { normalizeProduct, saveStoredProducts, isDemoVideoUrl } from './storage';
import { recompressBase64Image } from './imageCompressor';
import { isAdminLoggedIn } from './adminAuth';
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
  getLocalProductVideo,
} from './mediaStorage';

const SETTINGS_DOC = 'general';
const SETTINGS_COLLECTION = 'site_settings';
const CONTENT_COLLECTION = 'site_content';
const CONTENT_DOC = 'current_content';
const COVERS_COLLECTION = 'category_covers';
const CATEGORIES_COLLECTION = 'categories';
const PRODUCTS_COLLECTION = 'products';


// --- LOGO CLOUD SYNC ---

export function subscribeToCloudLogo(onLogoChange: (logoUrl: string) => void): Unsubscribe {
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
    console.warn('Error subscribing to cloud logo:', error);
  });
}

export async function saveCloudLogo(logoUrl: string): Promise<void> {
  if (!isAdminLoggedIn()) {
    throw new Error('Unauthorized: Admin session required to modify logo');
  }
  try {
    let safeLogo = logoUrl;
    if (typeof safeLogo === 'string' && safeLogo.startsWith('data:image/') && safeLogo.length > 160000) {
      safeLogo = await recompressBase64Image(safeLogo, 150000);
    }
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC);
    await setDoc(docRef, sanitizeForFirestore({
      logoUrl: safeLogo,
      updatedAt: new Date().toISOString(),
    }), { merge: true });

    try {
      localStorage.setItem('turath_custom_logo_v1', safeLogo);
    } catch {
      // Ignore localStorage error
    }
    window.dispatchEvent(new Event('turath-logo-updated'));
  } catch (err) {
    console.error('Failed to save logo to cloud database:', err);
    throw err;
  }
}

export async function resetCloudLogo(): Promise<void> {
  if (!isAdminLoggedIn()) {
    throw new Error('Unauthorized: Admin session required to reset logo');
  }
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC);
    await setDoc(docRef, {
      logoUrl: DEFAULT_LOGO_URL,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    try {
      localStorage.removeItem('turath_custom_logo_v1');
    } catch {
      // Ignore localStorage error
    }
    window.dispatchEvent(new Event('turath-logo-updated'));
  } catch (err) {
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
    console.warn('Error subscribing to cloud category covers:', error);
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
  try {
    let safeCoverUrl = (coverImageUrl || '').trim();
    if (safeCoverUrl.startsWith('data:image/') && safeCoverUrl.length > 160000) {
      safeCoverUrl = await recompressBase64Image(safeCoverUrl, 150000);
    }

    const safeOptions: any = options ? { ...options } : {};
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

    // Video Handling: Protect against exceeding Firestore 1MB (1,048,576 bytes) document limit!
    const rawVideoUrl = typeof safeOptions.coverVideoUrl === 'string' ? safeOptions.coverVideoUrl.trim() : '';
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
      if (rawVideoUrl.startsWith('data:video/')) {
        await saveLocalCategoryVideo(categoryId, rawVideoUrl);
      }
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

    // Save locally (restoring full raw video URL for in-memory and IndexedDB cache)
    const localOptions = { ...safeOptions, coverVideoUrl: rawVideoUrl || safeOptions.coverVideoUrl };
    saveCategoryCover(categoryId, safeCoverUrl, localOptions);
  } catch (err) {
    console.error('Failed to save category cover to cloud:', err);
    throw err;
  }
}

export async function resetCloudCategoryCover(categoryId: string): Promise<void> {
  if (!isAdminLoggedIn()) {
    throw new Error('Unauthorized: Admin session required to reset category cover');
  }
  try {
    await deleteCloudCategoryVideoChunks(categoryId);
    const docRef = doc(db, COVERS_COLLECTION, categoryId);
    await deleteDoc(docRef);
  } catch (err) {
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
  const colRef = collection(db, PRODUCTS_COLLECTION);

  return onSnapshot(colRef, async (snapshot) => {
    // If cloud database is empty, seed initial products to cloud
    if (snapshot.empty && !isSeeding) {
      isSeeding = true;
      try {
        await seedInitialProducts();
      } catch (err) {
        console.warn('Could not seed initial products to cloud:', err);
      } finally {
        isSeeding = false;
      }
      return;
    }

    // Load set of deleted product IDs to prevent resurrection of deleted initial products
    let deletedIds = new Set<string>();
    try {
      const storedDeleted = localStorage.getItem('turath_deleted_product_ids_v1');
      if (storedDeleted) {
        const parsed = JSON.parse(storedDeleted);
        if (Array.isArray(parsed)) {
          deletedIds = new Set(parsed);
        }
      }
    } catch {
      // Ignore localStorage error
    }

    const loadedCloudMap = new Map<string, ProductItem>();
    const chunkedProductIds: string[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data && data.id && !deletedIds.has(data.id)) {
        if (data.videoUrl === FIRESTORE_CHUNK_INDICATOR) {
          chunkedProductIds.push(data.id);
          // Try local cache first for instant UI response
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
        } else if (!data.videoUrl) {
          // Restore local device video if cloud document stripped base64 video to stay under 1MB
          try {
            const localVideo = localStorage.getItem(`turath_video_${data.id}`);
            if (localVideo && !isDemoVideoUrl(localVideo)) {
              data.videoUrl = localVideo;
            }
          } catch {
            // Ignore localStorage error
          }
        }
        const defaultProduct = INITIAL_PRODUCTS.find((p) => p.id === data.id);
        const normalized = normalizeProduct(data as Partial<ProductItem>, defaultProduct);
        loadedCloudMap.set(normalized.id, normalized);
      }
    });

    // Merge strategy:
    // 1. Start with full baseline catalog of INITIAL_PRODUCTS (excluding any user-deleted items)
    // 2. Overlay any updated or custom products from the Cloud Database
    const mergedMap = new Map<string, ProductItem>();
    for (const initProd of INITIAL_PRODUCTS) {
      if (!deletedIds.has(initProd.id)) {
        mergedMap.set(initProd.id, initProd);
      }
    }
    for (const [id, cloudProd] of loadedCloudMap.entries()) {
      if (!deletedIds.has(id)) {
        mergedMap.set(id, cloudProd);
      }
    }

    const completeCatalog = Array.from(mergedMap.values()).filter(
      (p) => p.categoryId !== 'wall-art' && p.id !== 'turath-wallart-01'
    );

    if (completeCatalog.length > 0) {
      saveStoredProducts(completeCatalog);
      onProductsChange(completeCatalog);
    }

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
    console.warn('Error subscribing to cloud products:', error);
  });
}

export async function seedInitialProducts(): Promise<void> {
  // Batch write initial products in chunks of 20 to respect Firestore limits safely
  const chunkSize = 20;
  for (let i = 0; i < INITIAL_PRODUCTS.length; i += chunkSize) {
    const chunk = INITIAL_PRODUCTS.slice(i, i + chunkSize);
    const batch = writeBatch(db);
    for (const prod of chunk) {
      const docRef = doc(db, PRODUCTS_COLLECTION, prod.id);
      const sanitized = sanitizeForFirestore({
        ...prod,
        updatedAt: new Date().toISOString(),
      });
      batch.set(docRef, sanitized, { merge: true });
    }
    await batch.commit();
  }
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
        console.warn('Could not store video chunks to cloud for product:', product.id, videoErr);
      }
    } else if (!product.videoUrl) {
      // If user cleared or removed the video, clean up any previous video chunks
      deleteCloudProductVideoChunks(product.id).catch(() => {});
    }

    // Save product document to Firestore with merge to guarantee document integrity across browsers
    await setDoc(docRef, prepared, { merge: true });
    console.log(`[CloudDatabase] Successfully saved product ${product.id} to Firestore.`);
  } catch (err) {
    console.error('Failed to save product to cloud Firestore:', err);
    throw err;
  }
}

export async function deleteCloudProduct(productId: string): Promise<void> {
  if (!isAdminLoggedIn()) {
    throw new Error('Unauthorized: Admin session required to delete product');
  }
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(docRef);

    // Delete any associated video chunks in Firestore
    deleteCloudProductVideoChunks(productId).catch(() => {});

    // Track in deleted list so initial products aren't re-added
    try {
      const deletedKey = 'turath_deleted_product_ids_v1';
      const existing = localStorage.getItem(deletedKey);
      const list: string[] = existing ? JSON.parse(existing) : [];
      if (!list.includes(productId)) {
        list.push(productId);
        localStorage.setItem(deletedKey, JSON.stringify(list));
      }
      // Also update site_settings catalog_metadata doc
      const metaDocRef = doc(db, SETTINGS_COLLECTION, 'catalog_metadata');
      await setDoc(metaDocRef, sanitizeForFirestore({ deletedProductIds: list, updatedAt: new Date().toISOString() }), { merge: true });
    } catch {
      // Ignore localStorage error
    }
  } catch (err) {
    console.error('Failed to delete product from cloud:', err);
    throw err;
  }
}

export async function resetCloudProducts(): Promise<void> {
  if (!isAdminLoggedIn()) {
    throw new Error('Unauthorized: Admin session required to reset products');
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

    // Re-seed initial products
    await seedInitialProducts();
  } catch (err) {
    console.error('Failed to reset cloud products:', err);
    throw err;
  }
}

// --- SITE CONTENT (HEADLINES & TEXTS) CLOUD SYNC ---

const SITE_CONTENT_STORAGE_KEY = 'turath_site_content_v2';

export function subscribeToCloudSiteContent(
  onContentChange: (content: SiteContent) => void
): Unsubscribe {
  const docRef = doc(db, CONTENT_COLLECTION, CONTENT_DOC);

  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data && typeof data === 'object') {
          const merged: SiteContent = {
            ...DEFAULT_SITE_CONTENT,
            ...(data as Partial<SiteContent>),
          };
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
      console.warn('Error subscribing to cloud site content:', error);
    }
  );
}

export async function saveCloudSiteContent(content: SiteContent): Promise<void> {
  if (!isAdminLoggedIn()) {
    throw new Error('Unauthorized: Admin session required to save site content');
  }
  try {
    const clone = { ...content };
    if (typeof clone.aboutImage === 'string' && clone.aboutImage.startsWith('data:image/') && clone.aboutImage.length > 160000) {
      clone.aboutImage = await recompressBase64Image(clone.aboutImage, 150000);
    }
    if (typeof clone.founderImage === 'string' && clone.founderImage.startsWith('data:image/') && clone.founderImage.length > 160000) {
      clone.founderImage = await recompressBase64Image(clone.founderImage, 150000);
    }
    if (clone.about && typeof clone.about.image === 'string' && clone.about.image.startsWith('data:image/') && clone.about.image.length > 160000) {
      clone.about.image = await recompressBase64Image(clone.about.image, 150000);
    }

    const sanitized = sanitizeForFirestore({
      ...clone,
      updatedAt: new Date().toISOString(),
    });

    const docRef = doc(db, CONTENT_COLLECTION, CONTENT_DOC);
    await setDoc(docRef, sanitized, { merge: true });

    try {
      localStorage.setItem(SITE_CONTENT_STORAGE_KEY, JSON.stringify(clone));
    } catch {
      // Ignore localStorage error
    }
    window.dispatchEvent(new CustomEvent('turath-site-content-updated', { detail: clone }));
  } catch (err) {
    console.error('Failed to save site content to cloud:', err);
    throw err;
  }
}

export async function resetCloudSiteContent(): Promise<void> {
  if (!isAdminLoggedIn()) {
    throw new Error('Unauthorized: Admin session required to reset site content');
  }
  try {
    const docRef = doc(db, CONTENT_COLLECTION, CONTENT_DOC);
    await setDoc(docRef, sanitizeForFirestore({
      ...DEFAULT_SITE_CONTENT,
      updatedAt: new Date().toISOString(),
    }));

    try {
      localStorage.removeItem(SITE_CONTENT_STORAGE_KEY);
    } catch {
      // Ignore localStorage error
    }
    window.dispatchEvent(new CustomEvent('turath-site-content-updated', { detail: DEFAULT_SITE_CONTENT }));
  } catch (err) {
    console.error('Failed to reset cloud site content:', err);
    throw err;
  }
}

// --- DYNAMIC CATEGORIES CLOUD SYNC ---

export function subscribeToCloudCategories(
  onCategoriesChange: (categories: ProductCategoryInfo[]) => void
): Unsubscribe {
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
            });
          }
        });

        const deletedIds = getDeletedCategoryIds();
        const filteredList = list.filter((c) => c.id !== 'wall-art' && !deletedIds.has(c.id));

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
      console.warn('Error subscribing to cloud categories:', error);
    }
  );
}

export async function saveCloudCategory(category: ProductCategoryInfo): Promise<void> {
  if (!isAdminLoggedIn()) {
    throw new Error('Unauthorized: Admin session required to save category');
  }
  try {
    const clone = { ...category };
    if (typeof clone.coverImage === 'string' && clone.coverImage.startsWith('data:image/') && clone.coverImage.length > 160000) {
      clone.coverImage = await recompressBase64Image(clone.coverImage, 150000);
    }

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
  } catch (err) {
    console.error('Failed to save category to cloud:', err);
    throw err;
  }
}

export async function deleteCloudCategory(categoryId: string): Promise<void> {
  if (!isAdminLoggedIn()) {
    throw new Error('Unauthorized: Admin session required to delete category');
  }
  markCategoryDeleted(categoryId);
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
  } catch (err) {
    console.error('Failed to delete category from cloud:', err);
    throw err;
  }
}

