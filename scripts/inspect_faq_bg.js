import fs from 'fs';

const arHtml = fs.readFileSync('ar.html', 'utf8');
const indexHtml = fs.readFileSync('index.html', 'utf8');

function printFaqBg(html, name) {
  const match = html.match(/<div class="faq-bg-sticky[\s\S]*?<\/div>/);
  console.log(`=== ${name} ===`);
  console.log(match ? match[0] : 'NOT FOUND');
}

printFaqBg(arHtml, 'AR HTML');
printFaqBg(indexHtml, 'EN HTML');
