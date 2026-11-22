const fs = require('fs');
const html = fs.readFileSync('masterpieces-ar.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('share-btn') || l.includes('shareBtn') || l.includes('masterpiece-img') || l.includes('slider-image')) {
    console.log((i+1) + ': ' + l.slice(0, 120));
  }
});
