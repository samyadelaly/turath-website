const fs = require('fs');

const arPages = [
  'action-ar.html',
  'lighting-ar.html',
  'mirrors-ar.html',
  'tables-ar.html',
  'handles-ar.html',
  'handrails-ar.html',
  'decor-ar.html',
  'wall-art-ar.html',
  'partitions-ar.html',
  'tableware-ar.html',
  'masterpieces-ar.html'
];

arPages.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const match = content.match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/);
  if (match) {
    const json = JSON.parse(match[1]);
    const b = json['@graph'].find(i => i['@type'] === 'BreadcrumbList');
    if (b && b.itemListElement) {
      console.log(file, '->', b.itemListElement.map(e => `${e.name} (${e.item})`).join(' / '));
    }
  }
});
