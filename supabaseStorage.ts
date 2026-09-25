import { supabase, isSupabaseConfigured, SUPABASE_BUCKETS } from './supabase';

/**
 * Converts a base64 Data URL to a Blob
 */
export function base64ToBlob(base64DataUrl: string): { blob: Blob; mimeType: string; extension: string } {
  const parts = base64DataUrl.split(',');
  const match = parts[0].match(/:(.*?);/);
  const mimeType = match ? match[1] : 'image/jpeg';
  const byteString = atob(parts[1]);
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
  else if (mimeType.includes('svg')) extension = 'svg';

  return {
    blob: new Blob([uint8Array], { type: mimeType }),
    mimeType,
    extension,
  };
}

// Cache of verified existing buckets to minimize network checks
const verifiedBuckets = new Set<string>();

/**
 * Attempts to ensure a public bucket exists in Supabase Storage.
 * Tries to create the bucket if it is missing.
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
    // Continue to create attempt
  }

  try {
    const { error: createErr } = await supabase.storage.createBucket(bucket, {
      public: true,
      fileSizeLimit: 52428800, // 50MB
    });
    if (!createErr) {
      console.log(`[Supabase Storage] Successfully initialized public bucket "${bucket}".`);
      verifiedBuckets.add(bucket);
      return true;
    }
  } catch (err) {
    // Bucket creation might require dashboard / SQL editor permissions
    console.warn(`[Supabase Storage] Notice: bucket "${bucket}" could not be auto-created:`, err);
  }

  return false;
}

/**
 * Initializes all required Supabase storage buckets
 */
export async function ensureAllSupabaseBuckets(): Promise<void> {
  const buckets: ('product-images' | 'product-videos' | 'site-media')[] = [
    'product-images',
    'product-videos',
    'site-media',
  ];
  for (const b of buckets) {
    await ensureSupabaseBucket(b);
  }
}

/**
 * Uploads a file (File, Blob, or Base64 Data URL) to Supabase Storage
 * Returns the permanent public CDN HTTPS download URL.
 * Falls back gracefully to original media string if bucket is not yet created in Supabase dashboard.
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

  if (typeof fileOrBase64 === 'string') {
    if (fileOrBase64.startsWith('data:')) {
      const { blob, mimeType } = base64ToBlob(fileOrBase64);
      fileBody = blob;
      contentType = mimeType;
    } else {
      // Already an HTTPS URL, no re-upload needed
      return fileOrBase64;
    }
  } else {
    fileBody = fileOrBase64;
    contentType = fileOrBase64.type;
  }

  const cleanPath = path.replace(/^\/+/, '');

  // First attempt upload
  let uploadResult = await supabase.storage
    .from(bucket)
    .upload(cleanPath, fileBody, {
      contentType,
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
          contentType,
          upsert: true,
        });
    }
  }

  if (uploadResult.error) {
    console.warn(
      `[Supabase Storage] Notice: Could not upload to bucket "${bucket}" path "${cleanPath}": ${uploadResult.error.message}. ` +
      `Ensure the bucket exists and is public in your Supabase dashboard or run supabase_schema.sql.`
    );
    // If the input was a base64 string, return it as fallback to ensure zero data loss
    if (typeof fileOrBase64 === 'string') {
      return fileOrBase64;
    }
    throw uploadResult.error;
  }

  if (!uploadResult.data) {
    if (typeof fileOrBase64 === 'string') return fileOrBase64;
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

  // Extract path from public URL if full URL is given
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
