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
const distProductsOutputDir = path.join(rootDir, 'dist', 'products');
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
    defaultKeywords: 'نحاس، نجف، أبليك، إضاءة معمارية، دلايات نحاس، صناعة يدوية، ورشة تراث، سامي عادل، القاهرة التاريخية, Turath, Brass Lighting, Wall Sconce, Hammered Brass, Handcrafted Metalwork, Egyptian Heritage, ورشة نحاس بالجمالية, تشكيل نحاس عمولة, ديكورات نحاسية, تصنيع نجف عمولة, Custom brass fabrication, Handcrafted copper decor, Bespoke metalwork, تصنيع نحاس يدوي'
  },
  {
    slug: 'mirrors',
    file: 'mirrors.html',
    title: 'Solid Brass Mirrors',
    titleAr: 'مرايا نحاس أصفر مصمت',
    defaultKeywords: 'مرايا، مرايات نحاس، أرابيسك، زخارف إسلامية، نحاس مفرغ، صناعة يدوية، تراث, Turath, Brass Mirror, Islamic Star Filigree, Handcrafted Mirrors, Architectural Brass, Historic Cairo, ورشة نحاس بالجمالية, تشكيل نحاس عمولة, ديكورات نحاسية, تصنيع نجف عمولة, Custom brass fabrication, Handcrafted copper decor, Bespoke metalwork, تصنيع نحاس يدوي'
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
    title: 'Architectural Handles',
    titleAr: 'مقابض أبواب نحاسية معمارية',
    defaultKeywords: 'مقابض أبواب، مقابض نحاس، سبك نحاس، إكسسوارات معمارية، نحاس مصمت، تراث, Turath, Door Pulls, Brass Handles, Architectural Hardware, Sand Casting, Luxury Villas, ورشة نحاس بالجمالية, تشكيل نحاس عمولة, ديكورات نحاسية, تصنيع نجف عمولة, Custom brass fabrication, Handcrafted copper decor, Bespoke metalwork, تصنيع نحاس يدوي'
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
    defaultKeywords: 'أطباق نحاس، صواني معلقة، تحف نحاسية، حفر على النحاس، فنون إسلامية، خان الخليلي، تراث, Turath, Wall Charger, Brass Plate, Arabesque Relief, Islamic Antiques, Egyptian Artisans, ورشة نحاس بالجمالية, تشكيل نحاس عمولة, ديكورات نحاسية, تصنيع نجف عمولة, Custom brass fabrication, Handcrafted copper decor, Bespoke metalwork, تصنيع نحاس يدوي'
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
    defaultKeywords: 'قواطع نحاسية، بارتشن، مشربية، زجاج عنبري، فواصل ديكور، تراث, Turath, Brass Partitions, Screens, Mashrabiya, Amber Glass, Space Dividers, Architectural Metal, ورشة نحاس بالجمالية, تشكيل نحاس عمولة, ديكورات نحاسية, تصنيع نجف عمولة, Custom brass fabrication, Handcrafted copper decor, Bespoke metalwork, تصنيع نحاس يدوي'
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
    title: 'Architectural Masterpieces',
    titleAr: 'روائع نحاسية معمارية نادرة',
    defaultKeywords: 'تحف نحاسية، أعمال معمارية نادرة، كونسول نحاس منحوت، سبك نحاس عضوي، ورشة تراث, Turath, Masterpieces, Sculptural Brass, Luxury Atelier, Historic Cairo, ورشة نحاس بالجمالية, تشكيل نحاس عمولة, ديكورات نحاسية, تصنيع نجف عمولة, Custom brass fabrication, Handcrafted copper decor, Bespoke metalwork, تصنيع نحاس يدوي'
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
const actionHtmlPath = path.join(rootDir, 'action.html');
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
  const categoryFilePath = path.join(rootDir, cat.file);
  if (!fs.existsSync(categoryFilePath)) continue;

  const baseHtml = fs.readFileSync(categoryFilePath, 'utf8');
  const catItems = (productsData.categories[cat.slug] && productsData.categories[cat.slug].items) || [];

  for (let idx = 0; idx < catItems.length; idx++) {
    const item = catItems[idx];
    const productId = item.id;
    const prevItem = catItems[(idx - 1 + catItems.length) % catItems.length];
    const nextItem = catItems[(idx + 1) % catItems.length];

    const fullProductUrl = `${BASE_URL}/products/${productId}/`;
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

    // 2. Set Self-Referencing Canonical URL (CRITICAL)
    pageHtml = pageHtml.replace(/<link\s+rel="canonical"\s+href="[^"]*"/i, `<link rel="canonical" href="${fullProductUrl}"`);

    // 3. Set unique <title> and meta description
    pageHtml = pageHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(bilingualTitle)}</title>`);
    pageHtml = pageHtml.replace(/<meta\s+name="description"\s+content="[^"]*"/i, `<meta name="description" content="${escapeHtml(bilingualDesc)}"`);

    // 4. Update Open Graph and Twitter Card tags
    pageHtml = pageHtml.replace(/<meta\s+property="og:url"\s+content="[^"]*"/i, `<meta property="og:url" content="${fullProductUrl}"`);
    pageHtml = pageHtml.replace(/<meta\s+property="og:title"\s+content="[^"]*"/i, `<meta property="og:title" content="${escapeHtml(bilingualTitle)}"`);
    pageHtml = pageHtml.replace(/<meta\s+property="og:description"\s+content="[^"]*"/i, `<meta property="og:description" content="${escapeHtml(bilingualDesc)}"`);
    pageHtml = pageHtml.replace(/<meta\s+property="og:image"\s+content="[^"]*"/i, `<meta property="og:image" content="${fullImageUrl}"`);
    pageHtml = pageHtml.replace(/<meta\s+property="og:type"\s+content="[^"]*"/i, `<meta property="og:type" content="product"`);

    pageHtml = pageHtml.replace(/<meta\s+name="twitter:url"\s+content="[^"]*"/i, `<meta name="twitter:url" content="${fullProductUrl}"`);
    pageHtml = pageHtml.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"/i, `<meta name="twitter:title" content="${escapeHtml(bilingualTitle)}"`);
    pageHtml = pageHtml.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"/i, `<meta name="twitter:description" content="${escapeHtml(bilingualDesc)}"`);
    pageHtml = pageHtml.replace(/<meta\s+name="twitter:image"\s+content="[^"]*"/i, `<meta name="twitter:image" content="${fullImageUrl}"`);

    // 5. Inject Product + Manufacturer JSON-LD Schema with Cleaned Multi-Market Taxonomy
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
        "name": ${JSON.stringify(item.title)},
        "alternateName": ${JSON.stringify(item.titleAr)},
        "description": ${JSON.stringify(bilingualDesc)},
        "image": ${JSON.stringify(fullImageUrl)},
        "url": ${JSON.stringify(fullProductUrl)},
        "category": ${JSON.stringify(cat.title)},
        "material": "Solid Brass & Copper (نحاس أصفر وأحمر مصمت)",
        "keywords": "solid brass, unlacquered brass, architectural metalwork, antique brass, hammered copper, Egypt, GCC, US, UK, نحاس أصفر, نحاس أحمر, تشطيبات معمارية, ورشة نحاس بالجمالية",
        "brand": {
          "@type": "Brand",
          "name": "TURATH EGYPT"
        },
        "manufacturer": {
          "@type": "Manufacturer",
          "name": "Turath Egypt - ورشة تراث لتصنيع النحاس",
          "url": "${BASE_URL}/",
          "areaServed": [
            { "@type": "Country", "name": "Egypt" },
            { "@type": "Country", "name": "Saudi Arabia" },
            { "@type": "Country", "name": "United Arab Emirates" },
            { "@type": "Country", "name": "Kuwait" },
            { "@type": "Country", "name": "Qatar" },
            { "@type": "Country", "name": "United States" },
            { "@type": "Country", "name": "United Kingdom" }
          ]
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "EGP",
          "availability": "https://schema.org/InStock",
          "url": ${JSON.stringify(fullProductUrl)},
          "seller": {
            "@type": "Organization",
            "name": "TURATH EGYPT"
          }
        }
      }
    ]
  }
  </script>
`;

    // Replace category CollectionPage schema with Product schema
    if (pageHtml.includes('<!-- CollectionPage & Manufacturer JSON-LD Schema')) {
      pageHtml = pageHtml.replace(/<!-- CollectionPage & Manufacturer JSON-LD Schema[\s\S]*?<\/script>/, productJsonLd.trim());
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
      <p>Material: Solid Brass & Copper. Atelier: Historic Cairo, Egypt. Custom bespoke architectural fabrication.</p>
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

    // Write file to public/products/${productId}/index.html
    const itemDir = path.join(productsOutputDir, productId);
    fs.mkdirSync(itemDir, { recursive: true });
    fs.writeFileSync(path.join(itemDir, 'index.html'), pageHtml, 'utf8');

    // Also write directly to dist/products if dist exists
    if (fs.existsSync(rootDir, 'dist')) {
      const distItemDir = path.join(distProductsOutputDir, productId);
      fs.mkdirSync(distItemDir, { recursive: true });
      fs.writeFileSync(path.join(distItemDir, 'index.html'), pageHtml, 'utf8');
    }

    totalGenerated++;
  }
}

console.log(`\n======================================================`);
console.log(`Successfully generated ${totalGenerated} full-screen product SSG pages!`);
console.log(`- Exact minimalist full-screen luxury UI preserved.`);
console.log(`- Self-referencing canonical tags, unique titles, and descriptions.`);
console.log(`- Semantic <a href> anchor arrows with descriptive aria-label.`);
console.log(`- Product + Manufacturer multi-market JSON-LD schema injected.`);
console.log(`- Semantic fallback text inside <noscript>.`);
console.log(`======================================================\n`);
