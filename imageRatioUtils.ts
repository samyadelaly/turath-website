import { ProductItem, ProductCategoryInfo } from './types';

export type MediaType = 'image' | 'video';

export type ImageRatioPreset =
  | 'Original'
  | '1:1'
  | '4:5'
  | '3:4'
  | '16:9'
  | '4:3'
  | '16:7'
  | 'Custom';

// Universal aliases for global media ratio system (Image & Video)
export type MediaRatioPreset = ImageRatioPreset;
export type ProductImageRatioPreset = ImageRatioPreset;

export type ImageObjectFit = 'cover' | 'contain';
export type MediaObjectFit = ImageObjectFit;

export type ImageObjectPosition = 'center' | 'top' | 'bottom' | 'left' | 'right' | string;
export type MediaObjectPosition = ImageObjectPosition;

export interface MediaTypeOption {
  value: MediaType;
  label: string;
  labelAR: string;
}

export const MEDIA_TYPE_OPTIONS: MediaTypeOption[] = [
  { value: 'image', label: 'Image', labelAR: 'صورة' },
  { value: 'video', label: 'Video', labelAR: 'فيديو' },
];

export interface ImageRatioOption {
  value: ImageRatioPreset;
  label: string;
  labelAR: string;
  ratioCss?: string;
  description: string;
}

export const IMAGE_RATIO_OPTIONS: ImageRatioOption[] = [
  {
    value: 'Original',
    label: 'Original',
    labelAR: 'الأصلية بدون اقتصاص',
    description: 'Natural uploaded media proportions (auto)',
  },
  {
    value: '1:1',
    label: 'Square — 1:1',
    labelAR: 'مربع 1:1',
    ratioCss: '1 / 1',
    description: 'Equal width & height (1:1)',
  },
  {
    value: '4:5',
    label: 'Portrait — 4:5',
    labelAR: 'طولي 4:5',
    ratioCss: '4 / 5',
    description: 'Luxury portrait catalog ratio (4:5)',
  },
  {
    value: '3:4',
    label: 'Portrait — 3:4',
    labelAR: 'طولي 3:4',
    ratioCss: '3 / 4',
    description: 'Classic portrait catalog ratio (3:4)',
  },
  {
    value: '16:9',
    label: 'Landscape — 16:9',
    labelAR: 'عرضي 16:9',
    ratioCss: '16 / 9',
    description: 'Cinematic widescreen landscape (16:9)',
  },
  {
    value: '4:3',
    label: 'Landscape — 4:3',
    labelAR: 'عرضي 4:3',
    ratioCss: '4 / 3',
    description: 'Standard landscape ratio (4:3)',
  },
  {
    value: '16:7',
    label: 'Banner / Cover — 16:7',
    labelAR: 'غلاف عريض 16:7',
    ratioCss: '16 / 7',
    description: 'Panoramic wide banner / category cover (16:7)',
  },
  {
    value: 'Custom',
    label: 'Custom',
    labelAR: 'نسبة مخصصة',
    description: 'Enter custom Width & Height (e.g. 5 / 7)',
  },
];

export const MEDIA_RATIO_OPTIONS = IMAGE_RATIO_OPTIONS;

export interface ImagePositionOption {
  value: ImageObjectPosition;
  label: string;
  labelAR: string;
  description: string;
}

export const IMAGE_POSITION_OPTIONS: ImagePositionOption[] = [
  {
    value: 'center',
    label: 'Center',
    labelAR: 'الوسط (تلقائي)',
    description: 'Focal point centered',
  },
  {
    value: 'top',
    label: 'Top',
    labelAR: 'الأعلى',
    description: 'Anchor to top edge (e.g. chandeliers, appliques)',
  },
  {
    value: 'bottom',
    label: 'Bottom',
    labelAR: 'الأسفل',
    description: 'Anchor to bottom edge (e.g. tables, consoles)',
  },
  {
    value: 'left',
    label: 'Left',
    labelAR: 'اليسار',
    description: 'Anchor to left edge',
  },
  {
    value: 'right',
    label: 'Right',
    labelAR: 'اليمين',
    description: 'Anchor to right edge',
  },
];

export interface ImageFitOption {
  value: ImageObjectFit;
  label: string;
  labelAR: string;
  description: string;
}

export const IMAGE_FIT_OPTIONS: ImageFitOption[] = [
  {
    value: 'cover',
    label: 'Cover (Fill Frame)',
    labelAR: 'ملء الإطار (Cover)',
    description: 'Fills the frame proportionally (crops excess)',
  },
  {
    value: 'contain',
    label: 'Contain (Show Full Image)',
    labelAR: 'إظهار كامل الصورة (Contain)',
    description: 'Shows entire piece without cropping',
  },
];

export interface ImageRatioConfig {
  ratio?: ImageRatioPreset | string;
  customWidth?: number | string;
  customHeight?: number | string;
  fit?: ImageObjectFit;
  position?: ImageObjectPosition;
}

export interface MediaRatioConfig extends ImageRatioConfig {
  type?: MediaType;
}

export interface ComputedMediaRatio extends ComputedImageRatio {
  mediaType: MediaType;
}

export const MEDIA_FIT_OPTIONS = IMAGE_FIT_OPTIONS;
export const MEDIA_POSITION_OPTIONS = IMAGE_POSITION_OPTIONS;

/**
 * Universal media ratio computer (Images & Videos):
 * Computes exact CSS aspect-ratio, object-fit, and object-position for both
 * images and videos across the website.
 */
export function computeMediaRatio(
  config?: MediaRatioConfig | null,
  defaultType?: 'product' | 'product_main' | 'category' | 'hero' | 'gallery' | 'general' | 'video'
): ComputedMediaRatio {
  const mediaType: MediaType = config?.type === 'video' ? 'video' : 'image';
  
  // Default values based on context
  let fallbackRatio = config?.ratio;
  let fallbackFit = config?.fit;
  let fallbackPos = config?.position || 'center';

  if (!fallbackRatio) {
    switch (defaultType) {
      case 'product':
      case 'product_main':
        fallbackRatio = '4:5';
        fallbackFit = fallbackFit || 'contain';
        break;
      case 'category':
        fallbackRatio = '16:7';
        fallbackFit = fallbackFit || 'cover';
        break;
      case 'hero':
        fallbackRatio = '16:9';
        fallbackFit = fallbackFit || 'cover';
        break;
      case 'video':
        fallbackRatio = 'Original';
        fallbackFit = fallbackFit || 'contain';
        break;
      case 'gallery':
      case 'general':
      default:
        fallbackRatio = 'Original';
        fallbackFit = fallbackFit || (mediaType === 'video' ? 'contain' : 'cover');
        break;
    }
  }

  const computed = computeImageRatio({
    ratio: fallbackRatio,
    customWidth: config?.customWidth,
    customHeight: config?.customHeight,
    fit: fallbackFit,
    position: fallbackPos,
  });

  return {
    ...computed,
    mediaType,
  };
}

/**
 * Computes video ratio for a product item
 */
export function computeProductVideoRatio(
  product?: Partial<ProductItem> | null
): ComputedMediaRatio {
  const selectedPreset = product?.videoRatio || product?.imageRatio || '4:5';
  const selectedFit = (product?.videoFit as MediaObjectFit) || 'contain';
  const selectedPosition = (product?.videoPosition as MediaObjectPosition) || 'center';

  const computed = computeImageRatio({
    ratio: selectedPreset,
    customWidth: product?.videoCustomRatioWidth || product?.customRatioWidth,
    customHeight: product?.videoCustomRatioHeight || product?.customRatioHeight,
    fit: selectedFit,
    position: selectedPosition,
  });

  return {
    ...computed,
    mediaType: 'video',
  };
}

/**
 * Computes media ratio for a product item (image or video)
 */
export function computeProductMediaRatio(
  product?: Partial<ProductItem> | null,
  activeType?: MediaType,
  mediaUrlOrKey?: string
): ComputedMediaRatio {
  const isVideo = activeType ? activeType === 'video' : product?.mediaType === 'video';

  if (isVideo) {
    return computeProductVideoRatio(product);
  }

  const imgComputed = computeProductImageRatio(product, mediaUrlOrKey);
  return {
    ...imgComputed,
    mediaType: 'image',
  };
}

/**
 * Computes media ratio for a category cover (image or video)
 */
export function computeCategoryCoverMediaRatio(
  category?: Partial<ProductCategoryInfo> | null
): ComputedMediaRatio {
  const isVideo = category?.coverMediaType === 'video';

  if (isVideo) {
    const computed = computeImageRatio({
      ratio: category?.coverVideoRatio || category?.coverImageRatio || '16:7',
      customWidth: category?.customRatioWidth,
      customHeight: category?.customRatioHeight,
      fit: (category?.coverVideoFit as MediaObjectFit) || 'cover',
      position: (category?.coverVideoPosition as MediaObjectPosition) || 'center',
    });
    return {
      ...computed,
      mediaType: 'video',
    };
  }

  const imgComputed = computeCategoryCoverRatio(category);
  return {
    ...imgComputed,
    mediaType: 'image',
  };
}


export interface ComputedImageRatio {
  preset: ImageRatioPreset;
  aspectRatioCss?: string; // undefined if Original (auto)
  objectFit: ImageObjectFit;
  objectPosition: ImageObjectPosition;
  isOriginal: boolean;
  rawRatioNumber?: number; // width / height
  customWidth?: number;
  customHeight?: number;
}

/**
 * Universal ratio computer:
 * Computes exact CSS aspect-ratio, object-fit, and object-position for any
 * image on the website (products, category covers, section heroes, galleries, about).
 * Defaults safely to "Original" (no cropping or distortion).
 */
export function computeImageRatio(config?: ImageRatioConfig | null): ComputedImageRatio {
  const norm = String(config?.ratio || 'Original').trim();
  let preset: ImageRatioPreset = 'Original';

  if (norm === '1:1' || norm.toLowerCase() === 'square') {
    preset = '1:1';
  } else if (norm === '4:5') {
    preset = '4:5';
  } else if (norm === '3:4') {
    preset = '3:4';
  } else if (norm === '16:9') {
    preset = '16:9';
  } else if (norm === '4:3') {
    preset = '4:3';
  } else if (norm === '16:7') {
    preset = '16:7';
  } else if (norm.toLowerCase() === 'custom') {
    preset = 'Custom';
  } else {
    preset = 'Original';
  }

  const customW = Math.max(0.1, Number(config?.customWidth) || 5);
  const customH = Math.max(0.1, Number(config?.customHeight) || 7);
  const objectFit: ImageObjectFit = config?.fit === 'contain' ? 'contain' : 'cover';

  // Normalize position
  const rawPos = String(config?.position || 'center').toLowerCase().trim();
  let objectPosition: ImageObjectPosition = 'center';
  if (['top', 'bottom', 'left', 'right', 'center'].includes(rawPos)) {
    objectPosition = rawPos as ImageObjectPosition;
  }

  switch (preset) {
    case '1:1':
      return {
        preset: '1:1',
        aspectRatioCss: '1 / 1',
        objectFit,
        objectPosition,
        isOriginal: false,
        rawRatioNumber: 1,
      };
    case '4:5':
      return {
        preset: '4:5',
        aspectRatioCss: '4 / 5',
        objectFit,
        objectPosition,
        isOriginal: false,
        rawRatioNumber: 4 / 5,
      };
    case '3:4':
      return {
        preset: '3:4',
        aspectRatioCss: '3 / 4',
        objectFit,
        objectPosition,
        isOriginal: false,
        rawRatioNumber: 3 / 4,
      };
    case '16:9':
      return {
        preset: '16:9',
        aspectRatioCss: '16 / 9',
        objectFit,
        objectPosition,
        isOriginal: false,
        rawRatioNumber: 16 / 9,
      };
    case '4:3':
      return {
        preset: '4:3',
        aspectRatioCss: '4 / 3',
        objectFit,
        objectPosition,
        isOriginal: false,
        rawRatioNumber: 4 / 3,
      };
    case '16:7':
      return {
        preset: '16:7',
        aspectRatioCss: '16 / 7',
        objectFit,
        objectPosition,
        isOriginal: false,
        rawRatioNumber: 16 / 7,
      };
    case 'Custom':
      return {
        preset: 'Custom',
        aspectRatioCss: `${customW} / ${customH}`,
        objectFit,
        objectPosition,
        isOriginal: false,
        rawRatioNumber: customW / customH,
        customWidth: customW,
        customHeight: customH,
      };
    case 'Original':
    default:
      return {
        preset: 'Original',
        aspectRatioCss: undefined,
        objectFit,
        objectPosition,
        isOriginal: true,
      };
  }
}

/**
 * Computes the exact CSS aspect-ratio, object-fit, and object-position for a product image.
 * Respects:
 * 1. Image-specific override (if present in product.imageRatios)
 * 2. Product-level ratio (product.imageRatio)
 * 3. Default fallback to "4:5" (contain mode to show complete product) if not previously saved
 */
export function computeProductImageRatio(
  product?: Partial<ProductItem> | null,
  imageUrlOrKey?: string
): ComputedImageRatio {
  // Respect existing saved values; default to 4:5 and contain if none previously saved
  let selectedPreset: ImageRatioPreset | string = product?.imageRatio || '4:5';
  let selectedFit: ImageObjectFit = (product?.imageFit as ImageObjectFit) || 'contain';
  let selectedPosition: ImageObjectPosition = (product?.imagePosition as ImageObjectPosition) || 'center';

  if (imageUrlOrKey && product?.imageRatios && product.imageRatios[imageUrlOrKey]) {
    selectedPreset = product.imageRatios[imageUrlOrKey];
  }
  if (imageUrlOrKey && product?.imageFits && product.imageFits[imageUrlOrKey]) {
    selectedFit = product.imageFits[imageUrlOrKey];
  }
  if (imageUrlOrKey && product?.imagePositions && product.imagePositions[imageUrlOrKey]) {
    selectedPosition = product.imagePositions[imageUrlOrKey];
  }

  return computeImageRatio({
    ratio: selectedPreset,
    customWidth: product?.customRatioWidth,
    customHeight: product?.customRatioHeight,
    fit: selectedFit,
    position: selectedPosition,
  });
}

/**
 * Computes the exact CSS aspect-ratio, object-fit, and object-position for a category cover image.
 * Default: 16:7 if not previously saved.
 */
export function computeCategoryCoverRatio(
  category?: Partial<ProductCategoryInfo> | null
): ComputedImageRatio {
  return computeImageRatio({
    ratio: category?.coverImageRatio || '16:7',
    customWidth: category?.customRatioWidth,
    customHeight: category?.customRatioHeight,
    fit: (category?.coverImageFit as ImageObjectFit) || 'cover',
    position: (category?.coverImagePosition as ImageObjectPosition) || 'center',
  });
}

/**
 * Computes hero or banner image ratio (default: 16:9).
 */
export function computeHeroBannerRatio(config?: ImageRatioConfig | null): ComputedImageRatio {
  return computeImageRatio({
    ratio: config?.ratio || '16:9',
    customWidth: config?.customWidth,
    customHeight: config?.customHeight,
    fit: (config?.fit as ImageObjectFit) || 'cover',
    position: config?.position || 'center',
  });
}

/**
 * Computes project or gallery image ratio (default: Original).
 */
export function computeGalleryRatio(config?: ImageRatioConfig | null): ComputedImageRatio {
  return computeImageRatio({
    ratio: config?.ratio || 'Original',
    customWidth: config?.customWidth,
    customHeight: config?.customHeight,
    fit: (config?.fit as ImageObjectFit) || 'contain',
    position: config?.position || 'center',
  });
}

/**
 * Computes general content image ratio (default: Original).
 */
export function computeGeneralContentRatio(config?: ImageRatioConfig | null): ComputedImageRatio {
  return computeImageRatio({
    ratio: config?.ratio || 'Original',
    customWidth: config?.customWidth,
    customHeight: config?.customHeight,
    fit: (config?.fit as ImageObjectFit) || 'cover',
    position: config?.position || 'center',
  });
}

/**
 * Computes section or internal image ratio.
 */
export function computeSectionImageRatio(config?: ImageRatioConfig | null): ComputedImageRatio {
  return computeImageRatio(config);
}
