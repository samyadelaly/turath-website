const fs = require('fs');
const html = fs.readFileSync('lighting-ar.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('share-btn') || l.includes('shareBtn') || l.includes('product-wa-btn') || l.includes('productWaBtn')) {
    console.log((i+1) + ': ' + l.slice(0, 120));
  }
});
