import fs from 'fs';

const css = fs.readFileSync('src/style.css', 'utf8');
const lines = css.split('\n');

lines.forEach((l, i) => {
  if (l.includes('bespoke') && (l.includes('background') || l.includes('bg-') || l.includes('#050505') || l.includes('black'))) {
    console.log((i + 1) + ': ' + l);
  }
});
