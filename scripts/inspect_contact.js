import fs from 'fs';

const en = fs.readFileSync('index.html', 'utf8');
const ar = fs.readFileSync('ar.html', 'utf8');

function getContactSection(html) {
  const start = html.indexOf('id="contact"');
  const end = html.indexOf('</section>', start);
  return html.substring(start - 20, end + 10);
}

console.log('--- EN Contact Section (first 1200 chars) ---');
console.log(getContactSection(en).substring(0, 1200));

console.log('--- AR Contact Section (first 1200 chars) ---');
console.log(getContactSection(ar).substring(0, 1200));
