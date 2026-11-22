import fs from 'fs';

const arHtml = fs.readFileSync('ar.html', 'utf8');
const indexHtml = fs.readFileSync('index.html', 'utf8');

const arMatch = arHtml.match(/<section id="faq"[\s\S]*?<\/div>[\s\S]*?<\/div>/);
console.log('--- AR FAQ TOP ---');
console.log(arHtml.slice(arHtml.indexOf('<section id="faq"'), arHtml.indexOf('<section id="faq"') + 2500));
