const fs = require('fs');
const css = fs.readFileSync('src/style.css', 'utf8');
const lines = css.split('\n');
lines.forEach((l, i) => {
  if (l.includes('faq-scroll-canvas')) {
    console.log((i+1) + ': ' + l);
  }
});
