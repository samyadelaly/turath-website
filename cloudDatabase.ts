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
import { setCategoryCoversCache, setCategoriesListCache } from './categoryStorage';
import { normalizeProduct, saveStoredProducts } from './storage';

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
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC);
    await setDoc(docRef, {
      logoUrl,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    try {
      localStorage.setItem('turath_custom_logo_v1', logoUrl);
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
  onCoversChange: (coversMap: Record<string, string>) => void
): Unsubscribe {
  const colRef = collection(db, COVERS_COLLECTION);

  return onSnapshot(colRef, (snapshot) => {
    const covers: Record<string, string> = {};
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data && typeof data.coverImage === 'string' && data.coverImage.trim().length > 0) {
        covers[docSnap.id] = data.coverImage.trim();
      }
    });

    try {
      localStorage.setItem('turath_category_covers_v1', JSON.stringify(covers));
    } catch {
      // Ignore localStorage error
    }

    setCategoryCoversCache(covers);
    onCoversChange(covers);
    window.dispatchEvent(new CustomEvent('turath-categories-updated', { detail: { covers } }));
  }, (error) => {
    console.warn('Error subscribing to cloud category covers:', error);
  });
}

export async function saveCloudCategoryCover(categoryId: string, coverImageUrl: string): Promise<void> {
  try {
    const docRef = doc(db, COVERS_COLLECTION, categoryId);
    await setDoc(docRef, {
      categoryId,
      coverImage: coverImageUrl,
      updatedAt: new Date().toISOString(),
    });

    try {
      const existing = localStorage.getItem('turath_category_covers_v1');
      const covers = existing ? JSON.parse(existing) : {};
      covers[categoryId] = coverImageUrl;
      localStorage.setItem('turath_category_covers_v1', JSON.stringify(covers));
      setCategoryCoversCache(covers);
    } catch {
      // Ignore localStorage error
    }
  } catch (err) {
    console.error('Failed to save category cover to cloud:', err);
    throw err;
  }
}

export async function resetCloudCategoryCover(categoryId: string): Promise<void> {
  try {
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

    const loadedCloudMap = new Map<string, ProductItem>();
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data && data.id) {
        const defaultProduct = INITIAL_PRODUCTS.find((p) => p.id === data.id);
        const normalized = normalizeProduct(data as Partial<ProductItem>, defaultProduct);
        loadedCloudMap.set(normalized.id, normalized);
      }
    });

    // Merge strategy:
    // 1. Start with full baseline catalog of INITIAL_PRODUCTS
    // 2. Overlay any updated or custom products from the Cloud Database
    const mergedMap = new Map<string, ProductItem>();
    for (const initProd of INITIAL_PRODUCTS) {
      mergedMap.set(initProd.id, initProd);
    }
    for (const [id, cloudProd] of loadedCloudMap.entries()) {
      mergedMap.set(id, cloudProd);
    }

    const completeCatalog = Array.from(mergedMap.values());

    if (completeCatalog.length > 0) {
      saveStoredProducts(completeCatalog);
      onProductsChange(completeCatalog);
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

export async function saveCloudProduct(product: ProductItem): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
    const sanitized = sanitizeForFirestore({
      ...product,
      updatedAt: new Date().toISOString(),
    });
    
    // Save to Firestore with merge to guarantee document integrity across browsers
    await setDoc(docRef, sanitized, { merge: true });
    console.log(`[CloudDatabase] Successfully saved product ${product.id} to Firestore.`);
  } catch (err) {
    console.error('Failed to save product to cloud Firestore:', err);
    throw err;
  }
}

export async function deleteCloudProduct(productId: string): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Failed to delete product from cloud:', err);
    throw err;
  }
}

export async function resetCloudProducts(): Promise<void> {
  try {
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
  try {
    const docRef = doc(db, CONTENT_COLLECTION, CONTENT_DOC);
    await setDoc(
      docRef,
      {
        ...content,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    try {
      localStorage.setItem(SITE_CONTENT_STORAGE_KEY, JSON.stringify(content));
    } catch {
      // Ignore localStorage error
    }
    window.dispatchEvent(new CustomEvent('turath-site-content-updated', { detail: content }));
  } catch (err) {
    console.error('Failed to save site content to cloud:', err);
    throw err;
  }
}

export async function resetCloudSiteContent(): Promise<void> {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, CONTENT_DOC);
    await setDoc(docRef, {
      ...DEFAULT_SITE_CONTENT,
      updatedAt: new Date().toISOString(),
    });

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
              iconName: data.iconName || 'Sparkles',
            });
          }
        });

        if (list.length > 0) {
          try {
            localStorage.setItem('turath_categories_list_v2', JSON.stringify(list));
          } catch {
            // Ignore localStorage error
          }
          setCategoriesListCache(list);
          onCategoriesChange(list);
          window.dispatchEvent(
            new CustomEvent('turath-categories-updated', { detail: { categories: list } })
          );
        }
      }
    },
    (error) => {
      console.warn('Error subscribing to cloud categories:', error);
    }
  );
}

export async function saveCloudCategory(category: ProductCategoryInfo): Promise<void> {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, category.id);
    await setDoc(docRef, {
      ...category,
      updatedAt: new Date().toISOString(),
    });

    try {
      const existing = localStorage.getItem('turath_categories_list_v2');
      const list: ProductCategoryInfo[] = existing ? JSON.parse(existing) : [];
      const idx = list.findIndex(c => c.id === category.id);
      if (idx >= 0) {
        list[idx] = category;
      } else {
        list.push(category);
      }
      localStorage.setItem('turath_categories_list_v2', JSON.stringify(list));
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
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, categoryId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Failed to delete category from cloud:', err);
    throw err;
  }
}

