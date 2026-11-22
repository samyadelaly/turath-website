const fs = require('fs');
const html = fs.readFileSync('action-ar.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('share') || l.includes('Share') || l.includes('navigator') || l.includes('product-wa-btn') || l.includes('whatsapp') || l.includes('wa.me')) {
    console.log((i+1) + ': ' + l.slice(0, 120));
  }
});
