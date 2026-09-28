import { ProjectItem } from './types';
import { INITIAL_PROJECTS } from './initialProjects';
import { saveLocalProjectVideo, getLocalProjectVideo, deleteLocalProjectVideo } from './mediaStorage';

const PROJECTS_STORAGE_KEY = 'turath_projects_catalog_v1';
const DELETED_PROJECTS_KEY = 'turath_deleted_projects_v1';
const PROJECTS_INDEXED_DB_NAME = 'turath_projects_db';
const PROJECTS_STORE_NAME = 'projects';

// High-speed In-Memory Cache to prevent flash of empty data and quota wipeouts
let inMemoryProjectsCache: ProjectItem[] | null = null;

export function getDeletedProjectIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(DELETED_PROJECTS_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

export function markProjectDeleted(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const deleted = getDeletedProjectIds();
    deleted.add(id);
    localStorage.setItem(DELETED_PROJECTS_KEY, JSON.stringify(Array.from(deleted)));
  } catch {}
}

export function normalizeProject(data: Partial<ProjectItem>, fallback?: ProjectItem): ProjectItem {
  const id = data.id || fallback?.id || `proj-${Date.now()}`;
  const title = data.title || fallback?.title || 'Untitled TURATH Project';
  const slug = data.slug || fallback?.slug || id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  return {
    id,
    title,
    titleAR: data.titleAR || fallback?.titleAR,
    slug,
    location: data.location || fallback?.location || 'Cairo, Egypt',
    projectType: data.projectType || fallback?.projectType || 'Custom Project',
    year: data.year !== undefined ? data.year : fallback?.year || new Date().getFullYear().toString(),
    shortDescription: data.shortDescription || fallback?.shortDescription || '',
    description: data.description || fallback?.description || '',
    craftStory: data.craftStory || fallback?.craftStory,
    materials: data.materials || fallback?.materials || 'Solid Egyptian Yellow Brass',
    finish: data.finish || fallback?.finish || 'Antique Hand-Burnished Brass',
    workDelivered: Array.isArray(data.workDelivered)
      ? data.workDelivered
      : fallback?.workDelivered || [],
    customManufacturing: data.customManufacturing || fallback?.customManufacturing,

    // Cover Media
    coverImage: data.coverImage || fallback?.coverImage || '',
    mediaType: data.mediaType || fallback?.mediaType || 'image',
    coverRatio: data.coverRatio || fallback?.coverRatio || 'Original',
    coverCustomRatioWidth: data.coverCustomRatioWidth !== undefined ? data.coverCustomRatioWidth : fallback?.coverCustomRatioWidth || 16,
    coverCustomRatioHeight: data.coverCustomRatioHeight !== undefined ? data.coverCustomRatioHeight : fallback?.coverCustomRatioHeight || 9,
    coverFit: data.coverFit || fallback?.coverFit || 'cover',
    coverPosition: data.coverPosition || fallback?.coverPosition || 'center',

    // Gallery
    gallery: Array.isArray(data.gallery) ? data.gallery : fallback?.gallery || [],
    galleryRatios: data.galleryRatios || fallback?.galleryRatios || {},
    galleryFits: data.galleryFits || fallback?.galleryFits || {},
    galleryPositions: data.galleryPositions || fallback?.galleryPositions || {},

    // Video
    videoUrl: data.videoUrl || fallback?.videoUrl,
    videoRatio: data.videoRatio || fallback?.videoRatio || '16:9',
    videoCustomRatioWidth: data.videoCustomRatioWidth !== undefined ? data.videoCustomRatioWidth : fallback?.videoCustomRatioWidth || 16,
    videoCustomRatioHeight: data.videoCustomRatioHeight !== undefined ? data.videoCustomRatioHeight : fallback?.videoCustomRatioHeight || 9,
    videoFit: data.videoFit || fallback?.videoFit || 'cover',
    videoPosition: data.videoPosition || fallback?.videoPosition || 'center',
    videoPoster: data.videoPoster || fallback?.videoPoster,

    // Related Products
    relatedProductIds: Array.isArray(data.relatedProductIds) ? data.relatedProductIds : fallback?.relatedProductIds || [],

    // Publication & Ordering
    published: data.published !== undefined ? Boolean(data.published) : fallback?.published !== undefined ? Boolean(fallback.published) : true,
    sortOrder: data.sortOrder !== undefined ? Number(data.sortOrder) : fallback?.sortOrder || 0,

    // SEO
    seoTitle: data.seoTitle || fallback?.seoTitle || `${title} | TURATH Architectural Projects`,
    metaDescription: data.metaDescription || fallback?.metaDescription || data.shortDescription || '',

    createdAt: data.createdAt || fallback?.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
  };
}

export function setProjectsCache(projects: ProjectItem[]): void {
  inMemoryProjectsCache = projects;
}

export function getStoredProjects(): ProjectItem[] {
  if (inMemoryProjectsCache && inMemoryProjectsCache.length > 0) {
    const deleted = getDeletedProjectIds();
    return inMemoryProjectsCache.filter((p) => !deleted.has(p.id));
  }

  if (typeof window === 'undefined') return INITIAL_PROJECTS;
  const deleted = getDeletedProjectIds();

  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const storedMap = new Map<string, ProjectItem>();
        parsed.forEach((item: any) => {
          if (item && item.id && !deleted.has(item.id)) {
            const fallback = INITIAL_PROJECTS.find((p) => p.id === item.id);
            storedMap.set(item.id, normalizeProject(item, fallback));
          }
        });

        // Merge initial projects that are not deleted and not in storage
        INITIAL_PROJECTS.forEach((init) => {
          if (!deleted.has(init.id) && !storedMap.has(init.id)) {
            storedMap.set(init.id, init);
          }
        });

        const list = Array.from(storedMap.values()).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        inMemoryProjectsCache = list;
        return list;
      }
    }
  } catch (err) {
    console.warn('[ProjectStorage] Error loading projects from localStorage:', err);
  }

  const fallbackList = INITIAL_PROJECTS.filter((p) => !deleted.has(p.id));
  inMemoryProjectsCache = fallbackList;
  return fallbackList;
}

/**
 * Creates a quota-safe clone for localStorage by omitting raw multi-megabyte video base64
 * (Full pristine data is always stored in IndexedDB and in-memory cache)
 */
function createSafeLocalStorageProjects(projects: ProjectItem[]): any[] {
  return projects.map((p) => {
    const clone = { ...p };
    if (clone.videoUrl && clone.videoUrl.startsWith('data:video/')) {
      clone.videoUrl = '__IDB_VIDEO__';
    }
    return clone;
  });
}

export function saveStoredProjects(projects: ProjectItem[]): void {
  if (typeof window === 'undefined') return;

  // 1. Update in-memory cache immediately
  inMemoryProjectsCache = [...projects];

  // 2. Persist full pristine copy (with full images & videos) to IndexedDB
  saveProjectsToIndexedDB(projects).catch(() => {});

  // 3. Save safe copy to localStorage
  try {
    const safePayload = createSafeLocalStorageProjects(projects);
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(safePayload));
  } catch (err) {
    console.warn('[ProjectStorage] localStorage quota reached. Preserving in IndexedDB & Memory:', err);
  }
}

export function saveProject(project: ProjectItem): ProjectItem[] {
  // If video is base64, also save into dedicated IDB video store
  if (project.videoUrl && project.videoUrl.startsWith('data:video/')) {
    saveLocalProjectVideo(project.id, project.videoUrl).catch(() => {});
  }

  const current = getStoredProjects();
  const normalized = normalizeProject(project);
  const exists = current.some((p) => p.id === normalized.id);
  const updated = exists
    ? current.map((p) => (p.id === normalized.id ? normalized : p))
    : [normalized, ...current];

  saveStoredProjects(updated);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('turath-projects-updated', { detail: { projects: updated } }));
  }
  return updated;
}

export function deleteProject(projectId: string): ProjectItem[] {
  markProjectDeleted(projectId);
  deleteLocalProjectVideo(projectId).catch(() => {});
  deleteProjectFromIndexedDB(projectId).catch(() => {});

  const current = getStoredProjects();
  const updated = current.filter((p) => p.id !== projectId);
  saveStoredProjects(updated);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('turath-projects-updated', { detail: { projects: updated } }));
  }
  return updated;
}

export function saveProjectsOrder(ordered: ProjectItem[]): ProjectItem[] {
  const reindexed = ordered.map((p, index) => ({
    ...p,
    sortOrder: index + 1,
    updatedAt: new Date().toISOString(),
  }));
  saveStoredProjects(reindexed);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('turath-projects-updated', { detail: { projects: reindexed } }));
  }
  return reindexed;
}

// -----------------------------------------------------------------------------
// INDEXEDDB BACKUP FOR PROJECTS
// -----------------------------------------------------------------------------

function openProjectsDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(PROJECTS_INDEXED_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(PROJECTS_STORE_NAME)) {
        db.createObjectStore(PROJECTS_STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function saveProjectsToIndexedDB(projects: ProjectItem[]): Promise<void> {
  return new Promise((resolve) => {
    openProjectsDB()
      .then((db) => {
        try {
          const tx = db.transaction(PROJECTS_STORE_NAME, 'readwrite');
          const store = tx.objectStore(PROJECTS_STORE_NAME);
          store.clear();
          for (const proj of projects) {
            store.put(proj);
          }
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        } catch {
          resolve();
        }
      })
      .catch(() => resolve());
  });
}

export async function deleteProjectFromIndexedDB(projectId: string): Promise<void> {
  try {
    const db = await openProjectsDB();
    const tx = db.transaction(PROJECTS_STORE_NAME, 'readwrite');
    tx.objectStore(PROJECTS_STORE_NAME).delete(projectId);
  } catch {}
}

export async function loadProjectsFromIndexedDB(): Promise<ProjectItem[] | null> {
  try {
    const db = await openProjectsDB();
    const rawList: ProjectItem[] = await new Promise((resolve) => {
      try {
        const tx = db.transaction(PROJECTS_STORE_NAME, 'readonly');
        const store = tx.objectStore(PROJECTS_STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => {
          if (Array.isArray(req.result) && req.result.length > 0) {
            resolve(req.result);
          } else {
            resolve([]);
          }
        };
        req.onerror = () => resolve([]);
      } catch {
        resolve([]);
      }
    });

    if (!rawList || rawList.length === 0) return null;

    // Hydrate local video for any project stored with __IDB_VIDEO__ or missing videoUrl
    const hydrated = await Promise.all(
      rawList.map(async (proj) => {
        if (!proj.videoUrl || proj.videoUrl === '__IDB_VIDEO__') {
          try {
            const localVid = await getLocalProjectVideo(proj.id);
            if (localVid) {
              return { ...proj, videoUrl: localVid };
            }
          } catch {}
        }
        return proj;
      })
    );

    inMemoryProjectsCache = hydrated;
    return hydrated;
  } catch {
    return null;
  }
}
