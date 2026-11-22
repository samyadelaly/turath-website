import fs from 'fs';

const css = fs.readFileSync('src/style.css', 'utf8');
const lines = css.split('\n');

lines.forEach((l, i) => {
  if (l.includes('#contact') || l.includes('contact-section')) {
    console.log((i + 1) + ': ' + l);
  }
});
