import fs from 'fs';
import path from 'path';
import { INITIAL_PRODUCTS, PRODUCT_CATEGORIES } from './initialCatalog';
import { ProductItem } from './types';

const DATA_DIR = path.join(process.cwd(), '.server_data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

/**
 * Ensure data directory exists
 */
function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch {
      // ignore
    }
  }
}

/**
 * Retrieve current catalog server-side.
 * Falls back to INITIAL_PRODUCTS if not yet written to .server_data/products.json.
 */
export function getAllServerProducts(): ProductItem[] {
  ensureDataDir();
  if (fs.existsSync(PRODUCTS_FILE)) {
    try {
      const raw = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // Fallback to initial
    }
  }
  return INITIAL_PRODUCTS;
}

/**
 * Save or update a product in server-side storage and regenerate static feed backup
 */
export function saveServerProduct(product: ProductItem, baseUrl?: string): void {
  ensureDataDir();
  const current = getAllServerProducts();
  const idx = current.findIndex((p) => p.id === product.id);
  if (idx >= 0) {
    current[idx] = { ...current[idx], ...product };
  } else {
    current.push(product);
  }

  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(current, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write server products file:', err);
  }

  // Update static XML file in public/
  updatePublicFeedFile(current, baseUrl || 'https://turath-egypt.vercel.app');
}

/**
 * Delete a product server-side and regenerate static feed backup
 */
export function deleteServerProduct(id: string, baseUrl?: string): void {
  ensureDataDir();
  const current = getAllServerProducts();
  const filtered = current.filter((p) => p.id !== id);

  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to delete server product:', err);
  }

  updatePublicFeedFile(filtered, baseUrl || 'https://turath-egypt.vercel.app');
}

/**
 * Category mappings to Google / Meta taxonomy
 */
const CATEGORY_TAXONOMY: Record<string, { googleCategory: string; productType: string }> = {
  mirrors: {
    googleCategory: 'Home & Garden > Decor > Mirrors',
    productType: 'Decor > Mirrors > Handcrafted Brass Mirrors',
  },
  lighting: {
    googleCategory: 'Home & Garden > Lighting > Lamps & Light Fixtures',
    productType: 'Lighting > Handcrafted Chandeliers & Sconces',
  },
  tables: {
    googleCategory: 'Furniture > Tables',
    productType: 'Furniture > Tables > Handcrafted Brass Tables',
  },
  consoles: {
    googleCategory: 'Furniture > Tables > Accent Tables',
    productType: 'Furniture > Consoles > Architectural Brass Consoles',
  },
  vases: {
    googleCategory: 'Home & Garden > Decor > Vases',
    productType: 'Decor > Vases > Chiseled Brass Vases',
  },
  'decorative-objects': {
    googleCategory: 'Home & Garden > Decor',
    productType: 'Decor > Decorative Objects > Egyptian Brass Metalwork',
  },
  copper: {
    googleCategory: 'Home & Garden > Kitchen & Dining > Cookware',
    productType: 'Kitchen & Dining > Handcrafted Pure Copper',
  },
  architectural: {
    googleCategory: 'Hardware > Building Materials',
    productType: 'Architectural > Custom Metalwork & Grilles',
  },
  furniture: {
    googleCategory: 'Furniture',
    productType: 'Furniture > Handcrafted Brass & Metalwork',
  },
};

/**
 * Escape XML special characters
 */
function escapeXml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Map availability to Meta standard format
 */
function mapAvailability(avail?: string): string {
  if (!avail) return 'in stock';
  const clean = avail.toLowerCase().trim();
  if (clean === 'in_stock' || clean === 'instock') return 'in stock';
  if (clean === 'out_of_stock' || clean === 'outofstock') return 'out of stock';
  if (clean === 'pre_order' || clean === 'preorder' || clean === 'custom_only') return 'preorder';
  return 'in stock';
}

/**
 * Clean and format absolute image link
 */
function formatAbsoluteUrl(url: string, baseUrl: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${cleanBase}${cleanPath}`;
}

/**
 * Generate standard Google Merchant / Meta Product Catalog compatible XML feed
 */
export function generateMetaProductFeedXml(products: ProductItem[], baseUrl: string): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const itemsXml: string[] = [];

  for (const product of products) {
    if (!product || !product.id) continue;

    const title = product.nameEN || product.name || 'TURATH Handcrafted Brass Piece';
    const description =
      product.fullDescriptionEN ||
      product.metaDescription ||
      product.shortDescEN ||
      product.description ||
      'Handcrafted Egyptian brass & decorative metalwork by TURATH in Historic Cairo.';

    const categorySlug = product.categoryId || 'handcrafted';
    const productSlug = product.seoSlug || product.id;
    const link = `${cleanBase}/products/${categorySlug}/${productSlug}`;

    const rawMainImg = product.mainImage || (product.images && product.images[0]) || '/turath_logo.jpg';
    const imageLink = formatAbsoluteUrl(rawMainImg, cleanBase);

    // Collect additional images (up to 10 max per Meta guidelines)
    const additionalImages: string[] = [];
    if (Array.isArray(product.images)) {
      for (const img of product.images) {
        if (!img || img === rawMainImg) continue;
        const absImg = formatAbsoluteUrl(img, cleanBase);
        if (absImg && !additionalImages.includes(absImg) && additionalImages.length < 10) {
          additionalImages.push(absImg);
        }
      }
    }

    const taxonomy = CATEGORY_TAXONOMY[product.categoryId] || {
      googleCategory: 'Home & Garden > Decor',
      productType: 'Decor > Handcrafted Metalwork',
    };

    const availability = mapAvailability(product.availability);
    const brand = 'TURATH';
    const condition = 'new';

    // Parse numeric price safely without inventing fake prices
    let priceElement = '';
    if (product.price) {
      const numPrice = typeof product.price === 'number' ? product.price : parseFloat(product.price);
      if (!isNaN(numPrice) && numPrice > 0) {
        priceElement = `      <g:price>${numPrice.toFixed(2)} USD</g:price>\n`;
      }
    }

    const additionalImagesXml = additionalImages
      .map((img) => `      <g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`)
      .join('\n');

    const itemStr = `    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <g:title><![CDATA[${title} | TURATH]]></g:title>
      <g:description><![CDATA[${description}]]></g:description>
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(imageLink)}</g:image_link>
${additionalImagesXml ? additionalImagesXml + '\n' : ''}      <g:brand>${escapeXml(brand)}</g:brand>
      <g:condition>${condition}</g:condition>
      <g:availability>${availability}</g:availability>
${priceElement}      <g:google_product_category>${escapeXml(taxonomy.googleCategory)}</g:google_product_category>
      <g:product_type>${escapeXml(taxonomy.productType)}</g:product_type>
      <g:custom_label_0>Handcrafted</g:custom_label_0>
      <g:custom_label_1>Made in Egypt</g:custom_label_1>
      <g:custom_label_2>Historic Cairo Heritage</g:custom_label_2>
      <g:custom_label_3>${escapeXml(product.material || product.materials || 'Solid Brass')}</g:custom_label_3>
      <g:custom_label_4>Luxury Architectural Metalwork</g:custom_label_4>
    </item>`;

    itemsXml.push(itemStr);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>TURATH Egypt - Handcrafted Brass, Copper &amp; Decorative Metals</title>
    <link>${escapeXml(cleanBase)}</link>
    <description>Official dynamic product feed for Meta Commerce Manager and Product Catalog advertising. Featuring authentic handcrafted Egyptian brass, copper, and luxury metalwork from Historic Cairo.</description>
${itemsXml.join('\n')}
  </channel>
</rss>`;
}

/**
 * Sync and write static backup into public/meta-product-feed.xml
 */
export function updatePublicFeedFile(products: ProductItem[], baseUrl: string): void {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    const xml = generateMetaProductFeedXml(products, baseUrl);
    fs.writeFileSync(path.join(publicDir, 'meta-product-feed.xml'), xml, 'utf-8');
  } catch (err) {
    console.error('Failed to write public/meta-product-feed.xml:', err);
  }
}

/**
 * Server-side HTML injection for Social Media Crawlers (Facebook, Instagram, WhatsApp, Twitter)
 * Injects dynamic Open Graph and Twitter Card tags directly into HTML
 */
export function injectProductSocialMetadata(
  html: string,
  product: ProductItem,
  baseUrl: string,
  reqUrl: string
): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const title = `${product.nameEN || product.name || 'TURATH'} | TURATH Egypt`;
  const description =
    product.metaDescription ||
    product.shortDescEN ||
    product.fullDescriptionEN ||
    product.description ||
    'Authentic handcrafted Egyptian brass and luxury metalwork.';
  const rawImage = product.mainImage || (product.images && product.images[0]) || '/turath_logo.jpg';
  const imageUrl = formatAbsoluteUrl(rawImage, cleanBase);
  const fullPageUrl = `${cleanBase}${reqUrl.startsWith('/') ? reqUrl : '/' + reqUrl}`;

  // Replace or inject title
  let modifiedHtml = html.replace(/<title>.*?<\/title>/i, `<title>${escapeXml(title)}</title>`);

  // Replace or inject meta description
  if (modifiedHtml.includes('name="description"')) {
    modifiedHtml = modifiedHtml.replace(
      /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="description" content="${escapeXml(description)}" />`
    );
  }

  // Replace Open Graph meta tags
  const ogTags = [
    `<meta property="og:title" content="${escapeXml(title)}" />`,
    `<meta property="og:description" content="${escapeXml(description)}" />`,
    `<meta property="og:image" content="${escapeXml(imageUrl)}" />`,
    `<meta property="og:url" content="${escapeXml(fullPageUrl)}" />`,
    `<meta property="og:type" content="product" />`,
    `<meta property="og:site_name" content="TURATH Egypt" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeXml(title)}" />`,
    `<meta name="twitter:description" content="${escapeXml(description)}" />`,
    `<meta name="twitter:image" content="${escapeXml(imageUrl)}" />`,
  ].join('\n    ');

  // Replace canonical
  if (modifiedHtml.includes('rel="canonical"')) {
    modifiedHtml = modifiedHtml.replace(
      /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i,
      `<link rel="canonical" href="${escapeXml(fullPageUrl)}" />`
    );
  }

  // Remove existing static og tags to avoid duplicates
  modifiedHtml = modifiedHtml
    .replace(/<meta\s+property=["']og:title["'][^>]*>/gi, '')
    .replace(/<meta\s+property=["']og:description["'][^>]*>/gi, '')
    .replace(/<meta\s+property=["']og:image["'][^>]*>/gi, '')
    .replace(/<meta\s+property=["']og:url["'][^>]*>/gi, '')
    .replace(/<meta\s+property=["']og:type["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']twitter:card["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']twitter:title["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']twitter:description["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']twitter:image["'][^>]*>/gi, '');

  // Inject before </head>
  return modifiedHtml.replace('</head>', `    ${ogTags}\n  </head>`);
}
