const fs = require('fs');

const subpages = [
  { file: 'action-ar.html', isAr: true, nameAr: 'حرفية النحاس في ورش تراث التاريخية', nameEn: 'Turath in Action | Heritage Brass Craftsmanship' },
  { file: 'action.html', isAr: false, nameAr: 'حرفية النحاس في ورش تراث التاريخية', nameEn: 'Turath in Action | Heritage Brass Craftsmanship' },
  { file: 'lighting-ar.html', isAr: true, nameAr: 'وحدات إضاءة ونجف وثريات نحاسية يدوية', nameEn: 'Handcrafted Bespoke Brass Lighting Fixtures' },
  { file: 'lighting.html', isAr: false, nameAr: 'وحدات إضاءة ونجف وثريات نحاسية يدوية', nameEn: 'Handcrafted Bespoke Brass Lighting Fixtures' },
  { file: 'mirrors-ar.html', isAr: true, nameAr: 'مرايا صالون ومغاسل نحاسية مفرغة فاخرة', nameEn: 'Solid Brass Luxury Filigree & Pierced Mirrors' },
  { file: 'mirrors.html', isAr: false, nameAr: 'مرايا صالون ومغاسل نحاسية مفرغة فاخرة', nameEn: 'Solid Brass Luxury Filigree & Pierced Mirrors' },
  { file: 'tables-ar.html', isAr: true, nameAr: 'طاولات قهوة وكونسول نحاس خالص فاخر', nameEn: 'Solid Brass Luxury Coffee & Console Tables' },
  { file: 'tables.html', isAr: false, nameAr: 'طاولات قهوة وكونسول نحاس خالص فاخر', nameEn: 'Solid Brass Luxury Coffee & Console Tables' },
  { file: 'handles-ar.html', isAr: true, nameAr: 'مقابض أبواب قصور وفلل نحاس مسبوك', nameEn: 'Architectural Cast Solid Brass Door Pulls & Hardware' },
  { file: 'handles.html', isAr: false, nameAr: 'مقابض أبواب قصور وفلل نحاس مسبوك', nameEn: 'Architectural Cast Solid Brass Door Pulls & Hardware' },
  { file: 'handrails-ar.html', isAr: true, nameAr: 'درابزين سلالم وكوبستات نحاس معماري للفلل', nameEn: 'Bespoke Solid Brass Staircase Handrails & Balustrades' },
  { file: 'handrails.html', isAr: false, nameAr: 'درابزين سلالم وكوبستات نحاس معماري للفلل', nameEn: 'Bespoke Solid Brass Staircase Handrails & Balustrades' },
  { file: 'decor-ar.html', isAr: true, nameAr: 'تحف وصواني وأطباق جدارية نحاسية منقوشة', nameEn: 'Handcrafted Brass Decorative Chargers & Wall Plates' },
  { file: 'decor.html', isAr: false, nameAr: 'تحف وصواني وأطباق جدارية نحاسية منقوشة', nameEn: 'Handcrafted Brass Decorative Chargers & Wall Plates' },
  { file: 'wall-art-ar.html', isAr: true, nameAr: 'لوحات جدارية وتجاليد نحاس مطروق وبانوهات', nameEn: 'Hand-Hammered Brass & Copper Wall Relief Art' },
  { file: 'wall-art.html', isAr: false, nameAr: 'لوحات جدارية وتجاليد نحاس مطروق وبانوهات', nameEn: 'Hand-Hammered Brass & Copper Wall Relief Art' },
  { file: 'partitions-ar.html', isAr: true, nameAr: 'قواطع وفواصل بارتشن نحاس معماري مفرغ', nameEn: 'Architectural Solid Brass Screens & Partitions' },
  { file: 'partitions.html', isAr: false, nameAr: 'قواطع وفواصل بارتشن نحاس معماري مفرغ', nameEn: 'Architectural Solid Brass Screens & Partitions' },
  { file: 'tableware-ar.html', isAr: true, nameAr: 'أدوات مائدة وأواني ضيافة نحاسية ملكية', nameEn: 'Artisanal Solid Brass & Copper Luxury Tableware' },
  { file: 'tableware.html', isAr: false, nameAr: 'أدوات مائدة وأواني ضيافة نحاسية ملكية', nameEn: 'Artisanal Solid Brass & Copper Luxury Tableware' },
  { file: 'masterpieces-ar.html', isAr: true, nameAr: 'روائع ومشغولات نحاسية نادرة ومجسمات', nameEn: 'TURATH Masterpieces & Unique Sculptural Metalwork' },
  { file: 'masterpieces.html', isAr: false, nameAr: 'روائع ومشغولات نحاسية نادرة ومجسمات', nameEn: 'TURATH Masterpieces & Unique Sculptural Metalwork' }
];

subpages.forEach(({ file, isAr, nameAr, nameEn }) => {
  let content = fs.readFileSync(file, 'utf8');

  // Extract existing title & desc
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  const descMatch = content.match(/<meta[^>]+name=[\"']description[\"'][^>]*content=[\"']([^\"']*)[\"']/i)
    || content.match(/<meta[^>]+content=[\"']([^\"']*)[\"'][^>]*name=[\"']description[\"']/i);

  const title = titleMatch ? titleMatch[1].trim() : (isAr ? `${nameAr} | تراث مصر` : `${nameEn} | TURATH Egypt`);
  const desc = descMatch ? descMatch[1].trim() : (isAr ? `مشغولات نحاسية فاخرة مصنوعة يدوياً في القاهرة التاريخية من ورشة تراث.` : `Handcrafted bespoke solid brass & copper bespoke metalwork forged in Historic Cairo by TURATH.`);

  // Extract existing og:image src
  const imgMatch = content.match(/<meta[^>]+property=[\"']og:image[\"'][^>]*content=[\"']([^\"']*)[\"']/i);
  let imgSrc = imgMatch ? imgMatch[1].trim() : '/turath-brand-logo.jpg';
  
  // Clean query strings like ?v=2
  imgSrc = imgSrc.split('?')[0];
  if (!imgSrc.startsWith('http')) {
    imgSrc = `https://turath-egypt.vercel.app${imgSrc.startsWith('/') ? '' : '/'}${imgSrc}`;
  }

  const pageUrl = `https://turath-egypt.vercel.app/${file}`;
  const locale = isAr ? 'ar_EG' : 'en_US';
  const altText = isAr ? `${nameAr} — ورشة تراث بالقاهرة التاريخية` : `${nameEn} — TURATH Egypt Atelier`;

  // Build complete, robust Social Card block
  const socialBlock = `<!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="TURATH Egypt — تراث لتصنيع النحاس">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:image" content="${imgSrc}">
  <meta property="og:image:secure_url" content="${imgSrc}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:alt" content="${altText}">
  <meta property="og:locale" content="${locale}">
  <meta property="og:locale:alternate" content="${isAr ? 'en_US' : 'ar_EG'}">

  <!-- Twitter / X Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@turath_egypt">
  <meta name="twitter:creator" content="@turath_egypt">
  <meta name="twitter:url" content="${pageUrl}">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${desc}">
  <meta name="twitter:image" content="${imgSrc}">
  <meta name="twitter:image:alt" content="${altText}">`;

  // Replace existing OG block (from <!-- Open Graph down to <link or next block)
  const ogRegex = /<!-- Open Graph[\s\S]*?(?:<!-- Twitter[\s\S]*?)?(?=(?:<!-- Google Fonts|<link\s+rel=[\"']preconnect[\"']|<script|<\/head>))/i;
  
  if (ogRegex.test(content)) {
    content = content.replace(ogRegex, socialBlock + '\n\n  ');
    console.log(`[SUCCESS] Replaced social block in ${file}`);
  } else {
    // If no comment tag, replace from first <meta property="og: to before fonts
    const fallbackRegex = /<meta\s+property=[\"']og:type[\"'][\s\S]*?<meta\s+property=[\"']og:image[\"'][^>]*>/i;
    if (fallbackRegex.test(content)) {
      content = content.replace(fallbackRegex, socialBlock);
      console.log(`[FALLBACK SUCCESS] Replaced social block in ${file}`);
    } else {
      console.error(`[WARN] Could not find OG block in ${file}`);
    }
  }

  fs.writeFileSync(file, content, 'utf8');
});

console.log('\nAll 22 subpages successfully upgraded with Absolute OpenGraph & Twitter Cards!');
