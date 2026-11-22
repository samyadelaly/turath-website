const fs = require('fs');

const subpages = [
  'action-ar.html', 'action.html',
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
  const match = content.match(/<meta[^>]+property=[\"']og:url[\"'][^>]*content=[\"']([^\"']*)[\"']/i);
  console.log(`${file}: og:url = ${match ? match[1] : 'NONE'}`);
});
