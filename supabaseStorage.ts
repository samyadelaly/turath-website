import { supabase, isSupabaseConfigured, SUPABASE_BUCKETS } from './supabase';

export { SUPABASE_BUCKETS };

/**
 * Converts a base64 Data URL to a Blob safely
 */
export function base64ToBlob(base64DataUrl: string): { blob: Blob; mimeType: string; extension: string } {
  try {
    const parts = base64DataUrl.split(',');
    const match = parts[0]?.match(/:(.*?);/);
    const mimeType = match ? match[1] : 'image/jpeg';
    const byteString = atob(parts[1] || '');
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    let extension = 'jpg';
    if (mimeType.includes('png')) extension = 'png';
    else if (mimeType.includes('webp')) extension = 'webp';
    else if (mimeType.includes('mp4')) extension = 'mp4';
    else if (mimeType.includes('webm')) extension = 'webm';
    else if (mimeType.includes('quicktime') || mimeType.includes('mov')) extension = 'mov';
    else if (mimeType.includes('svg')) extension = 'svg';

    return {
      blob: new Blob([uint8Array], { type: mimeType }),
      mimeType,
      extension,
    };
  } catch (err) {
    console.error('[Supabase Storage] base64ToBlob failed, returning fallback blob:', err);
    return {
      blob: new Blob([], { type: 'application/octet-stream' }),
      mimeType: 'application/octet-stream',
      extension: 'bin',
    };
  }
}

/**
 * Converts a data URL or blob URL to a Blob using browser-native fetch (fast, async, memory-safe)
 */
export async function dataUrlToBlob(urlOrData: string): Promise<{ blob: Blob; mimeType: string; extension: string }> {
  try {
    const res = await fetch(urlOrData);
    const blob = await res.blob();
    const mimeType = blob.type || (urlOrData.includes('video') ? 'video/mp4' : 'image/jpeg');

    let extension = 'jpg';
    if (mimeType.includes('png')) extension = 'png';
    else if (mimeType.includes('webp')) extension = 'webp';
    else if (mimeType.includes('mp4')) extension = 'mp4';
    else if (mimeType.includes('webm')) extension = 'webm';
    else if (mimeType.includes('quicktime') || mimeType.includes('mov')) extension = 'mov';
    else if (mimeType.includes('svg')) extension = 'svg';

    return { blob, mimeType, extension };
  } catch {
    return base64ToBlob(urlOrData);
  }
}

// Cache of verified existing buckets to minimize network checks
const verifiedBuckets = new Set<string>();

/**
 * Attempts to ensure a public bucket exists in Supabase Storage.
 */
export async function ensureSupabaseBucket(bucket: 'product-images' | 'product-videos' | 'site-media'): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;
  if (verifiedBuckets.has(bucket)) return true;

  try {
    const { data: bucketData, error: getErr } = await supabase.storage.getBucket(bucket);
    if (bucketData && !getErr) {
      verifiedBuckets.add(bucket);
      return true;
    }
  } catch {
    // Continue
  }

  try {
    const { error: createErr } = await supabase.storage.createBucket(bucket, {
      public: true,
      fileSizeLimit: bucket === 'product-videos' ? 104857600 : 52428800, // 100MB for video, 50MB for images
    });
    if (!createErr) {
      console.log(`[Supabase Storage] Successfully initialized public bucket "${bucket}".`);
      verifiedBuckets.add(bucket);
      return true;
    }
  } catch (err) {
    console.warn(`[Supabase Storage] Notice: bucket "${bucket}" could not be auto-created:`, err);
  }

  return false;
}

/**
 * Comprehensive Storage Health Check
 */
export async function checkSupabaseStorageStatus(): Promise<{
  isConfigured: boolean;
  hasImagesBucket: boolean;
  hasVideosBucket: boolean;
  hasSiteMediaBucket: boolean;
  isStorageReady: boolean;
  error?: string;
}> {
  if (!supabase || !isSupabaseConfigured()) {
    return {
      isConfigured: false,
      hasImagesBucket: false,
      hasVideosBucket: false,
      hasSiteMediaBucket: false,
      isStorageReady: false,
    };
  }

  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      return {
        isConfigured: true,
        hasImagesBucket: false,
        hasVideosBucket: false,
        hasSiteMediaBucket: false,
        isStorageReady: false,
        error: error.message,
      };
    }

    const bucketIds = new Set((buckets || []).map((b) => b.id));
    const hasImagesBucket = bucketIds.has('product-images');
    const hasVideosBucket = bucketIds.has('product-videos');
    const hasSiteMediaBucket = bucketIds.has('site-media');

    return {
      isConfigured: true,
      hasImagesBucket,
      hasVideosBucket,
      hasSiteMediaBucket,
      isStorageReady: hasImagesBucket && hasVideosBucket && hasSiteMediaBucket,
    };
  } catch (err: any) {
    return {
      isConfigured: true,
      hasImagesBucket: false,
      hasVideosBucket: false,
      hasSiteMediaBucket: false,
      isStorageReady: false,
      error: err?.message || 'Storage check exception',
    };
  }
}

/**
 * Uploads a file (File, Blob, or Base64/Blob Data URL) to Supabase Storage
 * Returns the permanent public CDN HTTPS download URL.
 */
export async function uploadToSupabaseStorage(
  bucket: 'product-images' | 'product-videos' | 'site-media',
  path: string,
  fileOrBase64: File | Blob | string
): Promise<string> {
  if (!supabase || !isSupabaseConfigured()) {
    if (typeof fileOrBase64 === 'string') return fileOrBase64;
    throw new Error('Supabase client is not configured with VITE_SUPABASE_PUBLISHABLE_KEY');
  }

  let fileBody: File | Blob;
  let contentType: string | undefined;
  let extension = 'jpg';

  if (typeof fileOrBase64 === 'string') {
    if (fileOrBase64.startsWith('data:') || fileOrBase64.startsWith('blob:')) {
      const conv = await dataUrlToBlob(fileOrBase64);
      fileBody = conv.blob;
      contentType = conv.mimeType;
      extension = conv.extension;
    } else if (fileOrBase64.startsWith('http://') || fileOrBase64.startsWith('https://')) {
      // Already a permanent remote HTTPS URL, no re-upload needed
      return fileOrBase64;
    } else {
      return fileOrBase64;
    }
  } else {
    fileBody = fileOrBase64;
    contentType = fileOrBase64.type || (bucket === 'product-videos' ? 'video/mp4' : 'image/jpeg');
    if (contentType.includes('png')) extension = 'png';
    else if (contentType.includes('webp')) extension = 'webp';
    else if (contentType.includes('mp4')) extension = 'mp4';
    else if (contentType.includes('webm')) extension = 'webm';
    else if (contentType.includes('quicktime') || contentType.includes('mov')) extension = 'mov';
  }

  let cleanPath = path.replace(/^\/+/, '');
  // Append extension if path does not already contain a file extension
  if (!cleanPath.split('/').pop()?.includes('.')) {
    cleanPath = `${cleanPath}.${extension}`;
  }

  // First attempt upload
  let uploadResult = await supabase.storage
    .from(bucket)
    .upload(cleanPath, fileBody, {
      contentType: contentType || (bucket === 'product-videos' ? 'video/mp4' : 'image/jpeg'),
      upsert: true,
    });

  // If bucket is not found, try to auto-create it and retry once
  if (
    uploadResult.error &&
    (uploadResult.error.message?.toLowerCase().includes('not found') ||
      (uploadResult.error as any).statusCode === 404 ||
      (uploadResult.error as any).statusCode === '404')
  ) {
    console.warn(`[Supabase Storage] Bucket "${bucket}" not found. Attempting to create it...`);
    const created = await ensureSupabaseBucket(bucket);
    if (created) {
      uploadResult = await supabase.storage
        .from(bucket)
        .upload(cleanPath, fileBody, {
          contentType: contentType || (bucket === 'product-videos' ? 'video/mp4' : 'image/jpeg'),
          upsert: true,
        });
    }
  }

  if (uploadResult.error) {
    const errorMsg = uploadResult.error.message || JSON.stringify(uploadResult.error);
    console.error(
      `[Supabase Storage Error] Could not upload to bucket "${bucket}" path "${cleanPath}": ${errorMsg}`
    );
    throw new Error(
      `فشل رفع الملف إلى مخزن Supabase (${bucket}): ${errorMsg}. تأكد من إنشاء وعاء "${bucket}" وجعله Public في لوحة Supabase Storage.`
    );
  }

  if (!uploadResult.data) {
    throw new Error(`Upload to ${bucket} returned no data`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(uploadResult.data.path);

  return publicUrlData.publicUrl;
}

/**
 * Deletes a file from Supabase Storage given its public URL or path
 */
export async function deleteFromSupabaseStorage(
  bucket: 'product-images' | 'product-videos' | 'site-media',
  fileUrlOrPath: string
): Promise<void> {
  if (!supabase || !isSupabaseConfigured() || !fileUrlOrPath) {
    return;
  }

  let storagePath = fileUrlOrPath;
  const bucketUrlPrefix = `/storage/v1/object/public/${bucket}/`;
  if (fileUrlOrPath.includes(bucketUrlPrefix)) {
    storagePath = fileUrlOrPath.split(bucketUrlPrefix)[1];
  }

  try {
    const { error } = await supabase.storage.from(bucket).remove([storagePath]);
    if (error) {
      console.warn(`[Supabase Storage] Delete error:`, error);
    }
  } catch (err) {
    console.warn(`[Supabase Storage] Failed to remove object "${storagePath}":`, err);
  }
}
