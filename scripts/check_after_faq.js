import fs from 'fs';

const en = fs.readFileSync('index.html', 'utf8');
const ar = fs.readFileSync('ar.html', 'utf8');

function getAfterClosing(html) {
  const idx = html.indexOf('faq-closing-statement');
  const secEnd = html.indexOf('</section>', idx);
  return html.substring(idx, secEnd + 10);
}

console.log('--- EN after closing ---');
console.log(getAfterClosing(en));

console.log('--- AR after closing ---');
console.log(getAfterClosing(ar));
