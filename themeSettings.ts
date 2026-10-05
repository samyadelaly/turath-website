export type GradientDirection = 
  | 'to bottom' 
  | 'to top' 
  | 'to right' 
  | 'to left' 
  | '135deg' 
  | '45deg' 
  | 'radial';

export interface PatternPreset {
  id: string;
  name: string;
  nameEn: string;
  url: string;
}

export const PATTERN_PRESETS: PatternPreset[] = [
  {
    id: 'turath-arabesque',
    name: 'زخرفة تراث الأرابيسك الأصلية',
    nameEn: 'Turath Arabesque Watermark',
    url: '/turath_pattern_watermark.png',
  },
  {
    id: 'cairo-mashrabiya',
    name: 'مشربية قاهرية هندسية',
    nameEn: 'Cairo Geometric Mashrabiya',
    url: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><rect width='60' height='60' fill='none'/><path d='M30 0 L60 30 L30 60 L0 30 Z' fill='none' stroke='%23d4c59d' stroke-width='1.2' opacity='0.7'/><circle cx='30' cy='30' r='5' fill='none' stroke='%23d4c59d' stroke-width='1' opacity='0.6'/><line x1='0' y1='30' x2='60' y2='30' stroke='%23d4c59d' stroke-width='0.8' opacity='0.4'/><line x1='30' y1='0' x2='30' y2='60' stroke='%23d4c59d' stroke-width='0.8' opacity='0.4'/><circle cx='0' cy='0' r='3' fill='%23d4c59d' opacity='0.3'/><circle cx='60' cy='0' r='3' fill='%23d4c59d' opacity='0.3'/><circle cx='0' cy='60' r='3' fill='%23d4c59d' opacity='0.3'/><circle cx='60' cy='60' r='3' fill='%23d4c59d' opacity='0.3'/></svg>`,
  },
  {
    id: 'mamluk-star',
    name: 'نجمة مملوكية ثمانية',
    nameEn: 'Mamluk Octagram Star',
    url: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><rect width='80' height='80' fill='none'/><polygon points='40,6 49,24 69,24 53,36 59,56 40,44 21,56 27,36 11,24 31,24' fill='none' stroke='%23d4c59d' stroke-width='1.2' opacity='0.8'/><rect x='25' y='25' width='30' height='30' fill='none' stroke='%23d4c59d' stroke-width='0.9' opacity='0.5' transform='rotate(45 40 40)'/><rect x='25' y='25' width='30' height='30' fill='none' stroke='%23d4c59d' stroke-width='0.9' opacity='0.5'/><circle cx='40' cy='40' r='9' fill='none' stroke='%23d4c59d' stroke-width='0.8' opacity='0.6'/></svg>`,
  },
  {
    id: 'pierced-brass',
    name: 'نحاس مخرّم جمالية',
    nameEn: 'Pierced Brass Lattice',
    url: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'><rect width='40' height='40' fill='none'/><circle cx='20' cy='20' r='2.8' fill='%23d4c59d' opacity='0.6'/><circle cx='0' cy='0' r='1.8' fill='%23d4c59d' opacity='0.45'/><circle cx='40' cy='0' r='1.8' fill='%23d4c59d' opacity='0.45'/><circle cx='0' cy='40' r='1.8' fill='%23d4c59d' opacity='0.45'/><circle cx='40' cy='40' r='1.8' fill='%23d4c59d' opacity='0.45'/><polygon points='20,6 34,20 20,34 6,20' fill='none' stroke='%23d4c59d' stroke-width='0.8' opacity='0.4'/></svg>`,
  },
  {
    id: 'damascene-floral',
    name: 'توريق نباتي دمشقي',
    nameEn: 'Damascene Floral Arabesque',
    url: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'><rect width='64' height='64' fill='none'/><path d='M32 6 C38 18 46 18 52 14 C48 24 54 30 60 32 C54 34 48 40 52 50 C46 46 38 46 32 58 C26 46 18 46 12 50 C16 40 10 34 4 32 C10 30 16 24 12 14 C18 18 26 18 32 6 Z' fill='none' stroke='%23d4c59d' stroke-width='1.2' opacity='0.75'/><circle cx='32' cy='32' r='4' fill='none' stroke='%23d4c59d' stroke-width='0.9' opacity='0.6'/></svg>`,
  },
];

export function getPatternMask(direction: GradientDirection = 'to bottom'): string {
  if (direction === 'radial') {
    return 'radial-gradient(circle at center, rgba(0,0,0,1) 20%, rgba(0,0,0,0.5) 65%, rgba(0,0,0,0) 100%)';
  }
  return `linear-gradient(${direction}, rgba(0,0,0,1) 0%, rgba(0,0,0,0.45) 65%, rgba(0,0,0,0) 100%)`;
}

export interface ButtonThemeConfig {
  style: 'filled' | 'outline' | 'transparent';
  bgColor: string;
  bgOpacity: number; // 0 to 100
  textColor: string;
  borderColor: string;
  borderOpacity: number; // 0 to 100
  hoverBgColor: string;
  hoverTextColor: string;
  hoverBorderColor: string;
  // Pattern Gradient Controls
  enablePattern?: boolean;
  patternUrl?: string;
  patternOpacity?: number; // 0 to 100
  patternDirection?: GradientDirection;
}

export interface TextThemeConfig {
  headingColor: string;
  bodyColor: string;
  secondaryColor: string;
  mutedColor: string;
  captionColor: string;
  linkColor: string;
  linkHoverColor: string;
}

export interface ContainerThemeConfig {
  // 1. Photo Direct Background & Opacity (شفافية ولون خلفية الصورة المباشرة)
  photoBgColor?: string; // Color directly behind the photo / media
  photoBgOpacity?: number; // 0 to 100: شفافية خلفية الصورة المباشرة
  photoOpacity?: number; // 0 to 100: شفافية الصورة نفسها

  // 2. Photo Container & Frame (شفافية ولون حاوية الصور وإطارها)
  photoContainerBg: string;
  photoContainerBgOpacity: number; // 0 to 100: شفافية حاوية الصور
  photoContainerBorder: string;
  photoContainerBorderOpacity: number; // 0 to 100: شفافية إطار حاوية الصور
  photoContainerBackdropBlur?: boolean; // Glassmorphism blur on photo container
  // Photo Container Specific Pattern (خاص بإطارات وحاويات الصور فقط)
  enablePhotoPattern?: boolean;
  photoPatternUrl?: string;
  photoPatternOpacity?: number; // 0 to 100
  photoPatternDirection?: GradientDirection;

  // 3. Card & Wrapper Container (شفافية ولون بطاقات وكروت الصور)
  cardBgColor: string;
  cardBgOpacity?: number; // 0 to 100: شفافية خلفية الكروت والحاويات الكلية
  cardBorderColor: string;
  cardBorderOpacity: number; // 0 to 100: شفافية إطار الكروت
  cardBackdropBlur?: boolean; // Glassmorphism blur on cards
  // Card Specific Pattern (خاص بكروت وبطاقات المنتجات والمشاريع فقط)
  enableCardPattern?: boolean;
  cardPatternUrl?: string;
  cardPatternOpacity?: number; // 0 to 100
  cardPatternDirection?: GradientDirection;

  // 4. Legacy Pattern Gradient for Containers & Cards (تدرج بديل للتوافق)
  enablePattern?: boolean;
  patternUrl?: string;
  patternOpacity?: number; // 0 to 100
  patternDirection?: GradientDirection;
}

export interface TextBoxThemeConfig {
  enableGradientPhoto: boolean;
  gradientPhotoUrl: string;
  gradientPhotoOpacity: number; // 0 to 100
  gradientDirection?: GradientDirection; // Direction for text box gradient
  boxBgColor: string;
  boxBorderColor: string;
  boxBorderOpacity: number; // 0 to 100
}

export interface HeroThemeConfig {
  heroHeadingColor: string;
  heroBodyColor: string;
  heroAccentColor: string;
  // Hero Video Overlay & Pattern Gradient Controls
  bgColor?: string;
  bgOpacity?: number; // 0 to 100
  overlayOpacity?: number; // 0 to 100 (Default 70%)
  enablePattern?: boolean;
  patternUrl?: string;
  patternOpacity?: number; // 0 to 100
  patternDirection?: GradientDirection;
}

export interface ProductsPageThemeConfig {
  bgColor: string; // Background color for Handcrafted Products section & pages
  bgOpacity: number; // 0 to 100
  backdropBlur: boolean; // whether to apply backdrop blur when opacity < 100%
  borderColor: string;
  borderOpacity: number; // 0 to 100
  // Pattern Gradient for Handcrafted Products Section
  enablePattern?: boolean;
  patternUrl?: string;
  patternOpacity?: number; // 0 to 100
  patternDirection?: GradientDirection;
}

export interface PageBackgroundThemeConfig {
  enablePattern?: boolean;
  patternUrl?: string;
  patternOpacity?: number; // 0 to 100
  patternDirection?: GradientDirection;
  patternFixed?: boolean;
}

export interface ThemeSettings {
  primaryButton: ButtonThemeConfig;
  secondaryButton: ButtonThemeConfig;
  containers?: ContainerThemeConfig;
  textBoxes?: TextBoxThemeConfig;
  productsPage?: ProductsPageThemeConfig;
  pageBackground?: PageBackgroundThemeConfig;
  text: TextThemeConfig;
  hero: HeroThemeConfig;
  updatedAt?: string;
}

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  pageBackground: {
    enablePattern: false,
    patternUrl: '/turath_pattern_watermark.png',
    patternOpacity: 5,
    patternDirection: 'to bottom',
    patternFixed: true,
  },
  productsPage: {
    bgColor: '#000000',
    bgOpacity: 100,
    backdropBlur: true,
    borderColor: '#d4c59d',
    borderOpacity: 30,
    enablePattern: false,
    patternUrl: '/turath_pattern_watermark.png',
    patternOpacity: 8,
    patternDirection: 'to bottom',
  },
  primaryButton: {
    style: 'filled',
    bgColor: '#d4c59d',
    bgOpacity: 100,
    textColor: '#000000',
    borderColor: '#d4c59d',
    borderOpacity: 100,
    hoverBgColor: '#e6d8b5',
    hoverTextColor: '#000000',
    hoverBorderColor: '#e6d8b5',
    enablePattern: false,
    patternUrl: '/turath_pattern_watermark.png',
    patternOpacity: 25,
    patternDirection: '135deg',
  },
  secondaryButton: {
    style: 'outline',
    bgColor: '#000000',
    bgOpacity: 80,
    textColor: '#d4c59d',
    borderColor: '#d4c59d',
    borderOpacity: 100,
    hoverBgColor: '#d4c59d',
    hoverTextColor: '#000000',
    hoverBorderColor: '#d4c59d',
    enablePattern: false,
    patternUrl: '/turath_pattern_watermark.png',
    patternOpacity: 20,
    patternDirection: '135deg',
  },
  containers: {
    photoBgColor: '#0a0a0d',
    photoBgOpacity: 100,
    photoOpacity: 100,
    photoContainerBg: '#0a0a0d',
    photoContainerBgOpacity: 100,
    photoContainerBorder: '#d4c59d',
    photoContainerBorderOpacity: 25,
    photoContainerBackdropBlur: true,
    enablePhotoPattern: false,
    photoPatternUrl: '/turath_pattern_watermark.png',
    photoPatternOpacity: 10,
    photoPatternDirection: 'to bottom',
    cardBgColor: '#070706',
    cardBgOpacity: 100,
    cardBorderColor: '#d4c59d',
    cardBorderOpacity: 20,
    cardBackdropBlur: true,
    enableCardPattern: false,
    cardPatternUrl: '/turath_pattern_watermark.png',
    cardPatternOpacity: 12,
    cardPatternDirection: 'to bottom',
    enablePattern: false,
    patternUrl: '/turath_pattern_watermark.png',
    patternOpacity: 12,
    patternDirection: 'to bottom',
  },
  textBoxes: {
    enableGradientPhoto: true,
    gradientPhotoUrl: '/turath_pattern_watermark.png',
    gradientPhotoOpacity: 6,
    gradientDirection: 'to bottom',
    boxBgColor: '#0c0b0e',
    boxBorderColor: '#d4c59d',
    boxBorderOpacity: 25,
  },
  text: {
    headingColor: '#f5f0e6',
    bodyColor: '#f5f0e6',
    secondaryColor: '#e6d8b5',
    mutedColor: '#9e9174',
    captionColor: '#9e9174',
    linkColor: '#d4c59d',
    linkHoverColor: '#e6d8b5',
  },
  hero: {
    heroHeadingColor: '#f5f0e6',
    heroBodyColor: '#f5f0e6',
    heroAccentColor: '#d4c59d',
    bgColor: '#000000',
    bgOpacity: 100,
    overlayOpacity: 70,
    enablePattern: false,
    patternUrl: '/turath_pattern_watermark.png',
    patternOpacity: 15,
    patternDirection: 'to bottom',
  },
};

/**
 * Converts a hex color string and opacity percentage (0-100) into a valid rgba() CSS string.
 */
export function hexToRgba(hex: string, opacity: number = 100): string {
  if (!hex || typeof hex !== 'string') return 'transparent';
  let cleanHex = hex.trim().replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  if (cleanHex.length !== 6) return hex;
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  const alpha = Math.max(0, Math.min(1, opacity / 100));
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
}

/**
 * Applies all theme tokens as semantic CSS variables on document.documentElement (:root)
 */
export function applyThemeCssVariables(theme?: Partial<ThemeSettings> | null): void {
  if (typeof document === 'undefined') return;

  const active: ThemeSettings = {
    primaryButton: { ...DEFAULT_THEME_SETTINGS.primaryButton, ...(theme?.primaryButton || {}) },
    secondaryButton: { ...DEFAULT_THEME_SETTINGS.secondaryButton, ...(theme?.secondaryButton || {}) },
    containers: { ...DEFAULT_THEME_SETTINGS.containers!, ...(theme?.containers || {}) },
    textBoxes: { ...DEFAULT_THEME_SETTINGS.textBoxes!, ...(theme?.textBoxes || {}) },
    productsPage: { ...DEFAULT_THEME_SETTINGS.productsPage!, ...(theme?.productsPage || {}) },
    pageBackground: { ...DEFAULT_THEME_SETTINGS.pageBackground!, ...(theme?.pageBackground || {}) },
    text: { ...DEFAULT_THEME_SETTINGS.text, ...(theme?.text || {}) },
    hero: { ...DEFAULT_THEME_SETTINGS.hero, ...(theme?.hero || {}) },
  };

  const root = document.documentElement;

  // 1. Text & Typography Tokens
  root.style.setProperty('--color-heading', active.text.headingColor);
  root.style.setProperty('--color-body', active.text.bodyColor);
  root.style.setProperty('--color-secondary', active.text.secondaryColor);
  root.style.setProperty('--color-muted', active.text.mutedColor);
  root.style.setProperty('--color-caption', active.text.captionColor);
  root.style.setProperty('--color-link', active.text.linkColor);
  root.style.setProperty('--color-link-hover', active.text.linkHoverColor);

  // 2. Hero Specific Tokens
  root.style.setProperty('--color-hero-heading', active.hero.heroHeadingColor);
  root.style.setProperty('--color-hero-body', active.hero.heroBodyColor);
  root.style.setProperty('--color-hero-accent', active.hero.heroAccentColor);
  const heroOverlayOpacity = typeof active.hero.overlayOpacity === 'number' ? (active.hero.overlayOpacity / 100).toFixed(2) : '0.70';
  root.style.setProperty('--hero-overlay-opacity', heroOverlayOpacity);
  root.style.setProperty('--hero-bg-color', active.hero.bgColor || '#000000');
  root.style.setProperty('--hero-pattern-display', active.hero.enablePattern ? 'block' : 'none');
  root.style.setProperty('--hero-pattern-url', `url('${active.hero.patternUrl || '/turath_pattern_watermark.png'}')`);
  root.style.setProperty('--hero-pattern-opacity', `${active.hero.enablePattern ? (active.hero.patternOpacity ?? 15) / 100 : 0}`);
  root.style.setProperty('--hero-pattern-mask', getPatternMask(active.hero.patternDirection || 'to bottom'));

  // 3. Primary Button Tokens
  const pb = active.primaryButton;
  const pbBg = pb.style === 'transparent'
    ? 'transparent'
    : pb.style === 'outline'
      ? (pb.bgOpacity > 0 && pb.bgOpacity < 100 ? hexToRgba(pb.bgColor, pb.bgOpacity) : 'transparent')
      : hexToRgba(pb.bgColor, pb.bgOpacity);
  const pbBorder = (pb.style === 'transparent' && pb.borderOpacity === 0)
    ? 'transparent'
    : hexToRgba(pb.borderColor, pb.borderOpacity);
  root.style.setProperty('--color-btn-primary-bg', pbBg);
  root.style.setProperty('--color-btn-primary-text', pb.textColor);
  root.style.setProperty('--color-btn-primary-border', pbBorder);
  root.style.setProperty('--color-btn-primary-hover-bg', pb.hoverBgColor);
  root.style.setProperty('--color-btn-primary-hover-text', pb.hoverTextColor);
  root.style.setProperty('--color-btn-primary-hover-border', pb.hoverBorderColor);

  // Primary Button Pattern Gradient
  root.style.setProperty('--btn-primary-pattern-display', pb.enablePattern ? 'block' : 'none');
  root.style.setProperty('--btn-primary-pattern-url', `url('${pb.patternUrl || '/turath_pattern_watermark.png'}')`);
  root.style.setProperty('--btn-primary-pattern-opacity', `${pb.enablePattern ? (pb.patternOpacity ?? 25) / 100 : 0}`);
  root.style.setProperty('--btn-primary-pattern-mask', getPatternMask(pb.patternDirection || '135deg'));

  // 4. Secondary Button Tokens
  const sb = active.secondaryButton;
  const sbBg = sb.style === 'transparent'
    ? 'transparent'
    : sb.style === 'outline'
      ? (sb.bgOpacity > 0 && sb.bgOpacity < 100 ? hexToRgba(sb.bgColor, sb.bgOpacity) : 'transparent')
      : hexToRgba(sb.bgColor, sb.bgOpacity);
  const sbBorder = (sb.style === 'transparent' && sb.borderOpacity === 0)
    ? 'transparent'
    : hexToRgba(sb.borderColor, sb.borderOpacity);
  root.style.setProperty('--color-btn-secondary-bg', sbBg);
  root.style.setProperty('--color-btn-secondary-text', sb.textColor);
  root.style.setProperty('--color-btn-secondary-border', sbBorder);
  root.style.setProperty('--color-btn-secondary-hover-bg', sb.hoverBgColor);
  root.style.setProperty('--color-btn-secondary-hover-text', sb.hoverTextColor);
  root.style.setProperty('--color-btn-secondary-hover-border', sb.hoverBorderColor);

  // Secondary Button Pattern Gradient
  root.style.setProperty('--btn-secondary-pattern-display', sb.enablePattern ? 'block' : 'none');
  root.style.setProperty('--btn-secondary-pattern-url', `url('${sb.patternUrl || '/turath_pattern_watermark.png'}')`);
  root.style.setProperty('--btn-secondary-pattern-opacity', `${sb.enablePattern ? (sb.patternOpacity ?? 20) / 100 : 0}`);
  root.style.setProperty('--btn-secondary-pattern-mask', getPatternMask(sb.patternDirection || '135deg'));

  // 5. Container & Photo Frame Tokens
  const cnt = active.containers || DEFAULT_THEME_SETTINGS.containers!;

  // 5a. Photo Direct Background & Opacity Tokens (خلفية الصورة المباشرة وشفافيتها)
  const photoBgColor = cnt.photoBgColor || cnt.photoContainerBg || '#0a0a0d';
  const photoBgOpacity = cnt.photoBgOpacity ?? cnt.photoContainerBgOpacity ?? 100;
  root.style.setProperty('--photo-bg', hexToRgba(photoBgColor, photoBgOpacity));
  root.style.setProperty('--photo-opacity', `${typeof cnt.photoOpacity === 'number' ? (cnt.photoOpacity / 100).toFixed(2) : '1'}`);

  // 5b. Photo Container & Frame Tokens (حاوية الصور وإطارها وشفافيتها)
  const photoContainerBg = hexToRgba(cnt.photoContainerBg || '#0a0a0d', cnt.photoContainerBgOpacity ?? 100);
  const photoContainerBorder = hexToRgba(cnt.photoContainerBorder || '#d4c59d', cnt.photoContainerBorderOpacity ?? 25);
  const photoContainerBackdrop = ((cnt.photoContainerBgOpacity ?? 100) < 100 && cnt.photoContainerBackdropBlur !== false) ? 'blur(12px)' : 'none';
  root.style.setProperty('--photo-container-bg', photoContainerBg);
  root.style.setProperty('--photo-container-border', photoContainerBorder);
  root.style.setProperty('--photo-container-backdrop', photoContainerBackdrop);

  // 5b-2. Photo Container Pattern Gradient (خاص بحاوية الصور فقط)
  const photoPatternEnabled = cnt.enablePhotoPattern ?? false;
  const photoPatternUrl = cnt.photoPatternUrl || cnt.patternUrl || '/turath_pattern_watermark.png';
  const photoPatternOpacity = cnt.photoPatternOpacity ?? 10;
  const photoPatternDirection = cnt.photoPatternDirection || 'to bottom';
  root.style.setProperty('--photo-container-pattern-display', photoPatternEnabled ? 'block' : 'none');
  root.style.setProperty('--photo-container-pattern-url', `url('${photoPatternUrl}')`);
  root.style.setProperty('--photo-container-pattern-opacity', `${photoPatternEnabled ? photoPatternOpacity / 100 : 0}`);
  root.style.setProperty('--photo-container-pattern-mask', getPatternMask(photoPatternDirection));

  // 5c. Card & Wrapper Tokens (كروت وبطاقات الصور وشفافيتها وإطارها)
  const cardBgOpacity = cnt.cardBgOpacity ?? 100;
  const cardBg = hexToRgba(cnt.cardBgColor || '#070706', cardBgOpacity);
  const cardBorder = hexToRgba(cnt.cardBorderColor || '#d4c59d', cnt.cardBorderOpacity ?? 20);
  const cardBackdrop = (cardBgOpacity < 100 && cnt.cardBackdropBlur !== false) ? 'blur(16px)' : 'none';
  root.style.setProperty('--card-bg', cardBg);
  root.style.setProperty('--card-border', cardBorder);
  root.style.setProperty('--card-backdrop', cardBackdrop);

  // 5c-2. Card Pattern Gradient (خاص بكروت وبطاقات المنتجات والمشاريع فقط)
  const cardPatternEnabled = cnt.enableCardPattern ?? cnt.enablePattern ?? false;
  const cardPatternUrl = cnt.cardPatternUrl || cnt.patternUrl || '/turath_pattern_watermark.png';
  const cardPatternOpacity = cnt.cardPatternOpacity ?? cnt.patternOpacity ?? 12;
  const cardPatternDirection = cnt.cardPatternDirection || cnt.patternDirection || 'to bottom';
  root.style.setProperty('--card-pattern-display', cardPatternEnabled ? 'block' : 'none');
  root.style.setProperty('--card-pattern-url', `url('${cardPatternUrl}')`);
  root.style.setProperty('--card-pattern-opacity', `${cardPatternEnabled ? cardPatternOpacity / 100 : 0}`);
  root.style.setProperty('--card-pattern-mask', getPatternMask(cardPatternDirection));

  // 5d. Fallback --container-pattern-* for backward compatibility
  root.style.setProperty('--container-pattern-display', cardPatternEnabled ? 'block' : 'none');
  root.style.setProperty('--container-pattern-url', `url('${cardPatternUrl}')`);
  root.style.setProperty('--container-pattern-opacity', `${cardPatternEnabled ? cardPatternOpacity / 100 : 0}`);
  root.style.setProperty('--container-pattern-mask', getPatternMask(cardPatternDirection));

  // 6. Text Box & Gradient Photo Tokens
  const tb = active.textBoxes || DEFAULT_THEME_SETTINGS.textBoxes!;
  root.style.setProperty('--textbox-gradient-photo-display', tb.enableGradientPhoto ? 'block' : 'none');
  root.style.setProperty('--textbox-gradient-photo-url', `url('${tb.gradientPhotoUrl || '/turath_pattern_watermark.png'}')`);
  root.style.setProperty('--textbox-gradient-opacity', `${tb.enableGradientPhoto ? (tb.gradientPhotoOpacity ?? 6) / 100 : 0}`);
  root.style.setProperty('--textbox-pattern-mask', getPatternMask(tb.gradientDirection || 'to bottom'));
  root.style.setProperty('--textbox-bg', hexToRgba(tb.boxBgColor, 95));
  root.style.setProperty('--textbox-border', hexToRgba(tb.boxBorderColor, tb.boxBorderOpacity));

  // 7. Handcrafted Products Section & Page Tokens
  const pp = active.productsPage || DEFAULT_THEME_SETTINGS.productsPage!;
  const ppBg = hexToRgba(pp.bgColor, pp.bgOpacity);
  const ppBorder = hexToRgba(pp.borderColor, pp.borderOpacity);
  const ppBackdrop = pp.bgOpacity < 100 && pp.backdropBlur ? 'blur(16px)' : 'none';

  root.style.setProperty('--products-section-bg', ppBg);
  root.style.setProperty('--products-section-border', ppBorder);
  root.style.setProperty('--products-section-backdrop', ppBackdrop);
  root.style.setProperty('--products-page-bg', ppBg);
  root.style.setProperty('--products-page-header-bg', ppBg);

  // Products Section Pattern Gradient
  root.style.setProperty('--products-pattern-display', pp.enablePattern ? 'block' : 'none');
  root.style.setProperty('--products-pattern-url', `url('${pp.patternUrl || '/turath_pattern_watermark.png'}')`);
  root.style.setProperty('--products-pattern-opacity', `${pp.enablePattern ? (pp.patternOpacity ?? 8) / 100 : 0}`);
  root.style.setProperty('--products-pattern-mask', getPatternMask(pp.patternDirection || 'to bottom'));

  // 8. Global Page Background Pattern Tokens
  const pageBg = active.pageBackground || DEFAULT_THEME_SETTINGS.pageBackground!;
  root.style.setProperty('--page-pattern-display', pageBg.enablePattern ? 'block' : 'none');
  root.style.setProperty('--page-pattern-url', `url('${pageBg.patternUrl || '/turath_pattern_watermark.png'}')`);
  root.style.setProperty('--page-pattern-opacity', `${pageBg.enablePattern ? (pageBg.patternOpacity ?? 5) / 100 : 0}`);
  root.style.setProperty('--page-pattern-mask', getPatternMask(pageBg.patternDirection || 'to bottom'));
  root.style.setProperty('--page-pattern-attachment', pageBg.patternFixed !== false ? 'fixed' : 'scroll');
}
