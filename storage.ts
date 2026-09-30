import { ProductItem } from './types';

const STORAGE_KEY = 'turath_products_catalog_v3';
const LEGACY_STORAGE_KEY_V2 = 'turath_products_catalog_v2';
const LEGACY_STORAGE_KEY_V1 = 'turath_products_catalog_v1';
const IDB_NAME = 'turath_master_db';
const IDB_STORE = 'products_store';
const IDB_VERSION = 1;

export const LEGACY_CATEGORY_MAP: Record<string, string> = {
  'brass-mirrors': 'mirrors',
  'chandeliers': 'lighting',
  'wall-lights': 'lighting',
  'lanterns': 'lighting',
  'tables-consoles': 'tables',
  'door-handles': 'handles',
  'decorative-wall-art': 'wall-art',
  'custom-brass-fabrication': 'custom-pieces',
  'interior-accessories': 'decorative-objects',
};

// Open or initialize IndexedDB
function openDatabase(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      const request = window.indexedDB.open(IDB_NAME, IDB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

// Deep clone helper to guarantee isolation
function deepClone<T>(data: T): T {
  try {
    return JSON.parse(JSON.stringify(data));
  } catch {
    return data;
  }
}

function isStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const testKey = '__turath_storage_test__';
    window.localStorage.setItem(testKey, 'test');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

// Identify fake/demo/placeholder images that must never be attached to products
export function isFakeOrDemoImage(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return true;
  const lower = url.toLowerCase().trim();
  if (!lower) return true;
  return (
    lower.includes('images.unsplash.com') ||
    lower.includes('unsplash.com') ||
    lower.includes('pexels.com') ||
    lower.includes('pixabay.com') ||
    lower.includes('placeholder.com') ||
    lower.includes('placehold.co') ||
    lower.includes('via.placeholder.com') ||
    lower.includes('picsum.photos') ||
    lower.includes('dummyimage.com') ||
    lower.includes('example.com') ||
    lower.includes('sample_image') ||
    lower.includes('mock_image') ||
    lower.includes('demo_image') ||
    lower.includes('fake_image')
  );
}

// Identify placeholder demo videos, YouTube, Vimeo, and sample videos across the catalog
export const DEMO_VIDEO_PATTERNS = [
  'assets.mixkit.co',
  'mixkit.co',
  'example.com',
  'youtube.com',
  'youtu.be',
  'youtube-nocookie.com',
  'vimeo.com',
  'player.vimeo.com',
  'sample-videos.com',
  'dailymotion.com',
  'placeholder',
  'demo.mp4',
  'demo_video',
  'demovideo',
];

export function isDemoVideoUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return true;
  const lower = url.toLowerCase().trim();
  if (!lower) return true;
  return DEMO_VIDEO_PATTERNS.some((pattern) => lower.includes(pattern));
}

export const isFakeOrDemoVideo = isDemoVideoUrl;

// Normalize product fields ensuring backward compatibility and independence
export function normalizeProduct(raw: Partial<ProductItem>, fallback?: ProductItem): ProductItem {
  const id = raw.id || fallback?.id || `TR-PROD-${Date.now()}`;
  const name = raw.nameEN || raw.name || fallback?.nameEN || fallback?.name || 'Untitled Turath Product';
  const nameEN = raw.nameEN || name;
  const nameAR = raw.nameAR || fallback?.nameAR || '';
  let rawCategoryId = raw.categoryId || fallback?.categoryId || 'mirrors';
  if (LEGACY_CATEGORY_MAP[rawCategoryId]) {
    rawCategoryId = LEGACY_CATEGORY_MAP[rawCategoryId];
  }
  const categoryId = rawCategoryId;
  const tagline = raw.shortDescEN || raw.tagline || fallback?.shortDescEN || fallback?.tagline || '';
  const shortDescEN = raw.shortDescEN || tagline;
  const shortDescAR = raw.shortDescAR || fallback?.shortDescAR || '';
  const description = raw.fullDescriptionEN || raw.description || fallback?.fullDescriptionEN || fallback?.description || '';
  const fullDescriptionEN = raw.fullDescriptionEN || description;
  const fullDescriptionAR = raw.fullDescriptionAR || fallback?.fullDescriptionAR || '';

  // Images guarantee: strictly real Turath media only, never inject fake/demo/placeholder images
  // Never fallback to hardcoded or demo images if missing/deleted
  const rawImages: string[] = [];
  if (Array.isArray(raw.images)) {
    raw.images.forEach((img) => {
      if (typeof img === 'string' && img.trim().length > 0 && !isFakeOrDemoImage(img) && !rawImages.includes(img.trim())) {
        rawImages.push(img.trim());
      }
    });
  }
  if (raw.mainImage && typeof raw.mainImage === 'string' && raw.mainImage.trim().length > 0 && !isFakeOrDemoImage(raw.mainImage)) {
    const trimmedMain = raw.mainImage.trim();
    if (!rawImages.includes(trimmedMain)) {
      rawImages.unshift(trimmedMain);
    }
  }

  const rawMainClean = (typeof raw.mainImage === 'string' && !isFakeOrDemoImage(raw.mainImage)) ? raw.mainImage.trim() : '';
  const mainImage = rawImages[0] || rawMainClean || '';

  const finishOptions = Array.isArray(raw.finishOptions) && raw.finishOptions.length > 0
    ? [...raw.finishOptions]
    : fallback?.finishOptions ? [...fallback.finishOptions] : ['Antique Brass', 'Polished Gold Brass'];

  const seoSlug = raw.seoSlug || fallback?.seoSlug || (nameEN.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) || id;

  // Video guarantee: strictly real videos only. Never auto-attach YouTube/Vimeo/demo videos.
  // Never fallback to demo video URLs if missing/deleted
  const cleanVideoUrl = (typeof raw.videoUrl === 'string' && raw.videoUrl.trim().length > 0 && !isFakeOrDemoVideo(raw.videoUrl))
    ? raw.videoUrl.trim()
    : undefined;
  const cleanProductVideo = (typeof raw.productVideo === 'string' && raw.productVideo.trim().length > 0 && !isFakeOrDemoVideo(raw.productVideo))
    ? raw.productVideo.trim()
    : undefined;
  const cleanVideoPoster = (typeof raw.videoPoster === 'string' && raw.videoPoster.trim().length > 0 && !isFakeOrDemoImage(raw.videoPoster))
    ? raw.videoPoster.trim()
    : '';

  const resolvedMediaType: 'image' | 'video' = (cleanVideoUrl && raw.mediaType === 'video') ? 'video' : 'image';

  return {
    id,
    sku: raw.sku || fallback?.sku || id,
    categoryId,
    name,
    nameEN,
    nameAR,
    tagline,
    shortDescEN,
    shortDescAR,
    description,
    fullDescriptionEN,
    fullDescriptionAR,
    story: raw.story || fallback?.story || '',
    mainImage,
    images: rawImages,
    galleryImages: Array.isArray(raw.galleryImages)
      ? raw.galleryImages.filter((img) => typeof img === 'string' && img.trim().length > 0 && !isFakeOrDemoImage(img))
      : rawImages.slice(1),
    imageAltEN: raw.imageAltEN || fallback?.imageAltEN || nameEN,
    imageAltAR: raw.imageAltAR || fallback?.imageAltAR || nameAR,
    imageCaption: raw.imageCaption || fallback?.imageCaption || '',
    imageRatio: raw.imageRatio || fallback?.imageRatio || '4:5',
    customRatioWidth: raw.customRatioWidth ?? fallback?.customRatioWidth ?? 5,
    customRatioHeight: raw.customRatioHeight ?? fallback?.customRatioHeight ?? 7,
    imageFit: raw.imageFit || fallback?.imageFit || 'contain',
    imagePosition: raw.imagePosition || fallback?.imagePosition || 'center',
    imageRatios: raw.imageRatios ? { ...raw.imageRatios } : fallback?.imageRatios ? { ...fallback.imageRatios } : {},
    imageFits: raw.imageFits ? { ...raw.imageFits } : fallback?.imageFits ? { ...fallback.imageFits } : {},
    imagePositions: raw.imagePositions ? { ...raw.imagePositions } : fallback?.imagePositions ? { ...fallback.imagePositions } : {},
    mediaType: resolvedMediaType,
    videoRatio: raw.videoRatio || fallback?.videoRatio || '4:5',
    videoCustomRatioWidth: raw.videoCustomRatioWidth ?? fallback?.videoCustomRatioWidth ?? 16,
    videoCustomRatioHeight: raw.videoCustomRatioHeight ?? fallback?.videoCustomRatioHeight ?? 9,
    videoFit: raw.videoFit || fallback?.videoFit || 'contain',
    videoPosition: raw.videoPosition || fallback?.videoPosition || 'center',
    videoPoster: cleanVideoPoster,
    material: raw.material || fallback?.material || raw.materials || fallback?.materials || 'Solid High-Grade Egyptian Brass',
    materials: raw.materials || raw.material || fallback?.materials || 'Solid High-Grade Egyptian Brass',
    materialDetails: raw.materialDetails || fallback?.materialDetails || '',
    finish: raw.finish || fallback?.finish || finishOptions[0] || 'Antique Brass',
    finishOptions,
    finishDetails: raw.finishDetails || fallback?.finishDetails || '',
    craftTechnique: raw.craftTechnique || fallback?.craftTechnique || 'Hand-Chiseled & Hammered Repoussé',
    techniqueDetails: raw.techniqueDetails || fallback?.techniqueDetails || '',
    dimensions: raw.dimensions || fallback?.dimensions || 'Custom sizing available',
    height: raw.height || fallback?.height || '',
    width: raw.width || fallback?.width || '',
    depth: raw.depth || fallback?.depth || '',
    diameter: raw.diameter || fallback?.diameter || '',
    weight: raw.weight || fallback?.weight || '',
    customDimensions: raw.customDimensions || fallback?.customDimensions || 'Custom sizing and tailored dimensions available upon request.',
    customSize: raw.customSize || fallback?.customSize || 'Available on request',
    customDesign: raw.customDesign || fallback?.customDesign || 'Bespoke custom patterns & CAD tailoring supported',
    customFinish: raw.customFinish || fallback?.customFinish || 'Custom patinas & electroplated accents',
    customDetails: raw.customDetails || fallback?.customDetails || '',
    availability: raw.availability || fallback?.availability || 'made_to_order',
    leadTime: raw.leadTime || fallback?.leadTime || '10-14 business days',
    videoUrl: cleanVideoUrl,
    productVideo: cleanProductVideo,
    applications: Array.isArray(raw.applications) ? [...raw.applications] : fallback?.applications ? [...fallback.applications] : ['Villas', 'Palaces', 'Luxury Hotels', 'Interior Projects'],
    price: raw.price || fallback?.price || '',
    priceType: raw.priceType || fallback?.priceType || 'quote',
    featured: raw.featured ?? fallback?.featured ?? false,
    visibility: raw.visibility || fallback?.visibility || 'published',
    seoSlug,
    seoTitle: raw.seoTitle || fallback?.seoTitle || `${nameEN} | TURATH Egypt`,
    metaDescription: raw.metaDescription || fallback?.metaDescription || shortDescEN || description.slice(0, 160),
    seoKeywords: raw.seoKeywords || fallback?.seoKeywords || 'Egyptian brass, handcrafted brass, luxury Cairo metalwork',
    whatsappMessage: raw.whatsappMessage || fallback?.whatsappMessage || '',
    relatedProductIds: Array.isArray(raw.relatedProductIds) ? [...raw.relatedProductIds] : fallback?.relatedProductIds ? [...fallback.relatedProductIds] : [],
    categoryFields: raw.categoryFields ? { ...raw.categoryFields } : fallback?.categoryFields ? { ...fallback.categoryFields } : {},
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}

export function getStoredProducts(): ProductItem[] {
  try {
    if (!isStorageAvailable()) {
      return [];
    }

    const saved = window.localStorage.getItem(STORAGE_KEY) || 
                  window.localStorage.getItem(LEGACY_STORAGE_KEY_V2) || 
                  window.localStorage.getItem(LEGACY_STORAGE_KEY_V1);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
          .map((item: Partial<ProductItem>) => normalizeProduct(item))
          .filter((p) => p.categoryId !== 'wall-art' && p.id !== 'turath-wallart-01');
      }
    }
  } catch (err) {
    console.warn('Could not read stored products from localStorage:', err);
  }

  return [];
}

// Save all products to local storage & IndexedDB
export function saveStoredProducts(products: ProductItem[]): void {
  const cloned = products.map((p) => deepClone(p));

  // 1. Save to IndexedDB (asynchronous, robust, no 5MB quota limitation)
  openDatabase().then((db) => {
    if (!db) return;
    try {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      cloned.forEach((prod) => {
        store.put(prod);
      });
    } catch (idbErr) {
      console.warn('IndexedDB product save error:', idbErr);
    }
  });

  // 2. Save to localStorage for instant synchronous loading
  try {
    if (!isStorageAvailable()) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cloned));
  } catch (err) {
    console.warn('localStorage quota reached; IndexedDB retains complete high-resolution data:', err);
  }
}

// Load products from IndexedDB (fallback / high-res async hydration)
export function loadProductsFromIndexedDB(): Promise<ProductItem[] | null> {
  return new Promise((resolve) => {
    openDatabase().then((db) => {
      if (!db) {
        resolve(null);
        return;
      }
      try {
        const tx = db.transaction(IDB_STORE, 'readonly');
        const store = tx.objectStore(IDB_STORE);
        const req = store.getAll();
        req.onsuccess = () => {
          const res = req.result;
          if (Array.isArray(res) && res.length > 0) {
            const normalized = res
              .map((item) => normalizeProduct(item))
              .filter((p) => p.categoryId !== 'wall-art' && p.id !== 'turath-wallart-01');
            resolve(normalized);
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  });
}

// Save a SINGLE product independently
export function saveSingleStoredProduct(product: ProductItem): ProductItem[] {
  const normalized = normalizeProduct(product);
  const current = getStoredProducts();
  const index = current.findIndex((p) => p.id === normalized.id);

  let updated: ProductItem[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = deepClone(normalized);
  } else {
    updated = [deepClone(normalized), ...current];
  }

  saveStoredProducts(updated);
  return updated;
}

// Delete a single product
export function deleteSingleStoredProduct(productId: string): ProductItem[] {
  const current = getStoredProducts();
  const updated = current.filter((p) => p.id !== productId);
  saveStoredProducts(updated);

  // Also remove from IndexedDB
  openDatabase().then((db) => {
    if (!db) return;
    try {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).delete(productId);
    } catch (err) {
      console.warn('Could not remove product from IndexedDB:', err);
    }
  });

  return updated;
}

export function resetStoredProducts(): ProductItem[] {
  try {
    if (isStorageAvailable()) {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(LEGACY_STORAGE_KEY_V2);
      window.localStorage.removeItem(LEGACY_STORAGE_KEY_V1);
    }
  } catch (err) {
    console.warn('Could not reset products in localStorage:', err);
  }

  openDatabase().then((db) => {
    if (!db) return;
    try {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).clear();
    } catch {}
  });

  saveStoredProducts([]);
  return [];
}
