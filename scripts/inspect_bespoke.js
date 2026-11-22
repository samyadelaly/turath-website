import fs from 'fs';

const en = fs.readFileSync('index.html', 'utf8');
const ar = fs.readFileSync('ar.html', 'utf8');

function getBespokeSection(html) {
  const start = html.indexOf('id="bespoke"');
  const end = html.indexOf('</section>', start);
  return html.substring(start - 20, end + 10);
}

console.log('--- EN Bespoke Section ---');
console.log(getBespokeSection(en).substring(0, 1500));

console.log('--- AR Bespoke Section ---');
console.log(getBespokeSection(ar).substring(0, 1500));
