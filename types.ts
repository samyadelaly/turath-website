export interface CategorySpecificFields {
  // Mirrors
  mirrorType?: string;
  mirrorShape?: string;
  frameMaterial?: string;
  frameTechnique?: string;
  glassType?: string;
  mounting?: string;
  orientation?: string;

  // Chandeliers
  chandelierType?: string;
  numberOfLights?: string | number;
  bulbType?: string;
  voltage?: string;
  wattage?: string;
  bulbIncluded?: boolean | string;
  suspensionType?: string;
  suspensionLength?: string;

  // Wall Lights (Appliques)
  lightType?: string;
  numberOfBulbs?: string | number;
  lightDirection?: string;
  projection?: string;
  lightingEffect?: string;

  // Tables
  tableType?: string;
  shape?: string;
  topMaterial?: string;
  baseMaterial?: string;
  glassMarbleType?: string;

  // Consoles
  consoleType?: string;
  legDesign?: string;

  // Door Handles
  handleType?: string;
  doorType?: string;
  backplate?: string;
  mountingType?: string;
  lockCompatibility?: string;

  // Handrails
  handrailType?: string;
  profile?: string;
  balusterType?: string;
  projectQuantity?: string;
  architecturalSpecification?: string;

  // Lanterns
  lanternType?: string;
  pattern?: string;
  perforationStyle?: string;
  lightSource?: string;
  indoorOutdoor?: string;
  style?: string;

  // Catch-all for other category-specific attributes
  [key: string]: any;
}

export interface ProductItem {
  // Unique Product Identity & SKU
  id: string; // e.g. "TR-MIR-001" or "turath-mirror-01"
  sku?: string; // Explicit SKU if distinct from ID
  categoryId: string;

  // Core Names & Descriptions (Bilingual)
  name: string; // compatibility (EN fallback)
  nameEN: string;
  nameAR?: string;
  tagline: string; // compatibility (shortDesc fallback)
  shortDescEN?: string;
  shortDescAR?: string;
  description: string; // compatibility (fullDescription fallback)
  fullDescriptionEN?: string;
  fullDescriptionAR?: string;
  story?: string;

  // Product Images (Completely independent for each product)
  mainImage: string; // Primary hero image
  images: string[]; // All images [mainImage, ...gallery]
  galleryImages?: string[]; // Optional secondary array
  imageAltEN?: string;
  imageAltAR?: string;
  imageCaption?: string;

  // Material & Finishes
  material?: string; // Yellow Brass, Red Copper, Brass + Copper, etc.
  materials: string; // compatibility
  materialDetails?: string;
  finish?: string; // Primary finish name
  finishOptions: string[]; // List of available finishes
  finishDetails?: string;

  // Craftsmanship
  craftTechnique?: string;
  techniqueDetails?: string;

  // Dimensions
  dimensions: string; // Summary string for quick card display
  height?: string;
  width?: string;
  depth?: string;
  diameter?: string;
  weight?: string;
  customDimensions?: string;

  // Customization Options
  customSize?: string;
  customDesign?: string;
  customFinish?: string;
  customDetails?: string;

  // Availability & Lead Time
  availability?: 'in_stock' | 'made_to_order' | 'custom_only' | 'limited_edition' | string;
  leadTime?: string;

  // Media
  videoUrl?: string;
  productVideo?: string;

  // Applications (Hotels, Palaces, Villas, etc.)
  applications?: string[];

  // Pricing
  price?: string;
  priceType?: 'fixed' | 'starting_from' | 'quote';

  // Visibility & Highlight Status
  featured?: boolean;
  visibility?: 'published' | 'draft' | 'hidden';

  // SEO & Social Sharing
  seoSlug: string;
  seoTitle?: string;
  metaDescription?: string;
  seoKeywords?: string;

  // Inquiry & Contact Prefill
  whatsappMessage?: string;

  // Cross-sell & Related Products
  relatedProductIds?: string[];

  // Category Specific Specifications
  categoryFields?: CategorySpecificFields;

  // Internal audit
  updatedAt?: string;
}

export interface ProductCategoryInfo {
  id: string;
  name: string;
  nameArabic?: string;
  shortDesc: string;
  description: string;
  coverImage: string;
  iconName: string;
}

export interface InquiryFormData {
  name: string;
  mobile: string;
  email: string;
  productCategory?: string;
  productName?: string;
  notes: string;
}
