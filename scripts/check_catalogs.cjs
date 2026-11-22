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

subpages.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const hasCatalog = content.includes('var __turathCatalog =') || content.includes('const __turathCatalog =');
  const matchCat = content.match(/(?:var|const)\s+__turathCatalog\s*=\s*(\[[\s\S]*?\]);/);
  let count = 0;
  if (matchCat) {
    try {
      count = JSON.parse(matchCat[1]).length;
    } catch(e) {
      count = 'JSON parse error';
    }
  }
  console.log(`${file}: catalog present? ${hasCatalog} (${count} items)`);
});
