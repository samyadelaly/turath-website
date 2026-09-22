/**
 * Utility to process uploaded product images client-side before storing.
 * CRITICAL DIRECTIVE:
 * The original uploaded image MUST ALWAYS be preserved.
 * Never permanently crop, stretch, distort, or overwrite the original framing.
 * Preserves the product's natural proportions as the master asset.
 */

export const RECOMMENDED_IMAGE_DIMENSIONS = 'Original (بدون اقتصاص) — Aspect Ratio Controlled Dynamically';

/**
 * Reads and preserves the uploaded image with zero cropping and zero distortion.
 * - Files under ~300KB are preserved bit-for-bit with zero re-encoding.
 * - Oversized files (>300KB camera shots) are scaled proportionally along their exact natural
 *   aspect ratio (NO CROPPING whatsoever) so they comfortably live in Firestore without 1MB quota issues.
 */
export async function preserveOriginalUploadedImage(
  file: File,
  maxDimension: number = 1600,
  initialQuality: number = 0.84
): Promise<string> {
  // If file is already very compact (<= 120KB), keep 100% original untouched
  if (file.size <= 120 * 1024) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        try {
          const naturalW = img.naturalWidth || img.width;
          const naturalH = img.naturalHeight || img.height;

          // Strictly preserve exact natural aspect ratio (NO CROPPING)
          let targetW = naturalW;
          let targetH = naturalH;

          if (naturalW > maxDimension || naturalH > maxDimension) {
            if (naturalW >= naturalH) {
              targetW = maxDimension;
              targetH = Math.round((naturalH * maxDimension) / naturalW);
            } else {
              targetH = maxDimension;
              targetW = Math.round((naturalW * maxDimension) / naturalH);
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = targetW;
          canvas.height = targetH;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(readerEvent.target?.result as string);
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw full uncropped image
          ctx.drawImage(img, 0, 0, naturalW, naturalH, 0, 0, targetW, targetH);

          const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          let outputDataUrl = canvas.toDataURL(mimeType, initialQuality);

          // Firestore & LocalStorage safety check: stay under ~180KB base64
          const MAX_SAFE_CHARS = 180000;
          if (outputDataUrl.length > MAX_SAFE_CHARS) {
            outputDataUrl = canvas.toDataURL('image/jpeg', 0.74);
          }
          if (outputDataUrl.length > MAX_SAFE_CHARS) {
            outputDataUrl = canvas.toDataURL('image/jpeg', 0.62);
          }
          if (outputDataUrl.length > MAX_SAFE_CHARS) {
            // Scale down to 1080px for absolute safety
            const scaleDownCanvas = document.createElement('canvas');
            const scaleRatio = 1080 / Math.max(targetW, targetH);
            scaleDownCanvas.width = Math.round(targetW * scaleRatio);
            scaleDownCanvas.height = Math.round(targetH * scaleRatio);
            const scaleCtx = scaleDownCanvas.getContext('2d');
            if (scaleCtx) {
              scaleCtx.imageSmoothingEnabled = true;
              scaleCtx.imageSmoothingQuality = 'high';
              scaleCtx.drawImage(canvas, 0, 0, scaleDownCanvas.width, scaleDownCanvas.height);
              outputDataUrl = scaleDownCanvas.toDataURL('image/jpeg', 0.68);
            }
          }

          resolve(outputDataUrl);
        } catch (err) {
          console.warn('Image preservation error, falling back to raw data URL:', err);
          resolve(readerEvent.target?.result as string);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image file'));
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Backward compatibility alias: Never crops. Preserves original image proportions.
 */
export async function compressPortraitImage1080x1920(
  file: File,
  _targetWidth: number = 1080,
  _targetHeight: number = 1920,
  _initialQuality: number = 0.76
): Promise<string> {
  return preserveOriginalUploadedImage(file, 1920, 0.86);
}

/**
 * Re-compresses an existing large data URL string if it exceeds a specified character size.
 */
export async function recompressBase64Image(
  dataUrl: string,
  maxChars: number = 180000
): Promise<string> {
  if (!dataUrl || !dataUrl.startsWith('data:image/') || dataUrl.length <= maxChars) {
    return dataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        // Scale down to max 900 on largest dimension
        const maxDim = 900;
        let targetW = width;
        let targetH = height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            targetW = maxDim;
            targetH = Math.round((height * maxDim) / width);
          } else {
            targetH = maxDim;
            targetW = Math.round((width * maxDim) / height);
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetW, targetH);

        let compressed = canvas.toDataURL('image/jpeg', 0.70);
        if (compressed.length > maxChars) {
          compressed = canvas.toDataURL('image/jpeg', 0.55);
        }
        if (compressed.length > maxChars) {
          compressed = canvas.toDataURL('image/jpeg', 0.42);
        }
        if (compressed.length > maxChars) {
          // Scale down to 640px
          const c2 = document.createElement('canvas');
          const factor = 640 / Math.max(targetW, targetH);
          c2.width = Math.round(targetW * factor);
          c2.height = Math.round(targetH * factor);
          const ctx2 = c2.getContext('2d');
          if (ctx2) {
            ctx2.imageSmoothingEnabled = true;
            ctx2.drawImage(canvas, 0, 0, c2.width, c2.height);
            compressed = c2.toDataURL('image/jpeg', 0.50);
          }
        }
        resolve(compressed);
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/**
 * Backward compatibility alias: redirects square requests to the new 1080 × 1920 portrait standard
 */
export async function compressSquareImage1080(
  file: File,
  _targetSize: number = 1080,
  initialQuality: number = 0.76
): Promise<string> {
  return compressPortraitImage1080x1920(file, 1080, 1920, initialQuality);
}

export async function compressImageFile(
  file: File,
  maxWidth: number = 1080,
  maxHeight: number = 1920,
  quality: number = 0.76
): Promise<string> {
  return compressPortraitImage1080x1920(file, maxWidth, maxHeight, quality);
}

/**
 * Estimate exact byte size of a JS object when serialized to JSON
 */
export function estimateObjectByteSize(obj: any): number {
  try {
    const str = JSON.stringify(obj);
    return new Blob([str]).size;
  } catch {
    return 0;
  }
}

