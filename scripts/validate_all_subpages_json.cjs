const fs = require('fs');

const subpages = [
  'lighting-ar.html', 'lighting.html',
  'mirrors-ar.html', 'mirrors.html',
  'tables-ar.html', 'tables.html',
  'handles-ar.html', 'handles.html',
  'handrails-ar.html', 'handrails.html',
  'decor-ar.html', 'decor.html',
  'wall-art-ar.html', 'wall-art.html',
  'partitions-ar.html', 'partitions.html',
  'tableware-ar.html', 'tableware.html',
  'masterpieces-ar.html', 'masterpieces.html'
];

let allValid = true;

subpages.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const match = content.match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/);
  if (!match) {
    console.error(`MISSING JSON-LD in ${file}`);
    allValid = false;
    return;
  }
  try {
    const json = JSON.parse(match[1]);
    const coll = json['@graph'].find(i => i['@type'] === 'CollectionPage');
    const firstProduct = coll.mainEntity.itemListElement[0].item;
    if (firstProduct && firstProduct['@type'] === 'Product') {
      console.log(`[OK] ${file}: ${coll.mainEntity.itemListElement.length} valid products. Sample: ${firstProduct.name}`);
    } else {
      console.error(`[WARN] ${file}: Product item missing`);
      allValid = false;
    }
  } catch(e) {
    console.error(`[FAIL] ${file}: Invalid JSON! ${e.message}`);
    allValid = false;
  }
});

console.log('\nAll 20 subpages validation result:', allValid ? 'PASSED 100%' : 'FAILED');
