const fs = require('fs');

console.log('--- Checking src/style.css ---');
const css = fs.readFileSync('src/style.css', 'utf8');
const cssLines = css.split('\n');
cssLines.forEach((l, i) => {
  if (l.includes('contextmenu') || l.includes('user-select') || l.includes('user-drag') || l.includes('touch-callout') || l.includes('protected')) {
    console.log((i+1) + ': ' + l.trim());
  }
});

console.log('\n--- Checking src/main.js ---');
const js = fs.readFileSync('src/main.js', 'utf8');
const jsLines = js.split('\n');
jsLines.forEach((l, i) => {
  if (l.includes('contextmenu') || l.includes('dragstart') || l.includes('preventDefault') && (l.includes('img') || l.includes('video') || l.includes('image'))) {
    console.log((i+1) + ': ' + l.trim());
  }
});
