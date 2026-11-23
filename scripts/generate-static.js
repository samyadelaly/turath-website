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
const distDir = path.join(rootDir, 'dist');
const distProductsOutputDir = path.join(distDir, 'products');
const productsDataPath = path.join(rootDir, 'data', 'products.json');

// Ensure output directories exist
fs.mkdirSync(productsOutputDir, { recursive: true });
if (fs.existsSync(distDir)) {
  fs.mkdirSync(distProductsOutputDir, { recursive: true });
}

// Extract actual compiled CSS asset path produced by Vite from dist/index.html
const distIndexHtmlPath = path.join(distDir, 'index.html');
if (!fs.existsSync(distIndexHtmlPath)) {
  console.error('\n[FATAL ERROR] dist/index.html not found! Vite build must complete successfully before running generate-static.js.\n');
  process.exit(1);
}

const distIndexHtml = fs.readFileSync(distIndexHtmlPath, 'utf8');
const cssLinkMatch = distIndexHtml.match(/<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']*style-[^"']+\.css)["'][^>]*>/i)
  || distIndexHtml.match(/<link\s+[^>]*href=["']([^"']*style-[^"']+\.css)["'][^>]*rel=["']stylesheet["'][^>]*>/i);

if (!cssLinkMatch || !cssLinkMatch[1]) {
  console.error('\n[FATAL ERROR] Could not find a valid compiled CSS stylesheet link (style-*.css) in dist/index.html!\n');
  process.exit(1);
}

const rawCssHref = cssLinkMatch[1];
const compiledCssFileName = path.basename(rawCssHref);
const physicalCssPath = path.join(distDir, 'assets', compiledCssFileName);

if (!fs.existsSync(physicalCssPath)) {
  console.error(`\n[FATAL ERROR] Extracted CSS asset file "${compiledCssFileName}" does not exist in ${path.join(distDir, 'assets')}!\n`);
  process.exit(1);
}

console.log(`[generate-static] Successfully resolved compiled CSS from dist/index.html: ${compiledCssFileName}`);

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
    titleAr: 'وحدات إضاءة وثريات نحاسية فاخرة',
    defaultKeywords: 'نحاس، نجف، أبليك، إضاءة فاخرة، دلايات نحاس، صناعة يدوية، ورشة تراث، سامي عادل، القاهرة التاريخية, Turath, Brass Lighting, Wall Sconce, Hammered Brass, Handcrafted Metalwork, Egyptian Heritage, ورشة نحاس بالجمالية, تشكيل نحاس عمولة, ديكورات نحاسية, تصنيع نجف عمولة, Custom brass fabrication, Handcrafted copper decor, Bespoke metalwork, تصنيع نحاس يدوي'
  },
  {
    slug: 'mirrors',
    file: 'mirrors.html',
    title: 'Solid Brass Mirrors',
    titleAr: 'مرايا نحاس أصفر فاخرة',
    defaultKeywords: 'مرايا، مرايات نحاس، مفرغ إسلامي، زخارف إسلامية، نحاس مفرغ، صناعة يدوية، تراث, Turath, Brass Mirror, Islamic Star Filigree, Handcrafted Mirrors, Bespoke Brass, Historic Cairo, ورشة نحاس بالجمالية, تشكيل نحاس عمولة, ديكورات نحاسية, تصنيع نجف عمولة, Custom brass fabrication, Handcrafted copper decor, Bespoke metalwork, تصنيع نحاس يدوي'
  },
  {
    slug: 'tables',
    file: 'tables.html',
    title: 'Tables & Consoles',
    titleAr: 'طاولات وكونسول نحاسي فاخر',
    defaultKeywords: 'طاولات نحاس، كونسول، طاولات جانبية، أثاث نحاسي فاخر، سبك نحاس، تراث, Turath, Brass Table, Console, Cylinder Table, Luxury Furniture, Bespoke Metalwork, Cairo Atelier, ورشة نحاس بالجمالية, تشكيل نحاس عمولة, ديكورات نحاسية, تصنيع نجف عمولة, Custom brass fabrication, Handcrafted copper decor, Bespoke metalwork, تصنيع نحاس يدوي'
  },
  {
    slug: 'handles',
    file: 'handles.html',
    title: 'Bespoke Brass Handles',
    titleAr: 'مقابض أبواب نحاسية فاخرة',
    defaultKeywords: 'مقابض أبواب، مقابض نحاس، سبك نحاس، إكسسوارات فاخرة، نحاس خالص، تراث, Turath, Door Pulls, Brass Handles, Luxury Hardware, Sand Casting, Luxury Villas, ورشة نحاس بالجمالية, تشكيل نحاس عمولة, ديكورات نحاسية, تصنيع نجف عمولة, Custom brass fabrication, Handcrafted copper decor, Bespoke metalwork, تصنيع نحاس يدوي'
  },
  {
    slug: 'handrails',
    file: 'handrails.html',
    title: 'Custom Handrails',
    titleAr: 'درابزين سلالم نحاسي مخصص',
    defaultKeywords: 'درابزين نحاس، هاندريل، سلالم قصور، رخام ونحاس، قواطع زخرفية، تراث, Turath, Handrail, Balustrade, Pierced Brass, Marble Architecture, Luxury Interiors, ورشة نحاس بالجمالية, تشكيل نحاس عمولة, ديكورات نحاسية, تصنيع نجف عمولة, Custom brass fabrication, Handcrafted copper decor, Bespoke metalwork, تصنيع نحاس يدوي'
  },
  {
    slug: 'decor',
    file: 'decor.html',
    title: 'Decorative Objects',
    titleAr: 'تحف وصواني ديكور نحاسية',
    defaultKeywords: 'أطباق نحاس، صواني معلقة، تحف نحاسية، حفر على النحاس، فنون إسلامية، خان الخليلي، تراث, Turath, Wall Charger, Brass Plate, Geometric & Floral Relief, Islamic Antiques, Egyptian Artisans, ورشة نحاس بالجمالية, تشكيل نحاس عمولة, ديكورات نحاسية, تصنيع نجف عمولة, Custom brass fabrication, Handcrafted copper decor, Bespoke metalwork, تصنيع نحاس يدوي'
  },
  {
    slug: 'wall-art',
    file: 'wall-art.html',
    title: 'Brass & Copper Wall Art',
    titleAr: 'لوحات جدارية من النحاس الأصفر والأحمر',
    defaultKeywords: 'لوحات نحاس، تجليد حوائط، نحاس بارز، فنون معدنية، ديكور جداري، تراث, Turath, Brass Wall Art, Metal Relief, Botanical Sculpture, Hand-hammered Copper, Wall Cladding, ورشة نحاس بالجمالية, تشكيل نحاس عمولة, ديكورات نحاسية, تصنيع نجف عمولة, Custom brass fabrication, Handcrafted copper decor, Bespoke metalwork, تصنيع نحاس يدوي'
  },
  {
    slug: 'partitions',
    file: 'partitions.html',
    title: 'Partitions & Screens',
    titleAr: 'قواطع وفواصل ديكور نحاسية',
    defaultKeywords: 'قواطع نحاسية، بارتشن، مشربية، زجاج عنبري، فواصل ديكور، تراث, Turath, Brass Partitions, Screens, Mashrabiya, Amber Glass, Space Dividers, Bespoke Metal, ورشة نحاس بالجمالية, تشكيل نحاس عمولة, ديكورات نحاسية, تصنيع نجف عمولة, Custom brass fabrication, Handcrafted copper decor, Bespoke metalwork, تصنيع نحاس يدوي'
  },
  {
    slug: 'tableware',
    file: 'tableware.html',
    title: 'Luxury Tableware',
    titleAr: 'أدوات مائدة وأواني ضيافة نحاسية',
    defaultKeywords: 'أواني نحاسية، أدوات مائدة، صواني تقديم، نحاس أصفر وأحمر، سبك وفورجينج، تراث, Turath, Luxury Tableware, Brass Vessels, Hand-cast Hollowware, Artisanal Dining, ورشة نحاس بالجمالية, تشكيل نحاس عمولة, ديكورات نحاسية, تصنيع نجف عمولة, Custom brass fabrication, Handcrafted copper decor, Bespoke metalwork, تصنيع نحاس يدوي'
  },
  {
    slug: 'masterpieces',
    file: 'masterpieces.html',
    title: 'Signature Masterpieces',
    titleAr: 'روائع نحاسية فنية نادرة',
    defaultKeywords: 'تحف نحاسية، أعمال فنية نادرة، كونسول نحاس منحوت، سبك نحاس عضوي، ورشة تراث, Turath, Masterpieces, Sculptural Brass, Luxury Atelier, Historic Cairo, ورشة نحاس بالجمالية, تشكيل نحاس عمولة, ديكورات نحاسية, تصنيع نجف عمولة, Custom brass fabrication, Handcrafted copper decor, Bespoke metalwork, تصنيع نحاس يدوي'
  },
  {
    slug: 'action',
    file: 'action.html',
    title: 'Turath in Action',
    titleAr: 'حرفية النحاس في ورش تراث التاريخية',
    defaultKeywords: 'ورشة تراث، تصنيع نحاس يدوي، تشكيل معادن، فن الريبوسيه، تخريم يدوي، باتينا، القاهرة التاريخية, Turath in Action, Egyptian Metalcraft, Artisans at Work, Handcrafted Metalwork, ورشة نحاس بالجمالية, تشكيل نحاس عمولة, ديكورات نحاسية, تصنيع نجف عمولة, Custom brass fabrication, Handcrafted copper decor, Bespoke metalwork, تصنيع نحاس يدوي'
  }
];

if (!fs.existsSync(productsDataPath)) {
  console.error(`Error: Products data file not found at ${productsDataPath}`);
  process.exit(1);
}

const productsData = JSON.parse(fs.readFileSync(productsDataPath, 'utf8'));

// Extract action videos and posters from action.html
let actionFilms = [];
const distActionHtmlPath = path.join(distDir, 'action.html');
const actionHtmlPath = fs.existsSync(distActionHtmlPath) ? distActionHtmlPath : path.join(rootDir, 'action.html');
if (fs.existsSync(actionHtmlPath)) {
  const actionContent = fs.readFileSync(actionHtmlPath, 'utf8');
  const filmsMatch = actionContent.match(/const\s+filmsData\s*=\s*(\[[\s\S]*?\]);/);
  if (filmsMatch) {
    try {
      actionFilms = eval(filmsMatch[1]);
    } catch (e) {}
  }
}

let totalGenerated = 0;

for (const cat of CATEGORIES) {
  const distCatPath = path.join(distDir, cat.file);
  const rootCatPath = path.join(rootDir, cat.file);
  const categoryFilePath = fs.existsSync(distCatPath) ? distCatPath : rootCatPath;
  if (!fs.existsSync(categoryFilePath)) continue;

  const baseHtml = fs.readFileSync(categoryFilePath, 'utf8');
  const catItems = (productsData.categories[cat.slug] && productsData.categories[cat.slug].items) || [];

  for (let idx = 0; idx < catItems.length; idx++) {
    const item = catItems[idx];
    const productId = item.id;
    const prevItem = catItems[(idx - 1 + catItems.length) % catItems.length];
    const nextItem = catItems[(idx + 1) % catItems.length];

    const fullProductUrl = `${BASE_URL}/products/${productId}/`;
    const canonicalTargetUrl = item.isShowcaseOf || (item.canonicalUrl ? `${BASE_URL}${item.canonicalUrl}` : fullProductUrl);
    const fullImageUrl = `${BASE_URL}${item.image}`;
    const imageMimeType = getMimeType(item.image);
    const bilingualTitle = `${item.title} | ${item.titleAr} | TURATH — Bespoke Solid Brass & Copper`;
    const bilingualDesc = `${item.desc || item.description || ''} — ${item.descAr || item.descriptionAr || ''}`.trim();
    const imageAlt = `${item.title} - ${item.titleAr} | Handcrafted Solid Brass & Copper | ورشة تراث مصر`;

    // WhatsApp pre-filled text
    const waText = encodeURIComponent(`مرحباً ورشة تراث مصر، أود الاستفسار عن: ${item.title} (${item.titleAr})\nالرابط: ${fullProductUrl}`);
    const waLink = `https://wa.me/201016771010?text=${waText}`;

    // Start from the category baseHtml so it retains the exact full-screen luxury UI
    let pageHtml = baseHtml;

    // 1. Ensure <base href="/"> is in <head>
    if (!pageHtml.includes('<base href="/">')) {
      pageHtml = pageHtml.replace('<head>', '<head>\n  <base href="/">');
    }

    // Ensure product page links to the verified compiled CSS asset
    pageHtml = pageHtml.replace(
      /<link\s+rel=["']stylesheet["']\s+crossorigin\s+href=["'][^"']*style-[^"']+\.css["']\s*\/?>/i,
      `<link rel="stylesheet" crossorigin href="./assets/${compiledCssFileName}">`
    ).replace(
      /<link\s+rel=["']stylesheet["']\s+href=["'][^"']*(?:\.\/)?src\/style\.css["']\s*\/?>/i,
      `<link rel="stylesheet" crossorigin href="./assets/${compiledCssFileName}">`
    );

    // Normalize Service Worker registration line to LF to prevent trailing carriage return whitespace in git diff
    pageHtml = pageHtml.replace(
      /([^\n\r]*navigator\.serviceWorker\.register[^\n\r]*)\r\n/g,
      '$1\n'
    );

    // 2. Remove inherited category-level hreflang tags from standalone product pages
    pageHtml = pageHtml.replace(/\s*<link\s+rel=["']alternate["']\s+hreflang=["'][^"']*["']\s+href=["'][^"']*["']\s*\/?>/gi, '');
    pageHtml = pageHtml.replace(/\s*<link\s+rel=["']alternate["']\s+href=["'][^"']*["']\s+hreflang=["'][^"']*["']\s*\/?>/gi, '');

    // 3. Set Canonical URL (Self-Referencing or Primary Product Target for Showcase Duplicates)
    pageHtml = pageHtml.replace(/<link\s+rel="canonical"\s+href="[^"]*"/i, `<link rel="canonical" href="${canonicalTargetUrl}"`);

    // 4. Set unique <title> and meta description
    pageHtml = pageHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(bilingualTitle)}</title>`);
    pageHtml = pageHtml.replace(/<meta\s+name="description"\s+content="[^"]*"/i, `<meta name="description" content="${escapeHtml(bilingualDesc)}"`);

    // 5. Update Open Graph and Twitter Card tags with product-specific image and alt
    pageHtml = pageHtml.replace(/<meta\s+property="og:url"\s+content="[^"]*"/i, `<meta property="og:url" content="${fullProductUrl}"`);
    pageHtml = pageHtml.replace(/<meta\s+property="og:title"\s+content="[^"]*"/i, `<meta property="og:title" content="${escapeHtml(bilingualTitle)}"`);
    pageHtml = pageHtml.replace(/<meta\s+property="og:description"\s+content="[^"]*"/i, `<meta property="og:description" content="${escapeHtml(bilingualDesc)}"`);
    pageHtml = pageHtml.replace(/<meta\s+property="og:image"\s+content="[^"]*"/i, `<meta property="og:image" content="${fullImageUrl}"`);
    pageHtml = pageHtml.replace(/<meta\s+property="og:image:secure_url"\s+content="[^"]*"/i, `<meta property="og:image:secure_url" content="${fullImageUrl}"`);
    pageHtml = pageHtml.replace(/<meta\s+property="og:image:alt"\s+content="[^"]*"/i, `<meta property="og:image:alt" content="${escapeHtml(imageAlt)}"`);
    pageHtml = pageHtml.replace(/<meta\s+property="og:type"\s+content="[^"]*"/i, `<meta property="og:type" content="product"`);

    pageHtml = pageHtml.replace(/<meta\s+name="twitter:url"\s+content="[^"]*"/i, `<meta name="twitter:url" content="${fullProductUrl}"`);
    pageHtml = pageHtml.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"/i, `<meta name="twitter:title" content="${escapeHtml(bilingualTitle)}"`);
    pageHtml = pageHtml.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"/i, `<meta name="twitter:description" content="${escapeHtml(bilingualDesc)}"`);
    pageHtml = pageHtml.replace(/<meta\s+name="twitter:image"\s+content="[^"]*"/i, `<meta name="twitter:image" content="${fullImageUrl}"`);
    pageHtml = pageHtml.replace(/<meta\s+name="twitter:image:alt"\s+content="[^"]*"/i, `<meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}"`);

    // 6. Inject Product + Manufacturer JSON-LD Schema (No fabricated prices, valid Made-to-Order craftsmanship)
    const productJsonLd = `
  <!-- Product & Manufacturer JSON-LD Schema (Cleaned Multi-Market Taxonomy) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "TURATH Home",
            "item": "${BASE_URL}/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": ${JSON.stringify(cat.title)},
            "item": "${BASE_URL}/${cat.file}"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": ${JSON.stringify(item.title)},
            "item": "${fullProductUrl}"
          }
        ]
      },
      {
        "@type": "Product",
        "@id": ${JSON.stringify(canonicalTargetUrl)},
        "name": ${JSON.stringify(item.title)},
        "alternateName": ${JSON.stringify(item.titleAr)},
        "description": ${JSON.stringify(bilingualDesc)},
        "image": ${JSON.stringify(fullImageUrl)},
        "url": ${JSON.stringify(canonicalTargetUrl)},
        "category": ${JSON.stringify(cat.title)},
        "material": "Solid Brass & Copper (نحاس أصفر وأحمر خالص عالي النقاء)",
        "keywords": "solid brass, unlacquered brass, bespoke brass, antique brass, hammered copper, Egypt, GCC, Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, Oman, Africa, نحاس أصفر خالص, نحاس أحمر نقي, سبك نحاس, تشطيبات فاخرة, ورشة نحاس بالجمالية, المهندس سامي عادل",
        "brand": {
          "@type": "Brand",
          "name": "TURATH EGYPT"
        },
        "manufacturer": {
          "@type": "Organization",
          "logo": "${BASE_URL}/turath-brand-logo.jpg",
          "name": "Turath Egypt - ورشة تراث لتصنيع النحاس",
          "url": "${BASE_URL}/",
          "foundingDate": "2012",
          "areaServed": [
            { "@type": "Country", "name": "Egypt" },
            { "@type": "Country", "name": "Saudi Arabia" },
            { "@type": "Country", "name": "United Arab Emirates" },
            { "@type": "Country", "name": "Kuwait" },
            { "@type": "Country", "name": "Qatar" },
            { "@type": "Country", "name": "United States" },
            { "@type": "Country", "name": "United Kingdom" }
          ]
        }
      }
    ]
  }
  </script>
`;

    // Replace category CollectionPage schema with Product schema
    if (/<!-- CollectionPage[\s\S]*?<\/script>/i.test(pageHtml)) {
      pageHtml = pageHtml.replace(/<!-- CollectionPage[\s\S]*?<\/script>/i, productJsonLd.trim());
    } else {
      pageHtml = pageHtml.replace('</head>', `${productJsonLd}\n</head>`);
    }

    // 6. Pre-render initial Product Content in the DOM:
    // Back button in Top Navbar points to category collection
    pageHtml = pageHtml.replace(
      /<a\s+href="[^"]*"\s+class="[^"]*arrow-turath[^"]*"\s+aria-label="[^"]*">/,
      `<a href="/${cat.file}" class="justify-self-start arrow-turath text-[#D7C797] text-3xl font-light hover:opacity-70 transition-opacity cursor-pointer leading-none" aria-label="Back to ${escapeHtml(cat.title)} Collection">`
    );

    const itemSrc = item.image || item.src || '';
    const desktopSrc = item.desktopSrc || (itemSrc ? itemSrc.replace(/\.jpg$/, '-desktop.jpg') : '');
    const itemDesc = item.desc || item.description || '';

    // WhatsApp button with product-specific inquiry
    pageHtml = pageHtml.replace(
      /id="product-wa-btn"\s+href="[^"]*"/,
      `id="product-wa-btn" href="${waLink}"`
    );

    // Initial Title & Description
    pageHtml = pageHtml.replace(
      /<h1\s+id="slider-title"[^>]*>[\s\S]*?<\/h1>/i,
      `<h1 id="slider-title" class="text-lg md:text-xl lg:text-3xl xl:text-4xl font-bold tracking-[0.2em] text-white uppercase text-center drop-shadow-md">${escapeHtml(item.title)}</h1>`
    );
    pageHtml = pageHtml.replace(
      /<p\s+id="slider-desc"[^>]*>[\s\S]*?<\/p>/i,
      `<p id="slider-desc" class="text-white/90 text-sm md:text-base lg:text-lg font-light tracking-wide text-center max-w-md lg:max-w-2xl drop-shadow-md leading-relaxed min-h-[3rem]">${escapeHtml(itemDesc)}</p>`
    );

    // Initial Media (image / desktop source or video)
    if (cat.slug === 'action') {
      const film = actionFilms[idx] || {};
      const videoSrc = film.src || item.video || item.src || '';
      const videoPoster = film.poster || item.poster || itemSrc || '';
      pageHtml = pageHtml.replace(
        /<video\s+id="slider-video"[^>]*>[\s\S]*?<\/video>/i,
        `<video id="slider-video" src="${videoSrc}" poster="${videoPoster}" playsinline loop autoplay muted class="w-full h-full object-cover lg:object-contain transition-opacity duration-300"></video>`
      );
    } else {
      pageHtml = pageHtml.replace(
        /<source\s+id="slider-source-desktop"[^>]*srcset="[^"]*"/i,
        `<source id="slider-source-desktop" media="(min-width: 1024px)" srcset="${desktopSrc}"`
      );
      pageHtml = pageHtml.replace(
        /<img\s+id="slider-image"[^>]*src="[^"]*"/i,
        `<img id="slider-image" src="${itemSrc}"`
      );
      pageHtml = pageHtml.replace(
        /<img\s+id="slider-image"([^>]*)alt="[^"]*"/i,
        `<img id="slider-image"$1alt="${escapeHtml(imageAlt)}"`
      );
    }

    // 7. Navigation Arrows: semantic <a> tags with exact previous & next product URLs and descriptive aria-label
    pageHtml = pageHtml.replace(
      /<a\s+id="prev-btn"[^>]*>([\s\S]*?)<\/a>/i,
      `<a id="prev-btn" href="/products/${prevItem.id}/" class="nav-arrow-turath text-white/90 hover:text-[#D7C797] text-3xl md:text-4xl font-light transition-colors pointer-events-auto cursor-pointer" aria-label="Previous item: ${escapeHtml(prevItem.title)}">$1</a>`
    );
    pageHtml = pageHtml.replace(
      /<a\s+id="next-btn"[^>]*>([\s\S]*?)<\/a>/i,
      `<a id="next-btn" href="/products/${nextItem.id}/" class="nav-arrow-turath text-white/90 hover:text-[#D7C797] text-3xl md:text-4xl font-light transition-colors pointer-events-auto cursor-pointer" aria-label="Next item: ${escapeHtml(nextItem.title)}">$1</a>`
    );

    // 8. Semantic fallback text inside <noscript> for crawlers
    const productNoscript = `
  <noscript>
    <div class="sr-only">
      <h1>${escapeHtml(item.title)} — ${escapeHtml(item.titleAr)}</h1>
      <p>${escapeHtml(bilingualDesc)}</p>
      <p>Material: Solid Brass & Copper. Atelier: Historic Cairo, Egypt. Custom bespoke bespoke fabrication.</p>
      <nav aria-label="Product Navigation">
        <a href="/products/${prevItem.id}/">Previous: ${escapeHtml(prevItem.title)}</a>
        <a href="/products/${nextItem.id}/">Next: ${escapeHtml(nextItem.title)}</a>
        <a href="/${cat.file}">Back to ${escapeHtml(cat.title)}</a>
      </nav>
    </div>
  </noscript>
`;
    if (pageHtml.includes('<!-- Semantic Crawlable Catalog Index')) {
      pageHtml = pageHtml.replace('<!-- Semantic Crawlable Catalog Index', `${productNoscript}\n  <!-- Semantic Crawlable Catalog Index`);
    } else {
      pageHtml = pageHtml.replace('</body>', `${productNoscript}\n</body>`);
    }

    // 9. Initialize slider script with currentIndex = idx
    if (cat.slug === 'action') {
      pageHtml = pageHtml.replace(
        /let\s+currentIndex\s*=\s*\(!isNaN\(initialFilm\)[^;]+;/,
        `let currentIndex = ${idx};`
      );
    } else {
      pageHtml = pageHtml.replace(
        /let\s+initialIndex\s*=\s*0;/,
        `let initialIndex = ${idx};`
      );
    }

    // 10. Standalone Product Page JavaScript Optimization:
    // A. Prevent updateTurathDynamicMeta from mutating canonical tag or pushing ?product= query params on standalone product pages
    pageHtml = pageHtml.replace(
      /function\s+updateTurathDynamicMeta\s*\(\s*item\s*\)\s*\{/g,
      `function updateTurathDynamicMeta(item) {\n      if (!item || window.location.pathname.includes('/products/')) return;`
    );

    // B. Navigation arrows: Allow natural page navigation without preventDefault() interception on standalone product pages
    pageHtml = pageHtml.replace(
      /(?:if\s*\(\s*prevBtn\s*\)\s*)?prevBtn\.addEventListener\('click',\s*\(\s*e\s*\)\s*=>\s*\{\s*e\.preventDefault\(\);\s*updateSlider\(currentIndex\s*-\s*1\);\s*\}\);/g,
      `if (prevBtn && !window.location.pathname.includes('/products/')) { prevBtn.addEventListener('click', (e) => { e.preventDefault(); updateSlider(currentIndex - 1); }); }`
    );
    pageHtml = pageHtml.replace(
      /(?:if\s*\(\s*nextBtn\s*\)\s*)?nextBtn\.addEventListener\('click',\s*\(\s*e\s*\)\s*=>\s*\{\s*e\.preventDefault\(\);\s*updateSlider\(currentIndex\s*\+\s*1\);\s*\}\);/g,
      `if (nextBtn && !window.location.pathname.includes('/products/')) { nextBtn.addEventListener('click', (e) => { e.preventDefault(); updateSlider(currentIndex + 1); }); }`
    );

    // C. Keyboard navigation: Natural navigation on standalone product pages
    pageHtml = pageHtml.replace(
      /window\.addEventListener\('keydown',\s*\(\s*e\s*\)\s*=>\s*\{\s*if\s*\(e\.key\s*===\s*'ArrowLeft'\)\s*updateSlider\(currentIndex\s*-\s*1\);\s*if\s*\(e\.key\s*===\s*'ArrowRight'\)\s*updateSlider\(currentIndex\s*\+\s*1\);\s*\}\);/g,
      `window.addEventListener('keydown', (e) => {
        if (window.location.pathname.includes('/products/')) {
          if (e.key === 'ArrowLeft' && prevBtn && prevBtn.href) { window.location.href = prevBtn.href; }
          if (e.key === 'ArrowRight' && nextBtn && nextBtn.href) { window.location.href = nextBtn.href; }
        } else {
          if (e.key === 'ArrowLeft') updateSlider(currentIndex - 1);
          if (e.key === 'ArrowRight') updateSlider(currentIndex + 1);
        }
      });`
    );

    // D. Touch swipe navigation: Natural navigation on standalone product pages
    pageHtml = pageHtml.replace(
      /if\s*\(\s*diff\s*<\s*0\s*\)\s*\{\s*updateSlider\(currentIndex\s*\+\s*1\);\s*\}\s*else\s*\{\s*updateSlider\(currentIndex\s*-\s*1\);\s*\}/g,
      `if (window.location.pathname.includes('/products/')) {
        if (diff < 0 && nextBtn && nextBtn.href) { window.location.href = nextBtn.href; }
        else if (diff > 0 && prevBtn && prevBtn.href) { window.location.href = prevBtn.href; }
      } else {
        if (diff < 0) { updateSlider(currentIndex + 1); }
        else { updateSlider(currentIndex - 1); }
      }`
    );
    pageHtml = pageHtml.replace(
      /if\s*\(\s*swipeDistance\s*>\s*45\s*\)\s*\{\s*updateSlider\(currentIndex\s*-\s*1\);[\s\S]*?updateSlider\(currentIndex\s*\+\s*1\);\s*\}\s*\}/g,
      `if (swipeDistance > 45) {
        if (window.location.pathname.includes('/products/') && prevBtn && prevBtn.href) { window.location.href = prevBtn.href; }
        else { updateSlider(currentIndex - 1); }
      } else if (swipeDistance < -45) {
        if (window.location.pathname.includes('/products/') && nextBtn && nextBtn.href) { window.location.href = nextBtn.href; }
        else { updateSlider(currentIndex + 1); }
      }`
    );

    // 1. Write file to public/products/${productId}/index.html AND public/products/${productId}.html
    const itemDir = path.join(productsOutputDir, productId);
    fs.mkdirSync(itemDir, { recursive: true });
    fs.writeFileSync(path.join(itemDir, 'index.html'), pageHtml, 'utf8');
    fs.writeFileSync(path.join(productsOutputDir, `${productId}.html`), pageHtml, 'utf8');

    // 2. Also write directly to dist/products if dist exists
    if (fs.existsSync(distDir)) {
      const distItemDir = path.join(distProductsOutputDir, productId);
      fs.mkdirSync(distItemDir, { recursive: true });
      fs.writeFileSync(path.join(distItemDir, 'index.html'), pageHtml, 'utf8');
      fs.writeFileSync(path.join(distProductsOutputDir, `${productId}.html`), pageHtml, 'utf8');
    }

    totalGenerated++;
  }
}

// Generate Master Products Catalog Index (/products/ and /products)
const catalogItemsList = [];
for (const cat of CATEGORIES) {
  const catItems = (productsData.categories[cat.slug] && productsData.categories[cat.slug].items) || [];
  for (const item of catItems) {
    catalogItemsList.push({
      id: item.id,
      title: item.title,
      titleAr: item.titleAr,
      categoryTitle: cat.title,
      categoryFile: cat.file,
      image: item.image || item.src || ''
    });
  }
}

const masterCatalogHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <base href="/">
  <!-- Meta Pixel Code -->
  <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '148068092481360');
    fbq('track', 'PageView');
  </script>
  <!-- End Meta Pixel Code -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="theme-color" content="#0A0A0A">
  <title>Complete Bespoke Catalog | فهرس تحف ومنتجات النحاس | TURATH — Bespoke Solid Brass &amp; Copper</title>
  <meta name="description" content="Explore the complete bespoke collection of handcrafted solid brass &amp; copper chandeliers, mirrors, consoles, handrails, partitions, and bespoke decor by Turath Egypt. — الدليل الكامل لمنتجات ورشة تراث مصر لتصنيع النحاس الأصفر والأحمر بالجمالية.">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  <link rel="canonical" href="${BASE_URL}/products/">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${BASE_URL}/products/">
  <meta property="og:title" content="Complete Bespoke Catalog | TURATH — Bespoke Solid Brass &amp; Copper">
  <meta property="og:description" content="Handcrafted solid brass &amp; copper lighting, mirrors, furniture, and bespoke cladding crafted in Historic Cairo.">
  <meta property="og:image" content="${BASE_URL}/turath-brand-logo.jpg">

  <!-- Favicon & Icons -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

  <!-- Google Fonts & Stylesheet -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/${compiledCssFileName}">

  <!-- CollectionPage JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Turath Complete Bespoke Metalwork Catalog",
    "url": "${BASE_URL}/products/",
    "description": "Complete catalog of 118+ handcrafted solid brass and copper bespoke lighting, furniture, mirrors, and decor.",
    "publisher": {
      "@type": "Organization",
      "logo": "${BASE_URL}/turath-brand-logo.jpg",
      "name": "Turath Egypt - ورشة تراث",
      "url": "${BASE_URL}/"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Turath Handcrafted Solid Brass & Copper Masterpieces",
      "numberOfItems": ${catalogItemsList.length}
    }
  }
  </script>

  <style>
    body { background-color: #0A0A0A; color: #E5E5E5; font-family: 'Inter', sans-serif; }
    h1, h2, h3, .brand-font { font-family: 'Cinzel', serif; }
  </style>
</head>
<body class="min-h-screen bg-[#0A0A0A] text-white/90 selection:bg-[#D7C797] selection:text-black">
  <header class="border-b border-white/10 px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
    <a href="/" class="brand-font text-xl md:text-2xl font-bold tracking-[0.25em] text-[#D7C797] hover:opacity-80 transition-opacity">
      TURATH
    </a>
    <a href="/" class="text-xs md:text-sm tracking-widest uppercase text-white/70 hover:text-[#D7C797] transition-colors border border-white/20 px-4 py-2 rounded-full">
      &larr; Return to Atelier
    </a>
  </header>

  <main class="max-w-7xl mx-auto px-6 py-12 md:py-16">
    <div class="text-center max-w-3xl mx-auto mb-16">
      <p class="text-xs md:text-sm font-semibold tracking-[0.3em] uppercase text-[#D7C797] mb-3">HISTORIC CAIRO ATELIER</p>
      <h1 class="text-3xl md:text-5xl font-bold tracking-wider uppercase text-white mb-6">Complete Product Catalog</h1>
      <p class="text-white/70 text-sm md:text-base leading-relaxed">
        Browse our comprehensive portfolio of 118+ bespoke solid brass and copper bespoke fixtures, handcrafted lanterns, sculptural mirrors, partitions, and museum-grade masterworks.
      </p>
    </div>

    <!-- Category Direct Links -->
    <section class="mb-16">
      <h2 class="text-sm font-semibold tracking-[0.25em] uppercase text-white/50 mb-6 text-center">Bespoke Collections</h2>
      <div class="flex flex-wrap justify-center gap-3">
        ${CATEGORIES.map(c => `
          <a href="/${c.file}" class="px-5 py-2.5 rounded-full border border-white/15 bg-white/[0.02] hover:border-[#D7C797] hover:text-[#D7C797] text-xs md:text-sm font-medium tracking-wider transition-all">
            ${escapeHtml(c.title)}
          </a>
        `).join('')}
      </div>
    </section>

    <!-- Complete Products Grid -->
    <section>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        ${catalogItemsList.map(item => `
          <a href="/products/${item.id}/" class="group block border border-white/10 bg-white/[0.02] hover:border-[#D7C797]/60 rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1">
            <div class="aspect-square w-full overflow-hidden bg-black/40">
              <img src="${item.image}" alt="${escapeHtml(item.title)}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            </div>
            <div class="p-4">
              <span class="text-[10px] tracking-widest uppercase text-[#D7C797]/80 block mb-1">${escapeHtml(item.categoryTitle)}</span>
              <h3 class="text-xs md:text-sm font-semibold text-white tracking-wider uppercase line-clamp-2">${escapeHtml(item.title)}</h3>
              <p class="text-[11px] text-white/50 mt-1 line-clamp-1" dir="rtl">${escapeHtml(item.titleAr || '')}</p>
            </div>
          </a>
        `).join('')}
      </div>
    </section>
  </main>

  <footer class="border-t border-white/10 py-8 px-6 text-center text-xs text-white/40 tracking-wider">
    &copy; ${new Date().getFullYear()} TURATH EGYPT — Bespoke Solid Brass &amp; Copper Bespoke Metalwork. All rights reserved.
  </footer>
</body>
</html>
`;

fs.writeFileSync(path.join(productsOutputDir, 'index.html'), masterCatalogHtml, 'utf8');
fs.writeFileSync(path.join(publicDir, 'products.html'), masterCatalogHtml, 'utf8');

if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distProductsOutputDir, 'index.html'), masterCatalogHtml, 'utf8');
  fs.writeFileSync(path.join(distDir, 'products.html'), masterCatalogHtml, 'utf8');
}

console.log(`\n======================================================`);
console.log(`Successfully generated ${totalGenerated} full-screen product SSG pages!`);
console.log(`- Exact minimalist full-screen luxury UI preserved.`);
console.log(`- Self-referencing canonical tags, unique titles, and descriptions.`);
console.log(`- Semantic <a href> anchor arrows with descriptive aria-label.`);
console.log(`- Product + Manufacturer multi-market JSON-LD schema injected.`);
console.log(`- Semantic fallback text inside <noscript>.`);
console.log(`======================================================\n`);
