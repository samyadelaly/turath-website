import { ProductCategoryInfo } from './types';
import { PRODUCT_CATEGORIES } from './initialCatalog';
import { saveLocalCategoryVideo, getLocalCategoryVideo } from './mediaStorage';
import { isDemoVideoUrl } from './storage';

const COVERS_STORAGE_KEY = 'turath_category_covers_v1';
const OPTIONS_STORAGE_KEY = 'turath_category_options_v1';
const CATEGORIES_LIST_STORAGE_KEY = 'turath_categories_list_v3';
const DELETED_CATEGORIES_STORAGE_KEY = 'turath_deleted_categories_v1';

// In-memory runtime cache ensuring immediate updates even across storage errors
let memoryCoversCache: Record<string, string> | null = null;
let memoryOptionsCache: Record<string, CategoryCoverOptions> | null = null;
let memoryCategoriesCache: ProductCategoryInfo[] | null = null;

export function getDeletedCategoryIds(): Set<string> {
  const set = new Set<string>();
  try {
    if (isStorageAvailable()) {
      const saved = window.localStorage.getItem(DELETED_CATEGORIES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          parsed.forEach((id: string) => set.add(id));
        }
      }
    }
  } catch {
    // Ignore
  }
  return set;
}

export function markCategoryDeleted(categoryId: string): void {
  try {
    if (isStorageAvailable()) {
      const set = getDeletedCategoryIds();
      set.add(categoryId);
      window.localStorage.setItem(DELETED_CATEGORIES_STORAGE_KEY, JSON.stringify(Array.from(set)));
    }
  } catch {
    // Ignore
  }
}

export function unmarkCategoryDeleted(categoryId: string): void {
  try {
    if (isStorageAvailable()) {
      const set = getDeletedCategoryIds();
      if (set.has(categoryId)) {
        set.delete(categoryId);
        window.localStorage.setItem(DELETED_CATEGORIES_STORAGE_KEY, JSON.stringify(Array.from(set)));
      }
    }
  } catch {
    // Ignore
  }
}

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

export function setCategoryCoversCache(
  covers: Record<string, string>,
  optionsMap?: Record<string, CategoryCoverOptions>
): void {
  memoryCoversCache = { ...covers };
  if (optionsMap) {
    memoryOptionsCache = { ...(memoryOptionsCache || {}), ...optionsMap };
  }
  if (memoryCategoriesCache) {
    memoryCategoriesCache = memoryCategoriesCache.map((cat) => {
      const custom = covers[cat.id];
      const opts = optionsMap ? optionsMap[cat.id] : undefined;
      return {
        ...cat,
        ...(custom ? { coverImage: custom.trim() } : {}),
        ...(opts?.coverMediaType !== undefined ? { coverMediaType: opts.coverMediaType } : {}),
        ...(opts?.coverVideoUrl !== undefined ? { coverVideoUrl: opts.coverVideoUrl } : {}),
        ...(opts?.coverImageRatio !== undefined ? { coverImageRatio: opts.coverImageRatio } : {}),
        ...(opts?.customRatioWidth !== undefined ? { customRatioWidth: opts.customRatioWidth } : {}),
        ...(opts?.customRatioHeight !== undefined ? { customRatioHeight: opts.customRatioHeight } : {}),
        ...(opts?.coverImageFit !== undefined ? { coverImageFit: opts.coverImageFit } : {}),
        ...(opts?.coverImagePosition !== undefined ? { coverImagePosition: opts.coverImagePosition } : {}),
        ...(opts?.coverVideoRatio !== undefined ? { coverVideoRatio: opts.coverVideoRatio } : {}),
        ...(opts?.coverVideoFit !== undefined ? { coverVideoFit: opts.coverVideoFit } : {}),
        ...(opts?.coverVideoPosition !== undefined ? { coverVideoPosition: opts.coverVideoPosition } : {}),
        ...(opts?.galleryImages !== undefined ? { galleryImages: opts.galleryImages } : {}),
        ...(opts?.galleryRatios !== undefined ? { galleryRatios: opts.galleryRatios } : {}),
        ...(opts?.galleryFits !== undefined ? { galleryFits: opts.galleryFits } : {}),
        ...(opts?.galleryPositions !== undefined ? { galleryPositions: opts.galleryPositions } : {}),
      };
    });
  }
}

export function getStoredCategoryOptions(): Record<string, CategoryCoverOptions> {
  if (memoryOptionsCache !== null) {
    return { ...memoryOptionsCache };
  }
  try {
    if (isStorageAvailable()) {
      const saved = window.localStorage.getItem(OPTIONS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          memoryOptionsCache = parsed;

          // Asynchronously hydrate any videos stored in IndexedDB and purge demo videos
          Object.keys(parsed).forEach((catId) => {
            const opt = parsed[catId];
            if (opt) {
              if (isDemoVideoUrl(opt.coverVideoUrl)) {
                opt.coverVideoUrl = '';
                opt.coverMediaType = 'image';
              }
              if (opt.coverVideoUrl === '__LOCAL_IDB__' || opt.coverVideoUrl === '__CHUNKED__') {
                getLocalCategoryVideo(catId).then((vid) => {
                  if (vid && isDemoVideoUrl(vid)) {
                    vid = '';
                  }
                  if (vid && memoryOptionsCache && memoryOptionsCache[catId]) {
                    memoryOptionsCache[catId].coverVideoUrl = vid;
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(
                        new CustomEvent('turath-categories-updated', { detail: { categoryId: catId } })
                      );
                    }
                  }
                }).catch(() => {});
              }
            }
          });

          return { ...memoryOptionsCache };
        }
      }
    }
  } catch (err) {
    console.warn('Could not read category options from localStorage:', err);
  }
  memoryOptionsCache = {};
  return {};
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
  const deletedIds = getDeletedCategoryIds();

  try {
    if (isStorageAvailable()) {
      const saved = window.localStorage.getItem(CATEGORIES_LIST_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // If the stored list still uses the old categories (like 'brass-mirrors'), ignore and use new PRODUCT_CATEGORIES
          const hasLegacy = parsed.some((c: ProductCategoryInfo) => c.id === 'brass-mirrors' || c.id === 'chandeliers');
          if (!hasLegacy) {
            baseList = parsed;
          }
        }
      }
    }
  } catch (err) {
    console.warn('Could not read categories list from localStorage:', err);
  }

  // Ensure wall-art and any explicitly deleted categories are excluded across all pages
  baseList = baseList.filter((cat) => cat.id !== 'wall-art' && !deletedIds.has(cat.id));

  const customCovers = getStoredCategoryCovers();
  const customOptions = getStoredCategoryOptions();

  const merged = baseList.map((cat) => {
    const custom = customCovers[cat.id];
    const opts = customOptions[cat.id];
    const rawVideoUrl = opts?.coverVideoUrl !== undefined ? opts.coverVideoUrl : cat.coverVideoUrl;
    const isDemo = isDemoVideoUrl(rawVideoUrl);
    const cleanVideoUrl = isDemo ? '' : rawVideoUrl;
    const cleanMediaType = isDemo ? 'image' : (opts?.coverMediaType !== undefined ? opts.coverMediaType : cat.coverMediaType);

    return {
      ...cat,
      ...(custom ? { coverImage: custom.trim() } : {}),
      ...(cleanMediaType !== undefined ? { coverMediaType: cleanMediaType } : {}),
      ...(cleanVideoUrl !== undefined ? { coverVideoUrl: cleanVideoUrl } : {}),
      ...(opts?.coverImageRatio !== undefined ? { coverImageRatio: opts.coverImageRatio } : {}),
      ...(opts?.customRatioWidth !== undefined ? { customRatioWidth: opts.customRatioWidth } : {}),
      ...(opts?.customRatioHeight !== undefined ? { customRatioHeight: opts.customRatioHeight } : {}),
      ...(opts?.coverImageFit !== undefined ? { coverImageFit: opts.coverImageFit } : {}),
      ...(opts?.coverImagePosition !== undefined ? { coverImagePosition: opts.coverImagePosition } : {}),
      ...(opts?.coverVideoRatio !== undefined ? { coverVideoRatio: opts.coverVideoRatio } : {}),
      ...(opts?.coverVideoFit !== undefined ? { coverVideoFit: opts.coverVideoFit } : {}),
      ...(opts?.coverVideoPosition !== undefined ? { coverVideoPosition: opts.coverVideoPosition } : {}),
      ...(opts?.galleryImages !== undefined ? { galleryImages: opts.galleryImages } : {}),
      ...(opts?.galleryRatios !== undefined ? { galleryRatios: opts.galleryRatios } : {}),
      ...(opts?.galleryFits !== undefined ? { galleryFits: opts.galleryFits } : {}),
      ...(opts?.galleryPositions !== undefined ? { galleryPositions: opts.galleryPositions } : {}),
    };
  });

  memoryCategoriesCache = merged;
  return merged;
}

export function saveCategory(category: ProductCategoryInfo): ProductCategoryInfo[] {
  unmarkCategoryDeleted(category.id);
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

  if (category.coverImage || category.coverVideoUrl) {
    saveCategoryCover(category.id, category.coverImage, {
      coverMediaType: category.coverMediaType,
      coverVideoUrl: category.coverVideoUrl,
      hasVideoChunks: category.hasVideoChunks,
      videoChunksCount: category.videoChunksCount,
      coverImageRatio: category.coverImageRatio,
      customRatioWidth: category.customRatioWidth,
      customRatioHeight: category.customRatioHeight,
      coverImageFit: category.coverImageFit,
      coverImagePosition: category.coverImagePosition,
      coverVideoRatio: category.coverVideoRatio,
      coverVideoFit: category.coverVideoFit,
      coverVideoPosition: category.coverVideoPosition,
      coverVideoMuted: category.coverVideoMuted,
      galleryImages: category.galleryImages,
      galleryRatios: category.galleryRatios,
      galleryFits: category.galleryFits,
      galleryPositions: category.galleryPositions,
    });
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
  markCategoryDeleted(categoryId);
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

export interface CategoryCoverOptions {
  coverMediaType?: 'image' | 'video';
  coverVideoUrl?: string;
  hasVideoChunks?: boolean;
  videoChunksCount?: number;
  coverImageRatio?: string;
  customRatioWidth?: number | string;
  customRatioHeight?: number | string;
  coverImageFit?: 'cover' | 'contain';
  coverImagePosition?: string;
  coverVideoRatio?: string;
  coverVideoFit?: 'cover' | 'contain';
  coverVideoPosition?: string;
  coverVideoMuted?: boolean;
  galleryImages?: string[];
  galleryRatios?: Record<string, string>;
  galleryFits?: Record<string, 'cover' | 'contain'>;
  galleryPositions?: Record<string, string>;
}

export function saveCategoryCover(
  categoryId: string, 
  coverImageUrl: string,
  options?: CategoryCoverOptions
): ProductCategoryInfo[] {
  const cleaned = (coverImageUrl || '').trim();

  // If video is a data URL, save to IndexedDB asynchronously
  if (options?.coverVideoUrl && options.coverVideoUrl.startsWith('data:video/')) {
    saveLocalCategoryVideo(categoryId, options.coverVideoUrl).catch((err) => {
      console.warn('Could not save category video to IndexedDB:', err);
    });
  }

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

  // 2. Persist to localStorage safely without quota crash
  try {
    if (isStorageAvailable()) {
      window.localStorage.setItem(COVERS_STORAGE_KEY, JSON.stringify(memoryCoversCache));
      if (options) {
        if (!memoryOptionsCache) memoryOptionsCache = {};
        memoryOptionsCache[categoryId] = options;

        // Strip huge video data URLs from localStorage copy (retained in IDB & memory)
        const safeOptionsToStore: Record<string, any> = {};
        for (const [catKey, optVal] of Object.entries(memoryOptionsCache)) {
          if (!optVal) continue;
          const clonedOpt = { ...optVal };
          if (typeof clonedOpt.coverVideoUrl === 'string' && clonedOpt.coverVideoUrl.length > 50000) {
            clonedOpt.coverVideoUrl = '__LOCAL_IDB__';
          }
          safeOptionsToStore[catKey] = clonedOpt;
        }
        window.localStorage.setItem(OPTIONS_STORAGE_KEY, JSON.stringify(safeOptionsToStore));
      }
    }
  } catch (err) {
    console.warn('Could not save category cover to localStorage:', err);
  }

  // Also update category list cache and persisted list if it exists
  const currentCategories = getStoredCategories();
  const updatedCategories = currentCategories.map((c) => {
    if (c.id === categoryId) {
      return {
        ...c,
        coverImage: cleaned || c.coverImage,
        coverMediaType: options?.coverMediaType !== undefined ? options.coverMediaType : (c.coverMediaType || 'image'),
        coverVideoUrl: options?.coverVideoUrl !== undefined ? options.coverVideoUrl : c.coverVideoUrl,
        hasVideoChunks: options?.hasVideoChunks !== undefined ? options.hasVideoChunks : c.hasVideoChunks,
        videoChunksCount: options?.videoChunksCount !== undefined ? options.videoChunksCount : c.videoChunksCount,
        coverImageRatio: options?.coverImageRatio !== undefined ? options.coverImageRatio : (c.coverImageRatio || '16:7'),
        customRatioWidth: options?.customRatioWidth !== undefined ? options.customRatioWidth : c.customRatioWidth,
        customRatioHeight: options?.customRatioHeight !== undefined ? options.customRatioHeight : c.customRatioHeight,
        coverImageFit: options?.coverImageFit !== undefined ? options.coverImageFit : (c.coverImageFit || 'cover'),
        coverImagePosition: options?.coverImagePosition !== undefined ? options.coverImagePosition : (c.coverImagePosition || 'center'),
        coverVideoRatio: options?.coverVideoRatio !== undefined ? options.coverVideoRatio : (c.coverVideoRatio || '16:7'),
        coverVideoFit: options?.coverVideoFit !== undefined ? options.coverVideoFit : (c.coverVideoFit || 'cover'),
        coverVideoPosition: options?.coverVideoPosition !== undefined ? options.coverVideoPosition : (c.coverVideoPosition || 'center'),
        coverVideoMuted: options?.coverVideoMuted !== undefined ? options.coverVideoMuted : (c.coverVideoMuted || false),
        galleryImages: options?.galleryImages !== undefined ? options.galleryImages : c.galleryImages,
        galleryRatios: options?.galleryRatios !== undefined ? options.galleryRatios : c.galleryRatios,
        galleryFits: options?.galleryFits !== undefined ? options.galleryFits : c.galleryFits,
        galleryPositions: options?.galleryPositions !== undefined ? options.galleryPositions : c.galleryPositions,
      };
    }
    return c;
  });

  memoryCategoriesCache = updatedCategories;
  try {
    if (isStorageAvailable()) {
      const sanitizedCategoriesList = updatedCategories.map((cat) => {
        if (typeof cat.coverVideoUrl === 'string' && cat.coverVideoUrl.length > 50000) {
          return { ...cat, coverVideoUrl: '__LOCAL_IDB__' };
        }
        return cat;
      });
      window.localStorage.setItem(CATEGORIES_LIST_STORAGE_KEY, JSON.stringify(sanitizedCategoriesList));
    }
  } catch (err) {
    console.warn('Could not save updated categories to localStorage:', err);
  }

  // 3. Dispatch window event for live listeners
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('turath-categories-updated', {
        detail: { categoryId, coverImageUrl: cleaned, options },
      })
    );
  }

  return updatedCategories;
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
