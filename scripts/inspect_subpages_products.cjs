const fs = require('fs');

const subpages = [
  { ar: 'lighting-ar.html', en: 'lighting.html', category: 'Lighting' },
  { ar: 'mirrors-ar.html', en: 'mirrors.html', category: 'Mirrors' },
  { ar: 'tables-ar.html', en: 'tables.html', category: 'Tables & Consoles' },
  { ar: 'handles-ar.html', en: 'handles.html', category: 'Handles & Hardware' },
  { ar: 'handrails-ar.html', en: 'handrails.html', category: 'Handrails' },
  { ar: 'decor-ar.html', en: 'decor.html', category: 'Decorative Objects' },
  { ar: 'wall-art-ar.html', en: 'wall-art.html', category: 'Wall Art' },
  { ar: 'partitions-ar.html', en: 'partitions.html', category: 'Partitions & Screens' },
  { ar: 'tableware-ar.html', en: 'tableware.html', category: 'Tableware & Hospitality' },
  { ar: 'masterpieces-ar.html', en: 'masterpieces.html', category: 'Masterpieces' }
];

subpages.forEach(pair => {
  const cAr = fs.readFileSync(pair.ar, 'utf8');
  const matchAr = cAr.match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/);
  if (matchAr) {
    try {
      const json = JSON.parse(matchAr[1]);
      const coll = json['@graph'].find(i => i['@type'] === 'CollectionPage');
      const count = coll && coll.mainEntity && coll.mainEntity.itemListElement ? coll.mainEntity.itemListElement.length : 0;
      console.log(`${pair.category} (${pair.ar}): ${count} items`);
      if (count > 0) {
        console.log('   Sample item:', coll.mainEntity.itemListElement[0]);
      }
    } catch(e) {
      console.error('Error in', pair.ar, e.message);
    }
  } else {
    console.log('No JSON-LD in', pair.ar);
  }
});
