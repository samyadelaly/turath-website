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
    mission: string;
    vision: string;
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
  };
}

export function ensureSiteContentSections(data: Partial<SiteContent>): SiteContent {
  const merged = { ...DEFAULT_BASE_SITE_CONTENT, ...data };
  return {
    ...merged,
    hero: {
      badge: merged.heroBadge,
      headlinePart1: merged.heroTitleLine1,
      headlineGold: merged.heroTitleHighlight,
      description: merged.heroDescription,
      subDescription: merged.heroSubDescription,
      phone: merged.topPhone,
      whatsapp: merged.topWhatsApp,
      ...(data.hero || {}),
    },
    about: {
      title: merged.aboutTitle,
      storyPart1: merged.aboutParagraph1,
      storyPart2: merged.aboutParagraph2,
      mission: 'Preserving millennia of Egyptian brass and copper artistry while engineering architectural-grade lighting, decorative metalwork, and bespoke fixtures for the world’s most distinguished spaces.',
      vision: 'To be the globally recognized benchmark for luxury Egyptian brass, copper, and decorative metal craftsmanship, elevating traditional Gamaliya artisan lineages onto the international architectural stage.',
      ...(data.about || {}),
    },
    whyUs: {
      title: merged.whyUsTitle,
      subtitle: merged.whyUsSubtitle,
      ...(data.whyUs || {}),
    },
    contact: {
      title: merged.contactTitle,
      subtitle: merged.contactSubtitle,
      phone: merged.contactPhone,
      whatsapp: merged.contactWhatsApp,
      email: merged.contactEmail,
      address: merged.contactAddress,
      hours: merged.contactHours,
      ...(data.contact || {}),
    },
  };
}

const DEFAULT_BASE_SITE_CONTENT: Omit<SiteContent, 'hero' | 'about' | 'whyUs' | 'contact'> = {
  // Top Banner
  topAnnouncement: 'Gamaliya Street • Cairo, Egypt • Worldwide Delivery',
  topPhone: '002 01016771010',
  topWhatsApp: '+20 101 677 1010',
  shippingText: 'Worldwide Shipping',

  // Hero
  heroBadge: 'Gamaliya Street • Cairo, Egypt • Worldwide Delivery',
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

  // About Section
  aboutBadge: 'Authentic Heritage & Passion',
  aboutTitle: 'Centuries of Egyptian Metalworking Tradition Reborn',
  aboutTitleHighlight: 'Reborn',
  aboutParagraph1:
    'Turath was founded in the historic artisan quarter of Gamaliya, Cairo — an ancient enclave where master metalworkers have pierced, hammered, and etched brass and copper for over a millennium. Our foundry honors these centuries-old traditions while integrating architectural precision and contemporary design principles.',
  aboutParagraph2:
    'Every lantern, chandelier, console, mirror, and decorative object begins with pure, heavy-gauge solid brass and red copper sheets. Master craftsmen meticulously draw, pierce, and chase each arabesque pattern by hand, creating luminous light fixtures and architectural accents that will endure for generations.',
  aboutParagraph3:
    'Today, Turath supplies distinguished private residences, five-star heritage hotels, luxury restaurants, and royal palaces across the Middle East, Europe, North America, and beyond with handcrafted brass, copper, and bespoke decorative metalwork (المشغولات النحاسية والديكورية).',
  aboutQuote:
    '“We do not simply shape metal; we breathe life, history, and light into every hand-pierced pattern.”',

  // Why Us
  whyUsBadge: 'The Turath Distinction',
  whyUsTitle: 'Why Choose Turath?',
  whyUsSubtitle:
    'From private luxury estates to iconic hospitality destinations, Turath is the global choice for authentic Egyptian handcrafted brass, copper, and decorative metalwork.',

  // Contact
  contactBadge: 'Direct Artisan Connection',
  contactTitle: 'Request a Project Quotation',
  contactSubtitle:
    'Connect directly with our master craftsmen and engineering team in Cairo for standard pieces, custom architectural lighting, or large-scale contract manufacturing.',
  contactPhone: '002 01016771010',
  contactWhatsApp: '+20 101 677 1010',
  contactEmail: 'turath.egypt@gmail.com',
  contactAddress: 'Gamaliya Street, Historic Cairo, Egypt',
  contactHours: 'Saturday – Thursday: 9:00 AM – 7:00 PM (GMT+2)',
};

export const DEFAULT_SITE_CONTENT: SiteContent = ensureSiteContentSections(DEFAULT_BASE_SITE_CONTENT);

const SITE_CONTENT_STORAGE_KEY = 'turath_site_content_v2';

export function getStoredSiteContent(): SiteContent {
  if (typeof window === 'undefined') return DEFAULT_SITE_CONTENT;
  try {
    const raw = localStorage.getItem(SITE_CONTENT_STORAGE_KEY);
    if (!raw) return DEFAULT_SITE_CONTENT;
    const parsed = JSON.parse(raw);
    return ensureSiteContentSections(parsed);
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
