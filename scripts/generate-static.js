import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const BASE_URL = 'https://turath-egypt.vercel.app';

const publicDir = path.join(rootDir, 'public');
const productsOutputDir = path.join(publicDir, 'products');
const productsDataPath = path.join(rootDir, 'data', 'products.json');

// Ensure output directories exist
fs.mkdirSync(productsOutputDir, { recursive: true });

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\r?\n/g, ' ')
    .trim();
}

function getMimeType(filePath) {
  const ext = path.extname(filePath.split('?')[0]).toLowerCase();
  switch (ext) {
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.svg':
      return 'image/svg+xml';
    case '.gif':
      return 'image/gif';
    case '.jpg':
    case '.jpeg':
    default:
      return 'image/jpeg';
  }
}

// Categories definitions matching all HTML pages and metadata
const CATEGORIES = [
  {
    slug: 'lighting',
    file: 'lighting.html',
    title: 'Lighting Fixtures',
    titleAr: 'وحدات إضاءة نحاسية معمارية',
    defaultKeywords: 'نحاس، نجف، أبليك، إضاءة معمارية، صناعة يدوية، ورشة تراث، سامي عادل، القاهرة التاريخية، Turath, Brass Lighting, Wall Sconce, Hammered Brass, Handcrafted Metalwork, Egyptian Heritage'
  },
  {
    slug: 'mirrors',
    file: 'mirrors.html',
    title: 'Solid Brass Mirrors',
    titleAr: 'مرايا نحاس أصفر مصمت',
    defaultKeywords: 'مرايا، مرايات نحاس، أرابيسك، زخارف إسلامية، نحاس مفرغ، صناعة يدوية، تراث، Turath, Brass Mirror, Islamic Star Filigree, Handcrafted Mirrors, Architectural Brass, Historic Cairo'
  },
  {
    slug: 'tables',
    file: 'tables.html',
    title: 'Tables & Consoles',
    titleAr: 'طاولات وكونسول نحاسي فاخر',
    defaultKeywords: 'طاولات نحاس، كونسول، طاولات جانبية، أثاث نحاسي فاخر، سبك نحاس، تراث، Turath, Brass Table, Console, Cylinder Table, Luxury Furniture, Bespoke Metalwork, Cairo Atelier'
  },
  {
    slug: 'handles',
    file: 'handles.html',
    title: 'Architectural Handles',
    titleAr: 'مقابض أبواب نحاسية معمارية',
    defaultKeywords: 'مقابض أبواب، مقابض نحاس، سبك نحاس، إكسسوارات معمارية، نحاس مصمت، تراث، Turath, Door Pulls, Brass Handles, Architectural Hardware, Sand Casting, Luxury Villas'
  },
  {
    slug: 'handrails',
    file: 'handrails.html',
    title: 'Custom Handrails',
    titleAr: 'درابزين سلالم نحاسي مخصص',
    defaultKeywords: 'درابزين نحاس، هاندريل، سلالم قصور، رخام ونحاس، قواطع زخرفية، تراث، Turath, Handrail, Balustrade, Pierced Brass, Marble Architecture, Luxury Interiors'
  },
  {
    slug: 'decor',
    file: 'decor.html',
    title: 'Decorative Objects',
    titleAr: 'تحف وصواني ديكور نحاسية',
    defaultKeywords: 'أطباق نحاس، صواني معلقة، تحف نحاسية، حفر على النحاس، فنون إسلامية، خان الخليلي، تراث، Turath, Wall Charger, Brass Plate, Arabesque Relief, Islamic Antiques, Egyptian Artisans'
  },
  {
    slug: 'wall-art',
    file: 'wall-art.html',
    title: 'Brass & Copper Wall Art',
    titleAr: 'لوحات جدارية من النحاس الأصفر والأحمر',
    defaultKeywords: 'لوحات نحاس، تجليد حوائط، نحاس بارز، فنون معدنية، ديكور جداري، تراث، Turath, Brass Wall Art, Metal Relief, Botanical Sculpture, Hand-hammered Copper, Wall Cladding'
  },
  {
    slug: 'partitions',
    file: 'partitions.html',
    title: 'Partitions & Screens',
    titleAr: 'قواطع وفواصل ديكور نحاسية',
    defaultKeywords: 'قواطع نحاسية، بارتشن، مشربية، زجاج عنبري، فواصل ديكور، تراث، Turath, Brass Partitions, Screens, Mashrabiya, Amber Glass, Space Dividers, Architectural Metal'
  },
  {
    slug: 'tableware',
    file: 'tableware.html',
    title: 'Luxury Tableware',
    titleAr: 'أدوات مائدة وأواني ضيافة نحاسية',
    defaultKeywords: 'أواني نحاسية، أدوات مائدة، صواني تقديم، نحاس أصفر وأحمر، سبك وفورجينج، تراث، Turath, Luxury Tableware, Brass Vessels, Hand-cast Hollowware, Artisanal Dining'
  },
  {
    slug: 'masterpieces',
    file: 'masterpieces.html',
    title: 'Architectural Masterpieces',
    titleAr: 'روائع نحاسية معمارية نادرة',
    defaultKeywords: 'تحف نحاسية، أعمال معمارية نادرة، كونسول نحاس منحوت، سبك نحاس عضوي، ورشة تراث، Turath, Masterpieces, Sculptural Brass, Luxury Atelier, Historic Cairo'
  },
  {
    slug: 'action',
    file: 'action.html',
    title: 'Turath in Action',
    titleAr: 'حرفية النحاس في ورش تراث التاريخية',
    defaultKeywords: 'ورشة تراث، تصنيع نحاس يدوي، تشكيل معادن، فن الريبوسيه، تخريم يدوي، باتينا، القاهرة التاريخية، Turath in Action, Egyptian Metalcraft, Artisans at Work, Handcrafted Metalwork'
  }
];

// Load existing products.json if available to preserve custom Arabic data
let existingProductsData = { categories: {} };
if (fs.existsSync(productsDataPath)) {
  try {
    existingProductsData = JSON.parse(fs.readFileSync(productsDataPath, 'utf8'));
  } catch (err) {
    console.warn(`Warning: Could not parse ${productsDataPath}, proceeding with defaults.`);
  }
}

// Build consolidated products catalog
const consolidatedCatalog = { categories: {} };
let totalGenerated = 0;

for (const cat of CATEGORIES) {
  const htmlFilePath = path.join(rootDir, cat.file);
  let rawItems = [];

  if (fs.existsSync(htmlFilePath)) {
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    const match = htmlContent.match(/(?:const|let|var)\s+(sliderData|masterpiecesData|filmsData)\s*=\s*(\[[\s\S]*?\n\s*\]);/);
    if (match) {
      try {
        const sandbox = {};
        vm.runInNewContext('data = ' + match[2], sandbox);
        if (Array.isArray(sandbox.data)) {
          rawItems = sandbox.data;
        }
      } catch (e) {
        console.error(`Error parsing data array in ${cat.file}:`, e.message);
      }
    }
  }

  // Cross-reference with existing products.json category items
  const existingCategory = existingProductsData.categories && existingProductsData.categories[cat.slug];
  const existingItemsMap = new Map();
  if (existingCategory && Array.isArray(existingCategory.items)) {
    for (const item of existingCategory.items) {
      if (item.id) existingItemsMap.set(item.id, item);
    }
  }

  const categoryItems = [];

  for (let idx = 0; idx < rawItems.length; idx++) {
    const raw = rawItems[idx];
    const productId = raw.id || `${cat.slug}-item-${idx + 1}`;
    const existing = existingItemsMap.get(productId) || {};

    const productTitle = (existing.title || raw.title || `Turath ${cat.title} Item ${idx + 1}`).trim();
    const productTitleAr = (existing.titleAr || raw.titleAr || productTitle).trim();
    const productDesc = (existing.description || raw.desc || raw.description || `Handcrafted ${cat.title.toLowerCase()} forged in solid brass and copper by master artisans in Cairo, Egypt.`).trim();
    const productDescAr = (existing.descriptionAr || raw.descriptionAr || productDesc).trim();
    const keywords = (existing.keywords || cat.defaultKeywords).trim();

    // Image resolution: for videos (.mp4), provide a high-resolution poster image
    let rawImg = (existing.image || raw.poster || raw.src || raw.image || '').trim();
    if (!rawImg || rawImg.toLowerCase().endsWith('.mp4')) {
      rawImg = '/assets/images/commute-poster.jpg';
    }

    // Clean image path (remove query params for path resolution, ensure single leading slash)
    let cleanImagePath = rawImg.split('?')[0].replace(/^(\.\.?\/)+/, '');
    if (!cleanImagePath.startsWith('/')) {
      cleanImagePath = '/' + cleanImagePath;
    }

    const fullImageUrl = `${BASE_URL}${cleanImagePath}`;
    const fullProductUrl = `${BASE_URL}/products/${productId}/`;
    const canonicalUrl = `${BASE_URL}/${cat.slug}.html`;
    const redirectUrl = `/${cat.slug}.html?product=${productId}`;
    const imageMimeType = getMimeType(cleanImagePath);

    const consolidatedItem = {
      id: productId,
      title: productTitle,
      titleAr: productTitleAr,
      description: productDesc,
      descriptionAr: productDescAr,
      keywords: keywords,
      image: cleanImagePath,
      categorySlug: cat.slug
    };
    categoryItems.push(consolidatedItem);

    // Generate static HTML SSG page for EVERY product
    const itemDir = path.join(productsOutputDir, productId);
    fs.mkdirSync(itemDir, { recursive: true });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(productTitle)} | Turath Egypt</title>
  <meta name="description" content="${escapeHtml(productDesc)}">
  <meta name="keywords" content="${escapeHtml(keywords)}">
  <link rel="canonical" href="${canonicalUrl}">

  <!-- Open Graph / Facebook / WhatsApp / LinkedIn (Must have absolute URLs) -->
  <meta property="og:site_name" content="Turath Egypt">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${fullProductUrl}">
  <meta property="og:title" content="${escapeHtml(productTitle)} | Turath Egypt">
  <meta property="og:description" content="${escapeHtml(productDesc)}">
  <meta property="og:image" content="${fullImageUrl}">
  <meta property="og:image:secure_url" content="${fullImageUrl}">
  <meta property="og:image:type" content="${imageMimeType}">
  <meta property="og:image:alt" content="${escapeHtml(productTitle)}">
  <meta property="og:locale" content="en_US">
  <meta property="og:locale:alternate" content="ar_EG">

  <!-- Twitter Card / X -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${fullProductUrl}">
  <meta name="twitter:title" content="${escapeHtml(productTitle)} | Turath Egypt">
  <meta name="twitter:description" content="${escapeHtml(productDesc)}">
  <meta name="twitter:image" content="${fullImageUrl}">
  <meta name="twitter:image:alt" content="${escapeHtml(productTitle)}">

  <!-- Schema.org JSON-LD Structured Data for Search Engines -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": ${JSON.stringify(productTitle)},
    "description": ${JSON.stringify(productDesc)},
    "image": ${JSON.stringify(fullImageUrl)},
    "url": ${JSON.stringify(fullProductUrl)},
    "brand": {
      "@type": "Brand",
      "name": "Turath"
    },
    "category": ${JSON.stringify(cat.title)},
    "offers": {
      "@type": "Offer",
      "priceCurrency": "EGP",
      "availability": "https://schema.org/InStock",
      "url": ${JSON.stringify(canonicalUrl)}
    }
  }
  </script>

  <!-- Instant Client-Side Redirect to Category Collection Page -->
  <script>
    window.location.replace("${redirectUrl}");
  </script>
  <noscript>
    <meta http-equiv="refresh" content="0;url=${redirectUrl}">
  </noscript>
</head>
<body style="background: #000; color: #fff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
  <p>Redirecting to <a href="${redirectUrl}" style="color: #D7C797;">${escapeHtml(productTitle)}</a>...</p>
</body>
</html>
`;

    fs.writeFileSync(path.join(itemDir, 'index.html'), html, 'utf8');
    totalGenerated++;
  }

  consolidatedCatalog.categories[cat.slug] = {
    title: cat.title,
    titleAr: cat.titleAr,
    items: categoryItems
  };
}

// Persist the consolidated products catalog back to data/products.json
fs.mkdirSync(path.dirname(productsDataPath), { recursive: true });
fs.writeFileSync(productsDataPath, JSON.stringify(consolidatedCatalog, null, 2), 'utf8');

console.log(`\n======================================================`);
console.log(`Successfully generated ${totalGenerated} product SSG pages!`);
console.log(`All Open Graph & Twitter meta tags injected with absolute URLs.`);
console.log(`Consolidated catalog saved to: ${productsDataPath}`);
console.log(`======================================================\n`);
