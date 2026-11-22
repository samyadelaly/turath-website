const fs = require('fs');

const content = fs.readFileSync('lighting-ar.html', 'utf8');
const idx = content.indexOf('function updateSlider(index)');
if (idx !== -1) {
  console.log(content.slice(idx + 1000, idx + 2200));
}
