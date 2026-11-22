const fs = require('fs');

const subpages = [
  'ar.html', 'index.html',
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
  const imgs = content.match(/<img[^>]+>/gi) || [];
  const missingAlt = imgs.filter(img => !/alt=[\"'][^\"']+[\"']/i.test(img) && !img.includes('facebook.com/tr'));
  const hasOg = content.includes('property="og:image"') || content.includes("property='og:image'");
  const hasTwitter = content.includes('name="twitter:card"') || content.includes("name='twitter:card'");
  console.log(`${file}: ${imgs.length} imgs (${missingAlt.length} missing descriptive alt), og:image? ${hasOg}, twitter:card? ${hasTwitter}`);
});
