export interface SiteContent {
  // Announcement / Top Banner
  topAnnouncement: string;
  topPhone: string;
  topWhatsApp: string;
  shippingText: string;

  // Hero Section
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleHighlight: string;
  heroDescription: string;
  heroSubDescription: string;
  heroExploreButtonText: string;
  heroCustomButtonText: string;

  // 4 Heritage Highlights (Cards under Hero)
  metric1Title: string;
  metric1Subtitle: string;
  metric1Desc: string;
  metric2Title: string;
  metric2Subtitle: string;
  metric2Desc: string;
  metric3Title: string;
  metric3Subtitle: string;
  metric3Desc: string;
  metric4Title: string;
  metric4Subtitle: string;
  metric4Desc: string;

  // About Section
  aboutBadge: string;
  aboutTitle: string;
  aboutTitleHighlight: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  aboutParagraph3: string;
  aboutQuote: string;
  aboutImage?: string;
  aboutImageRatio?: 'Original' | '1:1' | '4:5' | '3:4' | '16:9' | '4:3' | 'Custom' | string;
  aboutImageCustomWidth?: number | string;
  aboutImageCustomHeight?: number | string;
  aboutImageFit?: 'cover' | 'contain';
  aboutImagePosition?: 'center' | 'top' | 'bottom' | 'left' | 'right' | string;

  // Founder Section
  founderBadge?: string;
  founderName?: string;
  founderRole?: string;
  founderTitle?: string;
  founderParagraph1?: string;
  founderParagraph2?: string;
  founderParagraph3?: string;
  founderQuote?: string;
  founderImage?: string;
  founderImageRatio?: 'Original' | '1:1' | '4:5' | '3:4' | '16:9' | '4:3' | 'Custom' | string;
  founderImageCustomWidth?: number | string;
  founderImageCustomHeight?: number | string;
  founderImageFit?: 'cover' | 'contain';
  founderImagePosition?: string;

  // Why Choose Us Section
  whyUsBadge: string;
  whyUsTitle: string;
  whyUsSubtitle: string;

  // Contact Section
  contactBadge: string;
  contactTitle: string;
  contactSubtitle: string;
  contactPhone: string;
  contactWhatsApp: string;
  contactEmail: string;
  contactAddress: string;
  contactHours: string;
  contactFacebook?: string;
  contactInstagram?: string;

  // Structured component helpers (derived or custom)
  hero?: {
    badge: string;
    headlinePart1: string;
    headlineGold: string;
    description: string;
    subDescription: string;
    phone: string;
    whatsapp: string;
  };
  about?: {
    title: string;
    storyPart1: string;
    storyPart2: string;
    storyPart3?: string;
    mission: string;
    vision: string;
    image?: string;
  };
  whyUs?: {
    title: string;
    subtitle: string;
  };
  contact?: {
    title: string;
    subtitle: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    hours: string;
    facebook?: string;
    instagram?: string;
  };
}

export const DEFAULT_ABOUT_IMAGE = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80';

export const TURATH_FACEBOOK_URL = 'https://www.facebook.com/Egyptian.Turath';
export const TURATH_INSTAGRAM_URL = 'https://www.instagram.com/turath_egypt';

export function sanitizeFacebookUrl(url?: string | null): string {
  if (!url || typeof url !== 'string') return TURATH_FACEBOOK_URL;
  const trimmed = url.trim();
  if (
    !trimmed ||
    trimmed.includes('turath.egypt') ||
    trimmed === 'https://www.facebook.com' ||
    trimmed === 'https://www.facebook.com/' ||
    trimmed === 'https://facebook.com' ||
    trimmed.endsWith('Egyptian.Turath/')
  ) {
    return TURATH_FACEBOOK_URL;
  }
  return trimmed;
}

export function sanitizeInstagramUrl(url?: string | null): string {
  if (!url || typeof url !== 'string') return TURATH_INSTAGRAM_URL;
  const trimmed = url.trim();
  if (
    !trimmed ||
    trimmed.includes('turath.egypt') ||
    trimmed === 'https://www.instagram.com' ||
    trimmed === 'https://www.instagram.com/' ||
    trimmed === 'https://instagram.com' ||
    trimmed.endsWith('turath_egypt/')
  ) {
    return TURATH_INSTAGRAM_URL;
  }
  return trimmed;
}

export const DEFAULT_BASE_SITE_CONTENT: Omit<SiteContent, 'hero' | 'about' | 'whyUs' | 'contact'> = {
  // Top Banner
  topAnnouncement: '',
  topPhone: '002 01016771010',
  topWhatsApp: '+20 101 677 1010',
  shippingText: 'Worldwide Shipping',

  // Hero
  heroBadge: '',
  heroTitleLine1: 'Handcrafted Brass & Copper Excellence',
  heroTitleHighlight: 'from Egypt',
  heroDescription:
    'Premium handcrafted brass, copper and decorative metal products, made in Cairo, Egypt for luxury homes, hotels, restaurants, palaces and commercial projects worldwide.',
  heroSubDescription:
    'صناعة وتصدير أفخر المشغولات النحاسية والديكورية (النحاس الأصفر والنحاس الأحمر) بأيدي أمهر الحرفيين في الجمالية، القاهرة بمواصفات معمارية عالمية.',
  heroExploreButtonText: 'Explore Handcrafted Collections',
  heroCustomButtonText: 'Custom Manufacturing',

  // 4 Cards
  metric1Title: 'Gamaliya Heritage',
  metric1Subtitle: 'Master Artisans',
  metric1Desc: 'Generations of Egyptian metalworking lineages & authentic craft',

  metric2Title: 'Solid Brass & Copper',
  metric2Subtitle: 'Pure Heavy Metals',
  metric2Desc: 'Heavy gauge brass, red copper & decorative alloys with archival patina',

  metric3Title: 'Architectural Scale',
  metric3Subtitle: 'Bespoke Projects',
  metric3Desc: 'Custom fabrication for palaces, hotels, restaurants & luxury villas',

  metric4Title: 'Safe Logistics',
  metric4Subtitle: 'Global Delivery',
  metric4Desc: 'Protective wooden crating & insured worldwide air/sea transit',

  // About Section (About Turath)
  aboutBadge: 'Authentic Heritage & Passion',
  aboutTitle: 'About Turath',
  aboutTitleHighlight: 'Turath',
  aboutParagraph1:
    'Turath is an Egyptian craftsmanship brand specializing in handcrafted brass and copper products, where traditional metalworking meets creativity and contemporary design.',
  aboutParagraph2:
    'Founded in Cairo, Turath creates distinctive pieces for residential, hospitality, commercial, and architectural spaces.',
  aboutParagraph3:
    'From lighting and mirrors to furniture, decorative pieces, and custom metalwork, every creation reflects a balance between craftsmanship, artistic vision, and attention to detail.',
  aboutQuote:
    '“We do not simply shape metal; we breathe life, history, and light into every hand-pierced pattern.”',
  aboutImage: DEFAULT_ABOUT_IMAGE,

  // Founder Section (Samy Adel Abdallah)
  founderBadge: 'SAMY ADEL ABDALLAH • FOUNDER / CREATIVE DIRECTOR',
  founderName: 'SAMY ADEL ABDALLAH',
  founderRole: 'FOUNDER / CREATIVE DIRECTOR',
  founderTitle: 'FROM GRAPHIC DESIGN & MARKETING TO BRASS & COPPER CRAFTSMANSHIP',
  founderParagraph1:
    'Samy Adel Abdallah, founder of Turath, graduated in Computer Science in 2000 and began his career in marketing.',
  founderParagraph2:
    'His creative mindset and passion for design shaped his approach to brass and copper, combining craftsmanship with artistic vision.',
  founderParagraph3:
    'In 2016, he founded Turath, turning an idea into a journey of creativity, craftsmanship, and Egyptian design.',
  founderQuote: '',
  founderImage: DEFAULT_ABOUT_IMAGE,

  // Why Us
  whyUsBadge: '',
  whyUsTitle: 'Why Choose Turath?',
  whyUsSubtitle:
    'From private luxury estates to iconic hospitality destinations, Turath is the global choice for authentic Egyptian handcrafted brass, copper, and decorative metalwork.',

  // Contact
  contactBadge: '',
  contactTitle: 'Request a Project Quotation',
  contactSubtitle:
    'Connect directly with our master craftsmen and engineering team in Cairo for standard pieces, custom architectural lighting, or large-scale contract manufacturing.',
  contactPhone: '002 01016771010',
  contactWhatsApp: '+20 101 677 1010',
  contactEmail: 'turath.egypt@gmail.com',
  contactAddress: 'Gamaliya Street, Historic Cairo, Egypt',
  contactHours: 'Saturday – Thursday: 9:00 AM – 7:00 PM (GMT+2)',
  contactFacebook: 'https://www.facebook.com/Egyptian.Turath',
  contactInstagram: 'https://www.instagram.com/turath_egypt',
};

export function ensureSiteContentSections(data?: Partial<SiteContent> | null): SiteContent {
  const safeData = data && typeof data === 'object' ? data : {};
  const merged = { ...DEFAULT_BASE_SITE_CONTENT, ...safeData };

  // Populate founder section defaults
  if (!merged.founderName) merged.founderName = 'SAMY ADEL ABDALLAH';
  if (!merged.founderRole) merged.founderRole = 'FOUNDER / CREATIVE DIRECTOR';
  if (!merged.founderTitle || merged.founderTitle === 'From Graphic Design to Metal Craft') {
    merged.founderTitle = 'FROM GRAPHIC DESIGN & MARKETING TO BRASS & COPPER CRAFTSMANSHIP';
  }
  if (!merged.founderParagraph1 || merged.founderParagraph1.includes('Modern Academy')) {
    merged.founderParagraph1 =
      'Samy Adel Abdallah, founder of Turath, graduated in Computer Science in 2000 and began his career in marketing.';
  }
  if (!merged.founderParagraph2 || merged.founderParagraph2.includes('composition, and visual detail')) {
    merged.founderParagraph2 =
      'His creative mindset and passion for design shaped his approach to brass and copper, combining craftsmanship with artistic vision.';
  }
  if (!merged.founderParagraph3 || merged.founderParagraph3.includes('beginning a journey that brings together')) {
    merged.founderParagraph3 =
      'In 2016, he founded Turath, turning an idea into a journey of creativity, craftsmanship, and Egyptian design.';
  }
  merged.founderQuote = '';

  // Ensure About Turath copy is the new brand text
  if (
    !merged.aboutTitle ||
    merged.aboutTitle === 'From Graphic Design to Metal Craft' ||
    merged.aboutTitle === 'Centuries of Egyptian Metalworking Tradition Reborn'
  ) {
    merged.aboutTitle = 'About Turath';
  }
  if (
    !merged.aboutParagraph1 ||
    merged.aboutParagraph1.startsWith('Samy Adel Abdallah') ||
    merged.aboutParagraph1.startsWith('Turath was founded in the historic artisan quarter')
  ) {
    merged.aboutParagraph1 =
      'Turath is an Egyptian craftsmanship brand specializing in handcrafted brass and copper products, where traditional metalworking meets creativity and contemporary design.';
  }
  if (
    !merged.aboutParagraph2 ||
    merged.aboutParagraph2.startsWith('His passion for design') ||
    merged.aboutParagraph2.startsWith('Every lantern, chandelier, console')
  ) {
    merged.aboutParagraph2 =
      'Founded in Cairo, Turath creates distinctive pieces for residential, hospitality, commercial, and architectural spaces.';
  }
  if (
    !merged.aboutParagraph3 ||
    merged.aboutParagraph3.startsWith('In 2016, he founded Turath') ||
    merged.aboutParagraph3.startsWith('Today, Turath supplies')
  ) {
    merged.aboutParagraph3 =
      'From lighting and mirrors to furniture, decorative pieces, and custom metalwork, every creation reflects a balance between craftsmanship, artistic vision, and attention to detail.';
  }

  const rawAbout = { ...(safeData.about || {}) };
  if (
    rawAbout.title === 'From Graphic Design to Metal Craft' ||
    rawAbout.title === 'Centuries of Egyptian Metalworking Tradition Reborn'
  ) {
    rawAbout.title = 'About Turath';
  }
  if (
    rawAbout.storyPart1 &&
    (rawAbout.storyPart1.startsWith('Samy Adel Abdallah') ||
      rawAbout.storyPart1.startsWith('Turath was founded in the historic artisan quarter'))
  ) {
    rawAbout.storyPart1 =
      'Turath is an Egyptian craftsmanship brand specializing in handcrafted brass and copper products, where traditional metalworking meets creativity and contemporary design.';
  }
  if (
    rawAbout.storyPart2 &&
    (rawAbout.storyPart2.startsWith('His passion for design') ||
      rawAbout.storyPart2.startsWith('Every lantern, chandelier, console'))
  ) {
    rawAbout.storyPart2 =
      'Founded in Cairo, Turath creates distinctive pieces for residential, hospitality, commercial, and architectural spaces.';
  }
  if (
    !rawAbout.storyPart3 ||
    rawAbout.storyPart3.startsWith('In 2016, he founded Turath') ||
    rawAbout.storyPart3.startsWith('Today, Turath supplies')
  ) {
    rawAbout.storyPart3 =
      'From lighting and mirrors to furniture, decorative pieces, and custom metalwork, every creation reflects a balance between craftsmanship, artistic vision, and attention to detail.';
  }

  // Ensure contact facebook and instagram links are sanitized and strictly updated
  const rawContact: Partial<NonNullable<SiteContent['contact']>> = { ...(safeData.contact || {}) };
  const resolvedFacebook = sanitizeFacebookUrl(rawContact.facebook || merged.contactFacebook);
  const resolvedInstagram = sanitizeInstagramUrl(rawContact.instagram || merged.contactInstagram);
  merged.contactFacebook = resolvedFacebook;
  merged.contactInstagram = resolvedInstagram;
  rawContact.facebook = resolvedFacebook;
  rawContact.instagram = resolvedInstagram;

  return {
    ...merged,
    hero: {
      badge: merged.heroBadge || '',
      headlinePart1: merged.heroTitleLine1 || 'Handcrafted Brass & Copper Excellence',
      headlineGold: merged.heroTitleHighlight || 'from Egypt',
      description: merged.heroDescription || '',
      subDescription: merged.heroSubDescription || '',
      phone: merged.topPhone || '002 01016771010',
      whatsapp: merged.topWhatsApp || '+20 101 677 1010',
      ...(safeData.hero || {}),
    },
    about: {
      title: merged.aboutTitle || 'About Turath',
      storyPart1: merged.aboutParagraph1 || DEFAULT_BASE_SITE_CONTENT.aboutParagraph1,
      storyPart2: merged.aboutParagraph2 || DEFAULT_BASE_SITE_CONTENT.aboutParagraph2,
      storyPart3: merged.aboutParagraph3 || DEFAULT_BASE_SITE_CONTENT.aboutParagraph3,
      mission: 'Preserving millennia of Egyptian brass and copper artistry while engineering architectural-grade lighting, decorative metalwork, and bespoke fixtures for the world’s most distinguished spaces.',
      vision: 'To be the globally recognized benchmark for luxury Egyptian brass, copper, and decorative metal craftsmanship, elevating traditional Gamaliya artisan lineages onto the international architectural stage.',
      image: merged.aboutImage || DEFAULT_ABOUT_IMAGE,
      ...rawAbout,
    },
    whyUs: {
      title: merged.whyUsTitle || 'Why Choose Turath?',
      subtitle: merged.whyUsSubtitle || DEFAULT_BASE_SITE_CONTENT.whyUsSubtitle,
      ...(safeData.whyUs || {}),
    },
    contact: {
      title: merged.contactTitle || DEFAULT_BASE_SITE_CONTENT.contactTitle,
      subtitle: merged.contactSubtitle || DEFAULT_BASE_SITE_CONTENT.contactSubtitle,
      phone: merged.contactPhone || DEFAULT_BASE_SITE_CONTENT.contactPhone,
      whatsapp: merged.contactWhatsApp || DEFAULT_BASE_SITE_CONTENT.contactWhatsApp,
      email: merged.contactEmail || DEFAULT_BASE_SITE_CONTENT.contactEmail,
      address: merged.contactAddress || DEFAULT_BASE_SITE_CONTENT.contactAddress,
      hours: merged.contactHours || DEFAULT_BASE_SITE_CONTENT.contactHours,
      ...rawContact,
      facebook: resolvedFacebook,
      instagram: resolvedInstagram,
    },
  };
}

export const DEFAULT_SITE_CONTENT: SiteContent = ensureSiteContentSections(DEFAULT_BASE_SITE_CONTENT);

const SITE_CONTENT_STORAGE_KEY = 'turath_site_content_v2';

export function getStoredSiteContent(): SiteContent {
  if (typeof window === 'undefined') return DEFAULT_SITE_CONTENT;
  try {
    const raw = localStorage.getItem(SITE_CONTENT_STORAGE_KEY) || localStorage.getItem('turath_site_content');
    if (!raw) return DEFAULT_SITE_CONTENT;
    const parsed = JSON.parse(raw);
    const enriched = ensureSiteContentSections(parsed);
    // Write back sanitized object to localStorage so stale/broken URLs are permanently eliminated
    try {
      localStorage.setItem(SITE_CONTENT_STORAGE_KEY, JSON.stringify(enriched));
      localStorage.removeItem('turath_site_content');
    } catch {
      // ignore storage quota error
    }
    return enriched;
  } catch (err) {
    console.warn('Could not read stored site content from localStorage:', err);
    return DEFAULT_SITE_CONTENT;
  }
}

export function saveStoredSiteContent(content: SiteContent): void {
  if (typeof window === 'undefined') return;
  try {
    const enriched = ensureSiteContentSections(content);
    localStorage.setItem(SITE_CONTENT_STORAGE_KEY, JSON.stringify(enriched));
    window.dispatchEvent(new CustomEvent('turath-site-content-updated', { detail: enriched }));
  } catch (err) {
    console.warn('Could not save site content to localStorage:', err);
  }
}

export function resetStoredSiteContent(): SiteContent {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(SITE_CONTENT_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('turath-site-content-updated', { detail: DEFAULT_SITE_CONTENT }));
    } catch (err) {
      console.warn('Could not reset site content in localStorage:', err);
    }
  }
  return DEFAULT_SITE_CONTENT;
}
