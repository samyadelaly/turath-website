import { ProductCategoryInfo } from './types';
import { PRODUCT_CATEGORIES } from './initialCatalog';

const COVERS_STORAGE_KEY = 'turath_category_covers_v1';
const CATEGORIES_LIST_STORAGE_KEY = 'turath_categories_list_v2';

// In-memory runtime cache ensuring immediate updates even across storage errors
let memoryCoversCache: Record<string, string> | null = null;
let memoryCategoriesCache: ProductCategoryInfo[] | null = null;

function isStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const testKey = '__turath_covers_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function setCategoryCoversCache(covers: Record<string, string>): void {
  memoryCoversCache = { ...covers };
  if (memoryCategoriesCache) {
    memoryCategoriesCache = memoryCategoriesCache.map((cat) => {
      const custom = covers[cat.id];
      if (typeof custom === 'string' && custom.trim().length > 0) {
        return { ...cat, coverImage: custom.trim() };
      }
      return cat;
    });
  }
}

export function getStoredCategoryCovers(): Record<string, string> {
  if (memoryCoversCache !== null) {
    return { ...memoryCoversCache };
  }

  try {
    if (isStorageAvailable()) {
      const saved = window.localStorage.getItem(COVERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          memoryCoversCache = parsed as Record<string, string>;
          return { ...memoryCoversCache };
        }
      }
    }
  } catch (err) {
    console.warn('Could not read category covers from localStorage:', err);
  }
  memoryCoversCache = {};
  return {};
}

export function setCategoriesListCache(categories: ProductCategoryInfo[]): void {
  memoryCategoriesCache = [...categories];
}

export function getStoredCategories(): ProductCategoryInfo[] {
  let baseList: ProductCategoryInfo[] = [...PRODUCT_CATEGORIES];

  try {
    if (isStorageAvailable()) {
      const saved = window.localStorage.getItem(CATEGORIES_LIST_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          baseList = parsed;
        }
      }
    }
  } catch (err) {
    console.warn('Could not read categories list from localStorage:', err);
  }

  const customCovers = getStoredCategoryCovers();
  const merged = baseList.map((cat) => {
    const custom = customCovers[cat.id];
    if (typeof custom === 'string' && custom.trim().length > 0) {
      return {
        ...cat,
        coverImage: custom.trim(),
      };
    }
    return cat;
  });

  memoryCategoriesCache = merged;
  return merged;
}

export function saveCategory(category: ProductCategoryInfo): ProductCategoryInfo[] {
  const current = getStoredCategories();
  const index = current.findIndex((c) => c.id === category.id);
  let updated: ProductCategoryInfo[];

  if (index >= 0) {
    updated = current.map((c) => (c.id === category.id ? { ...c, ...category } : c));
  } else {
    updated = [...current, category];
  }

  memoryCategoriesCache = updated;

  try {
    if (isStorageAvailable()) {
      window.localStorage.setItem(CATEGORIES_LIST_STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (err) {
    console.warn('Could not save categories list to localStorage:', err);
  }

  if (category.coverImage) {
    saveCategoryCover(category.id, category.coverImage);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('turath-categories-updated', {
        detail: { categories: updated },
      })
    );
  }

  return updated;
}

export function deleteCategory(categoryId: string): ProductCategoryInfo[] {
  const current = getStoredCategories();
  const updated = current.filter((c) => c.id !== categoryId);
  memoryCategoriesCache = updated;

  try {
    if (isStorageAvailable()) {
      window.localStorage.setItem(CATEGORIES_LIST_STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (err) {
    console.warn('Could not delete category from localStorage:', err);
  }

  resetSingleCategoryCover(categoryId);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('turath-categories-updated', {
        detail: { categories: updated },
      })
    );
  }

  return updated;
}

export function saveCategoryCover(categoryId: string, coverImageUrl: string): ProductCategoryInfo[] {
  const cleaned = (coverImageUrl || '').trim();

  // 1. Immediately update in-memory cache
  if (memoryCoversCache === null) {
    getStoredCategoryCovers();
  }
  if (!memoryCoversCache) {
    memoryCoversCache = {};
  }

  if (cleaned.length > 0) {
    memoryCoversCache[categoryId] = cleaned;
  } else {
    delete memoryCoversCache[categoryId];
  }

  // 2. Persist to localStorage
  try {
    if (isStorageAvailable()) {
      window.localStorage.setItem(COVERS_STORAGE_KEY, JSON.stringify(memoryCoversCache));
    }
  } catch (err) {
    console.warn('Could not save category cover to localStorage:', err);
  }

  // Also update category list cache if it exists
  if (memoryCategoriesCache) {
    memoryCategoriesCache = memoryCategoriesCache.map((c) =>
      c.id === categoryId ? { ...c, coverImage: cleaned || c.coverImage } : c
    );
  }

  // 3. Dispatch window event for live listeners
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('turath-categories-updated', {
        detail: { categoryId, coverImageUrl: cleaned },
      })
    );
  }

  return getStoredCategories();
}

export function resetSingleCategoryCover(categoryId: string): ProductCategoryInfo[] {
  if (memoryCoversCache) {
    delete memoryCoversCache[categoryId];
  }

  try {
    if (isStorageAvailable()) {
      const existing = getStoredCategoryCovers();
      delete existing[categoryId];
      memoryCoversCache = existing;
      window.localStorage.setItem(COVERS_STORAGE_KEY, JSON.stringify(existing));
    }
  } catch (err) {
    console.warn('Could not reset single category cover:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('turath-categories-updated', {
        detail: { categoryId },
      })
    );
  }

  return getStoredCategories();
}

export function resetCategoryCovers(): ProductCategoryInfo[] {
  memoryCoversCache = {};
  memoryCategoriesCache = null;
  try {
    if (isStorageAvailable()) {
      window.localStorage.removeItem(COVERS_STORAGE_KEY);
      window.localStorage.removeItem(CATEGORIES_LIST_STORAGE_KEY);
    }
  } catch (err) {
    console.warn('Could not reset category covers in localStorage:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('turath-categories-updated', { detail: {} }));
  }

  return PRODUCT_CATEGORIES;
}
