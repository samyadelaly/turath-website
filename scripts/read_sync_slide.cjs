const fs = require('fs');

const content = fs.readFileSync('lighting-ar.html', 'utf8');
const idx = content.indexOf('function syncSlide');
if (idx !== -1) {
  console.log(content.slice(idx, idx + 800));
}
