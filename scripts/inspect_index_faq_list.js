import fs from 'fs';

const indexHtml = fs.readFileSync('index.html', 'utf8');
const start = indexHtml.indexOf('class="faq-scroll-list');
console.log(indexHtml.slice(start - 200, start + 500));
