import fs from 'fs';

const en = fs.readFileSync('index.html', 'utf8');
const ar = fs.readFileSync('ar.html', 'utf8');

function getScrollListTag(html) {
  const m = html.match(/<div[^>]*class="[^"]*faq-scroll-list[^"]*"[^>]*>/);
  return m ? m[0] : 'not found';
}

console.log('EN faq-scroll-list:', getScrollListTag(en));
console.log('AR faq-scroll-list:', getScrollListTag(ar));
