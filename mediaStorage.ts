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
const IDB_VIDEO_STORE = 'category_videos';
const IDB_VERSION = 1;

// 600,000 chars is ~585 KB, safely below Firestore 1,048,576 bytes (1 MiB) limit
export const FIRESTORE_VIDEO_CHUNK_SIZE = 600000;
export const FIRESTORE_CHUNK_INDICATOR = '__CHUNKED__';

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
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(IDB_VIDEO_STORE)) {
          db.createObjectStore(IDB_VIDEO_STORE, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function saveLocalCategoryVideo(categoryId: string, videoDataUrl: string): Promise<void> {
  if (!categoryId || !videoDataUrl) return;
  const db = await openMediaDatabase();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_VIDEO_STORE, 'readwrite');
      const store = tx.objectStore(IDB_VIDEO_STORE);
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
  const db = await openMediaDatabase();
  if (!db) return null;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_VIDEO_STORE, 'readonly');
      const store = tx.objectStore(IDB_VIDEO_STORE);
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
  const db = await openMediaDatabase();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_VIDEO_STORE, 'readwrite');
      const store = tx.objectStore(IDB_VIDEO_STORE);
      store.delete(categoryId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

// --- FIRESTORE VIDEO CHUNKING ---

/**
 * Saves a large base64 video string across multiple subcollection documents
 * so that no single document exceeds Firestore's 1MB limit.
 */
export async function saveCloudCategoryVideoChunks(
  categoryId: string, 
  videoDataUrl: string
): Promise<number> {
  if (!categoryId || !videoDataUrl) return 0;

  // Always cache locally in IndexedDB first
  await saveLocalCategoryVideo(categoryId, videoDataUrl);

  const totalLength = videoDataUrl.length;
  const totalChunks = Math.ceil(totalLength / FIRESTORE_VIDEO_CHUNK_SIZE);
  const chunksCollection = collection(db, 'category_covers', categoryId, 'video_chunks');

  // Write all chunks in parallel / sequence
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
    console.warn('Could not clean old video chunks:', err);
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
