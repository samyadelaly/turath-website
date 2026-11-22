import fs from 'fs';

const js = fs.readFileSync('src/main.js', 'utf8');
const lines = js.split('\n');

lines.forEach((l, i) => {
  if (l.includes('clipPath') || l.includes('polygon') || l.includes('staircase') || l.includes('morphing') || l.includes('Morphing')) {
    console.log((i + 1) + ': ' + l);
  }
});
