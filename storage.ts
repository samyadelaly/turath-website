import { ProductItem } from './types';
import { INITIAL_PRODUCTS } from './initialCatalog';

const STORAGE_KEY = 'turath_products_catalog_v2';
const LEGACY_STORAGE_KEY = 'turath_products_catalog_v1';
const IDB_NAME = 'turath_master_db';
const IDB_STORE = 'products_store';
const IDB_VERSION = 1;

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

// Normalize product fields ensuring backward compatibility and independence
export function normalizeProduct(raw: Partial<ProductItem>, fallback?: ProductItem): ProductItem {
  const id = raw.id || fallback?.id || `TR-PROD-${Date.now()}`;
  const name = raw.nameEN || raw.name || fallback?.nameEN || fallback?.name || 'Untitled Turath Product';
  const nameEN = raw.nameEN || name;
  const nameAR = raw.nameAR || fallback?.nameAR || '';
  const categoryId = raw.categoryId || fallback?.categoryId || 'brass-mirrors';
  const tagline = raw.shortDescEN || raw.tagline || fallback?.shortDescEN || fallback?.tagline || '';
  const shortDescEN = raw.shortDescEN || tagline;
  const shortDescAR = raw.shortDescAR || fallback?.shortDescAR || '';
  const description = raw.fullDescriptionEN || raw.description || fallback?.fullDescriptionEN || fallback?.description || '';
  const fullDescriptionEN = raw.fullDescriptionEN || description;
  const fullDescriptionAR = raw.fullDescriptionAR || fallback?.fullDescriptionAR || '';

  // Images guarantee: independent array, mainImage is images[0]
  const rawImages = Array.isArray(raw.images) && raw.images.length > 0 
    ? [...raw.images]
    : Array.isArray(fallback?.images) && fallback!.images.length > 0
    ? [...fallback!.images]
    : [raw.mainImage || fallback?.mainImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80'];
  
  const mainImage = raw.mainImage || rawImages[0] || (fallback?.mainImage ?? rawImages[0]);
  if (!rawImages.includes(mainImage)) {
    rawImages.unshift(mainImage);
  }

  const finishOptions = Array.isArray(raw.finishOptions) && raw.finishOptions.length > 0
    ? [...raw.finishOptions]
    : fallback?.finishOptions ? [...fallback.finishOptions] : ['Antique Brass', 'Polished Gold Brass'];

  const seoSlug = raw.seoSlug || fallback?.seoSlug || (nameEN.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) || id;

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
    galleryImages: raw.galleryImages ? [...raw.galleryImages] : rawImages.slice(1),
    imageAltEN: raw.imageAltEN || fallback?.imageAltEN || nameEN,
    imageAltAR: raw.imageAltAR || fallback?.imageAltAR || nameAR,
    imageCaption: raw.imageCaption || fallback?.imageCaption || '',
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
    videoUrl: raw.videoUrl || fallback?.videoUrl || '',
    productVideo: raw.productVideo || fallback?.productVideo || '',
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
      return INITIAL_PRODUCTS.map((p) => normalizeProduct(p));
    }

    const saved = window.localStorage.getItem(STORAGE_KEY) || window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge with initial catalog to ensure all fields are normalized and enriched
        return parsed.map((item: Partial<ProductItem>) => {
          const defaultProduct = INITIAL_PRODUCTS.find((p) => p.id === item.id || p.sku === item.id);
          return normalizeProduct(item, defaultProduct);
        });
      }
    }
  } catch (err) {
    console.warn('Could not read stored products from localStorage, using initial catalog:', err);
  }

  return INITIAL_PRODUCTS.map((p) => normalizeProduct(p));
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
            const normalized = res.map((item) => {
              const defaultProd = INITIAL_PRODUCTS.find((p) => p.id === item.id || p.sku === item.id);
              return normalizeProduct(item, defaultProd);
            });
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
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
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

  const normalized = INITIAL_PRODUCTS.map((p) => normalizeProduct(p));
  saveStoredProducts(normalized);
  return normalized;
}
