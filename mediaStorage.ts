import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';

const IDB_MEDIA_DB = 'turath_media_db';
const IDB_CATEGORY_VIDEO_STORE = 'category_videos';
const IDB_PRODUCT_VIDEO_STORE = 'product_videos';
const IDB_VERSION = 2;

// 600,000 chars is ~585 KB, safely below Firestore 1,048,576 bytes (1 MiB) limit
export const FIRESTORE_VIDEO_CHUNK_SIZE = 600000;
export const FIRESTORE_CHUNK_INDICATOR = '__CHUNKED__';

function shouldSkipFirestoreChunking(): boolean {
  try {
    const stored = localStorage.getItem('turath_firestore_write_quota_exhausted_v1');
    if (stored && Date.now() < Number(stored)) {
      return true;
    }
  } catch {}
  return false;
}

// --- INDEXEDDB LOCAL MEDIA CACHE ---

function openMediaDatabase(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      const request = window.indexedDB.open(IDB_MEDIA_DB, IDB_VERSION);
      request.onupgradeneeded = (e) => {
        const idb = (e.target as IDBOpenDBRequest).result;
        if (!idb.objectStoreNames.contains(IDB_CATEGORY_VIDEO_STORE)) {
          idb.createObjectStore(IDB_CATEGORY_VIDEO_STORE, { keyPath: 'id' });
        }
        if (!idb.objectStoreNames.contains(IDB_PRODUCT_VIDEO_STORE)) {
          idb.createObjectStore(IDB_PRODUCT_VIDEO_STORE, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

// ---------------- CATEGORY VIDEOS (LOCAL CACHE) ----------------

export async function saveLocalCategoryVideo(categoryId: string, videoDataUrl: string): Promise<void> {
  if (!categoryId || !videoDataUrl) return;
  const dbInst = await openMediaDatabase();
  if (!dbInst) return;

  return new Promise((resolve) => {
    try {
      const tx = dbInst.transaction(IDB_CATEGORY_VIDEO_STORE, 'readwrite');
      const store = tx.objectStore(IDB_CATEGORY_VIDEO_STORE);
      store.put({ id: categoryId, data: videoDataUrl, updatedAt: Date.now() });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function getLocalCategoryVideo(categoryId: string): Promise<string | null> {
  if (!categoryId) return null;
  const dbInst = await openMediaDatabase();
  if (!dbInst) return null;

  return new Promise((resolve) => {
    try {
      const tx = dbInst.transaction(IDB_CATEGORY_VIDEO_STORE, 'readonly');
      const store = tx.objectStore(IDB_CATEGORY_VIDEO_STORE);
      const req = store.get(categoryId);
      req.onsuccess = () => {
        if (req.result && typeof req.result.data === 'string' && req.result.data.length > 0) {
          resolve(req.result.data);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function deleteLocalCategoryVideo(categoryId: string): Promise<void> {
  if (!categoryId) return;
  const dbInst = await openMediaDatabase();
  if (!dbInst) return;

  return new Promise((resolve) => {
    try {
      const tx = dbInst.transaction(IDB_CATEGORY_VIDEO_STORE, 'readwrite');
      const store = tx.objectStore(IDB_CATEGORY_VIDEO_STORE);
      store.delete(categoryId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

// ---------------- PRODUCT VIDEOS (LOCAL CACHE) ----------------

export async function saveLocalProductVideo(productId: string, videoDataUrl: string): Promise<void> {
  if (!productId || !videoDataUrl) return;
  const dbInst = await openMediaDatabase();
  if (!dbInst) return;

  return new Promise((resolve) => {
    try {
      const tx = dbInst.transaction(IDB_PRODUCT_VIDEO_STORE, 'readwrite');
      const store = tx.objectStore(IDB_PRODUCT_VIDEO_STORE);
      store.put({ id: productId, data: videoDataUrl, updatedAt: Date.now() });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function getLocalProductVideo(productId: string): Promise<string | null> {
  if (!productId) return null;
  const dbInst = await openMediaDatabase();
  if (!dbInst) return null;

  return new Promise((resolve) => {
    try {
      const tx = dbInst.transaction(IDB_PRODUCT_VIDEO_STORE, 'readonly');
      const store = tx.objectStore(IDB_PRODUCT_VIDEO_STORE);
      const req = store.get(productId);
      req.onsuccess = () => {
        if (req.result && typeof req.result.data === 'string' && req.result.data.length > 0) {
          resolve(req.result.data);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function deleteLocalProductVideo(productId: string): Promise<void> {
  if (!productId) return;
  const dbInst = await openMediaDatabase();
  if (!dbInst) return;

  return new Promise((resolve) => {
    try {
      const tx = dbInst.transaction(IDB_PRODUCT_VIDEO_STORE, 'readwrite');
      const store = tx.objectStore(IDB_PRODUCT_VIDEO_STORE);
      store.delete(productId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

// --- FIRESTORE VIDEO CHUNKING (CATEGORIES) ---

/**
 * Saves a large base64 video string across multiple subcollection documents in Firestore
 * under category_covers/{categoryId}/video_chunks
 */
export async function saveCloudCategoryVideoChunks(
  categoryId: string, 
  videoDataUrl: string
): Promise<number> {
  if (!categoryId || !videoDataUrl) return 0;

  // Always cache locally in IndexedDB first for instant responsiveness
  await saveLocalCategoryVideo(categoryId, videoDataUrl);

  if (shouldSkipFirestoreChunking()) {
    console.warn('[MediaStorage] Firestore write quota exhausted. Category video cached locally.');
    return 0;
  }

  const totalLength = videoDataUrl.length;
  const totalChunks = Math.ceil(totalLength / FIRESTORE_VIDEO_CHUNK_SIZE);
  const chunksCollection = collection(db, 'category_covers', categoryId, 'video_chunks');

  try {
    const writePromises: Promise<void>[] = [];
    for (let i = 0; i < totalChunks; i++) {
      const chunkData = videoDataUrl.slice(
        i * FIRESTORE_VIDEO_CHUNK_SIZE, 
        (i + 1) * FIRESTORE_VIDEO_CHUNK_SIZE
      );
      const chunkDocRef = doc(chunksCollection, `chunk_${String(i).padStart(4, '0')}`);
      writePromises.push(
        setDoc(chunkDocRef, {
          index: i,
          data: chunkData,
          totalChunks,
          categoryId,
          updatedAt: new Date().toISOString()
        })
      );
    }
    await Promise.all(writePromises);
  } catch (chunkErr: any) {
    if (
      chunkErr?.code === 'resource-exhausted' ||
      chunkErr?.message?.includes('resource-exhausted') ||
      chunkErr?.message?.includes('Quota limit exceeded')
    ) {
      try {
        localStorage.setItem('turath_firestore_write_quota_exhausted_v1', String(Date.now() + 12 * 60 * 60 * 1000));
      } catch {}
      console.warn('[MediaStorage] Quota exceeded saving category video chunks. Preserved in IndexedDB.');
      return 0;
    }
    console.warn('Could not save category video chunks to cloud:', chunkErr);
    return 0;
  }

  // Clean up any old leftover chunks beyond totalChunks
  try {
    const existingSnap = await getDocs(chunksCollection);
    const deletePromises: Promise<void>[] = [];
    for (const snap of existingSnap.docs) {
      const idx = Number(snap.data().index);
      if (idx >= totalChunks) {
        deletePromises.push(deleteDoc(snap.ref));
      }
    }
    if (deletePromises.length > 0) {
      await Promise.all(deletePromises);
    }
  } catch (err) {
    console.warn('Could not clean old category video chunks:', err);
  }

  return totalChunks;
}

/**
 * Loads chunked video documents from Firestore and reassembles the complete video string.
 */
export async function loadCloudCategoryVideoChunks(categoryId: string): Promise<string | null> {
  if (!categoryId) return null;

  // 1. Try local IndexedDB first for instant access
  const cached = await getLocalCategoryVideo(categoryId);
  if (cached) {
    return cached;
  }

  // 2. Fetch all chunk documents from Firestore
  try {
    const chunksCollection = collection(db, 'category_covers', categoryId, 'video_chunks');
    const q = query(chunksCollection, orderBy('index', 'asc'));
    const snap = await getDocs(q);

    if (snap.empty) {
      return null;
    }

    const docs = snap.docs.map(d => d.data() as { index: number; data: string });
    docs.sort((a, b) => a.index - b.index);

    const assembled = docs.map(d => d.data || '').join('');
    if (assembled.length > 0) {
      // Cache locally in IndexedDB for subsequent visits
      await saveLocalCategoryVideo(categoryId, assembled);
      return assembled;
    }
    return null;
  } catch (err) {
    console.warn('Failed to load video chunks for category:', categoryId, err);
    return null;
  }
}

/**
 * Deletes all video chunks for a category in Firestore and local IndexedDB.
 */
export async function deleteCloudCategoryVideoChunks(categoryId: string): Promise<void> {
  if (!categoryId) return;
  await deleteLocalCategoryVideo(categoryId);

  try {
    const chunksCollection = collection(db, 'category_covers', categoryId, 'video_chunks');
    const snap = await getDocs(chunksCollection);
    const deletePromises = snap.docs.map(d => deleteDoc(d.ref));
    await Promise.all(deletePromises);
  } catch (err) {
    console.warn('Failed to delete video chunks:', categoryId, err);
  }
}

// --- FIRESTORE VIDEO CHUNKING (PRODUCTS) ---

/**
 * Saves a product's base64 video string across multiple subcollection documents in Firestore
 * under products/{productId}/video_chunks
 * so every user and device on the cloud can stream the product video.
 */
export async function saveCloudProductVideoChunks(
  productId: string, 
  videoDataUrl: string
): Promise<number> {
  if (!productId || !videoDataUrl) return 0;

  // Cache locally in IndexedDB first for instant playback
  await saveLocalProductVideo(productId, videoDataUrl);

  if (shouldSkipFirestoreChunking()) {
    console.warn('[MediaStorage] Firestore write quota exhausted. Product video cached locally.');
    return 0;
  }

  const totalLength = videoDataUrl.length;
  const totalChunks = Math.ceil(totalLength / FIRESTORE_VIDEO_CHUNK_SIZE);
  const chunksCollection = collection(db, 'products', productId, 'video_chunks');

  try {
    const writePromises: Promise<void>[] = [];
    for (let i = 0; i < totalChunks; i++) {
      const chunkData = videoDataUrl.slice(
        i * FIRESTORE_VIDEO_CHUNK_SIZE, 
        (i + 1) * FIRESTORE_VIDEO_CHUNK_SIZE
      );
      const chunkDocRef = doc(chunksCollection, `chunk_${String(i).padStart(4, '0')}`);
      writePromises.push(
        setDoc(chunkDocRef, {
          index: i,
          data: chunkData,
          totalChunks,
          productId,
          updatedAt: new Date().toISOString()
        })
      );
    }
    await Promise.all(writePromises);
  } catch (chunkErr: any) {
    if (
      chunkErr?.code === 'resource-exhausted' ||
      chunkErr?.message?.includes('resource-exhausted') ||
      chunkErr?.message?.includes('Quota limit exceeded')
    ) {
      try {
        localStorage.setItem('turath_firestore_write_quota_exhausted_v1', String(Date.now() + 12 * 60 * 60 * 1000));
      } catch {}
      console.warn('[MediaStorage] Quota exceeded saving product video chunks. Preserved in IndexedDB.');
      return 0;
    }
    console.warn('Could not save product video chunks to cloud:', chunkErr);
    return 0;
  }

  // Clean up any old leftover chunks beyond totalChunks
  try {
    const existingSnap = await getDocs(chunksCollection);
    const deletePromises: Promise<void>[] = [];
    for (const snap of existingSnap.docs) {
      const idx = Number(snap.data().index);
      if (idx >= totalChunks) {
        deletePromises.push(deleteDoc(snap.ref));
      }
    }
    if (deletePromises.length > 0) {
      await Promise.all(deletePromises);
    }
  } catch (err) {
    console.warn('Could not clean old product video chunks:', err);
  }

  return totalChunks;
}

/**
 * Loads chunked video documents from Firestore for a product and reassembles the complete video string.
 */
export async function loadCloudProductVideoChunks(productId: string): Promise<string | null> {
  if (!productId) return null;

  // 1. Try local IndexedDB first for instant playback
  const cached = await getLocalProductVideo(productId);
  if (cached) {
    return cached;
  }

  // 2. Fetch all chunk documents from Firestore
  try {
    const chunksCollection = collection(db, 'products', productId, 'video_chunks');
    const q = query(chunksCollection, orderBy('index', 'asc'));
    const snap = await getDocs(q);

    if (snap.empty) {
      return null;
    }

    const docs = snap.docs.map(d => d.data() as { index: number; data: string });
    docs.sort((a, b) => a.index - b.index);

    const assembled = docs.map(d => d.data || '').join('');
    if (assembled.length > 0) {
      // Cache locally in IndexedDB for subsequent visits
      await saveLocalProductVideo(productId, assembled);
      return assembled;
    }
    return null;
  } catch (err) {
    console.warn('Failed to load video chunks for product:', productId, err);
    return null;
  }
}

/**
 * Deletes all video chunks for a product in Firestore and local IndexedDB.
 */
export async function deleteCloudProductVideoChunks(productId: string): Promise<void> {
  if (!productId) return;
  await deleteLocalProductVideo(productId);

  try {
    const chunksCollection = collection(db, 'products', productId, 'video_chunks');
    const snap = await getDocs(chunksCollection);
    const deletePromises = snap.docs.map(d => deleteDoc(d.ref));
    await Promise.all(deletePromises);
  } catch (err) {
    console.warn('Failed to delete product video chunks:', productId, err);
  }
}
