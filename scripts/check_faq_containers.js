import fs from 'fs';

const en = fs.readFileSync('index.html', 'utf8');
const ar = fs.readFileSync('ar.html', 'utf8');

function getFaqContainers(html) {
  const faqIdx = html.indexOf('id="faq"');
  const scrollListIdx = html.indexOf('faq-scroll-list', faqIdx);
  return html.substring(faqIdx, scrollListIdx + 40);
}

console.log('--- EN Faq containers ---');
console.log(getFaqContainers(en));

console.log('--- AR Faq containers ---');
console.log(getFaqContainers(ar));
