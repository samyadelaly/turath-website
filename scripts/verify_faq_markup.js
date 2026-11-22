import fs from 'fs';

const arHtml = fs.readFileSync('ar.html', 'utf8');
const indexHtml = fs.readFileSync('index.html', 'utf8');

function inspectFaq(html, name) {
  const match = html.match(/<section id="faq"[\s\S]*?<\/div>[\s\S]*?<\/div>/);
  console.log(`=== ${name} ===`);
  console.log(match ? match[0].slice(0, 1200) : 'NOT FOUND');
}

inspectFaq(arHtml, 'AR FAQ');
inspectFaq(indexHtml, 'EN FAQ');
