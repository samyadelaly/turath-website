const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('scene-07') || l.includes('id="faq"') || l.includes('id="contact"')) {
    console.log((i+1) + ': ' + l.trim().slice(0, 80));
  }
});
