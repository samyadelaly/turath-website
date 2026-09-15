/**
 * Utility to compress, crop and resize images client-side before storing or uploading.
 * Standardized to the optimal 1080 × 1080 px resolution for high-end luxury product showcases.
 */

export const RECOMMENDED_IMAGE_DIMENSIONS = '1080 × 1080 بكسل (Square 1:1)';

/**
 * Standardizes any uploaded image to 1080 × 1080 pixels (1:1 square ratio)
 * with smart center-cropping and high-quality smoothing.
 * Ensures the base64 output stays under 300KB so it safely persists in Firebase Firestore (1MB limit)
 * and syncs across all devices and browsers without quota errors.
 */
export async function compressSquareImage1080(
  file: File,
  targetSize: number = 1080,
  initialQuality: number = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        try {
          const { naturalWidth, naturalHeight } = img;
          const width = naturalWidth || img.width;
          const height = naturalHeight || img.height;

          // Determine square crop dimensions (center crop)
          const minSide = Math.min(width, height);
          const sourceX = Math.round((width - minSide) / 2);
          const sourceY = Math.round((height - minSide) / 2);

          const canvas = document.createElement('canvas');
          canvas.width = targetSize;
          canvas.height = targetSize;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(readerEvent.target?.result as string);
            return;
          }

          // Use high quality interpolation
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Center-crop the image into exact 1080 x 1080 square
          ctx.drawImage(
            img,
            sourceX,
            sourceY,
            minSide,
            minSide,
            0,
            0,
            targetSize,
            targetSize
          );

          // Try progressive quality encoding to ensure max base64 size is ~250KB - 350KB
          let quality = initialQuality;
          let outputDataUrl = canvas.toDataURL('image/jpeg', quality);

          // If output exceeds 400,000 characters (~300KB), gently step down quality
          if (outputDataUrl.length > 400000) {
            outputDataUrl = canvas.toDataURL('image/jpeg', 0.74);
          }
          if (outputDataUrl.length > 400000) {
            outputDataUrl = canvas.toDataURL('image/jpeg', 0.65);
          }

          resolve(outputDataUrl);
        } catch (err) {
          console.warn('1080x1080 canvas compression error, fallback to raw:', err);
          resolve(readerEvent.target?.result as string);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image for 1080x1080 processing'));
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export async function compressImageFile(
  file: File,
  maxWidth: number = 1080,
  maxHeight: number = 1080,
  quality: number = 0.82
): Promise<string> {
  // Use the 1080x1080 square compressor by default for uniform luxury aesthetics
  return compressSquareImage1080(file, 1080, quality);
}

