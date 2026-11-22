import fs from 'fs';

const en = fs.readFileSync('index.html', 'utf8');
const ar = fs.readFileSync('ar.html', 'utf8');

function getFaqClosing(html) {
  const idx = html.indexOf('faq-closing-statement');
  if (idx === -1) return 'not found';
  return html.substring(idx - 100, idx + 400);
}

console.log('EN faq closing:');
console.log(getFaqClosing(en));

console.log('AR faq closing:');
console.log(getFaqClosing(ar));
