const fs = require('fs');

const subpages = [
  { file: 'lighting-ar.html', isAr: true },
  { file: 'lighting.html', isAr: false },
  { file: 'mirrors-ar.html', isAr: true },
  { file: 'mirrors.html', isAr: false },
  { file: 'tables-ar.html', isAr: true },
  { file: 'tables.html', isAr: false },
  { file: 'handles-ar.html', isAr: true },
  { file: 'handles.html', isAr: false },
  { file: 'handrails-ar.html', isAr: true },
  { file: 'handrails.html', isAr: false },
  { file: 'decor-ar.html', isAr: true },
  { file: 'decor.html', isAr: false },
  { file: 'wall-art-ar.html', isAr: true },
  { file: 'wall-art.html', isAr: false },
  { file: 'partitions-ar.html', isAr: true },
  { file: 'partitions.html', isAr: false },
  { file: 'tableware-ar.html', isAr: true },
  { file: 'tableware.html', isAr: false },
  { file: 'masterpieces-ar.html', isAr: true },
  { file: 'masterpieces.html', isAr: false }
];

let totalProductsEnriched = 0;

subpages.forEach(({ file, isAr }) => {
  let content = fs.readFileSync(file, 'utf8');
  
  // 1. Extract __turathCatalog
  const matchCat = content.match(/(?:var|const)\s+__turathCatalog\s*=\s*(\[[\s\S]*?\]);/);
  if (!matchCat) {
    console.error('No catalog found in', file);
    return;
  }
  const catalog = JSON.parse(matchCat[1]);
  const catalogMap = new Map();
  catalog.forEach(item => {
    catalogMap.set(item.id, item);
  });
  
  // 2. Extract JSON-LD script
  const jsonLdMatch = content.match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/);
  if (!jsonLdMatch) {
    console.error('No JSON-LD in', file);
    return;
  }
  
  let json;
  try {
    json = JSON.parse(jsonLdMatch[1]);
  } catch(e) {
    console.error('JSON parse error in', file, e.message);
    return;
  }
  
  if (!json['@graph']) {
    console.error('No @graph in', file);
    return;
  }
  
  const collection = json['@graph'].find(item => item['@type'] === 'CollectionPage');
  if (!collection || !collection.mainEntity || !collection.mainEntity.itemListElement) {
    console.error('No mainEntity.itemListElement in', file);
    return;
  }
  
  // 3. Enrich each ListItem
  collection.mainEntity.itemListElement = collection.mainEntity.itemListElement.map((listItem, idx) => {
    // Find matching catalog item either by id in url or by index
    let catItem = null;
    if (listItem.url) {
      const idMatch = listItem.url.match(/products\/([^/]+)/);
      if (idMatch && catalogMap.has(idMatch[1])) {
        catItem = catalogMap.get(idMatch[1]);
      }
    }
    if (!catItem && idx < catalog.length) {
      catItem = catalog[idx];
    }
    
    const prodName = isAr 
      ? (catItem ? (catItem.titleAr || catItem.title) : listItem.name)
      : (catItem ? catItem.title : listItem.name);
      
    const prodDesc = isAr
      ? (catItem ? (catItem.descAr || catItem.descriptionAr || catItem.description || `${prodName} - تحفة ومشغولة نحاسية مصنوعة يدوياً في ورشة تراث بالقاهرة التاريخية.`) : `${listItem.name} - تصنيع نحاس يدوي فاخر.`)
      : (catItem ? (catItem.desc || catItem.description || `${prodName} - Bespoke handcrafted solid brass piece forged in Historic Cairo by TURATH atelier.`) : `${listItem.name} - Bespoke solid brass craftsmanship.`);
      
    const imgUrl = (catItem && catItem.image)
      ? (catItem.image.startsWith('http') ? catItem.image : `https://turath-egypt.vercel.app${catItem.image}`)
      : (listItem.image || 'https://turath-egypt.vercel.app/turath-brand-logo.jpg');

    const materialDesc = isAr
      ? "نحاس أصفر مصمت عالي النقاء (CuZn40) ونحاس أحمر نقي (99.9%) — سباكة رملية وطرق يدوي وتعتيق أنتيك"
      : "Solid Brass (CuZn40) & Pure Red Copper (99.9%) — Sand-cast, hand-hammered & antique patinated";

    totalProductsEnriched++;

    return {
      "@type": "ListItem",
      "position": listItem.position || (idx + 1),
      "name": prodName,
      "url": listItem.url,
      "image": imgUrl,
      "item": {
        "@type": "Product",
        "name": prodName,
        "image": imgUrl,
        "description": prodDesc,
        "material": materialDesc,
        "brand": {
          "@type": "Brand",
          "name": "TURATH"
        },
        "manufacturer": {
          "@type": "Organization",
          "name": isAr ? "ورشة تراث لتصنيع النحاس بالقاهرة التاريخية" : "TURATH Egypt Bespoke Brass Atelier",
          "url": "https://turath-egypt.vercel.app/"
        },
        "countryOfOrigin": {
          "@type": "Country",
          "name": "Egypt"
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "EGP",
          "availability": "https://schema.org/PreOrder",
          "itemCondition": "https://schema.org/NewCondition",
          "seller": {
            "@type": "Organization",
            "name": "TURATH Egypt"
          }
        }
      }
    };
  });
  
  // Format clean replacement
  const newJsonStr = JSON.stringify(json, null, 2);
  const newScriptTag = `<script type="application/ld+json">\n${newJsonStr}\n  </script>`;
  
  content = content.replace(/<script type=\"application\/ld\+json\">[\s\S]*?<\/script>/, newScriptTag);
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Enriched ${file} (${collection.mainEntity.itemListElement.length} products)`);
});

console.log(`\nSuccessfully enriched ${totalProductsEnriched} product items across all 20 subpages!`);
