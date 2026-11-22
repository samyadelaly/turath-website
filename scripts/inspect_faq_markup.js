import fs from 'fs';

const arHtml = fs.readFileSync('ar.html', 'utf8');
const indexHtml = fs.readFileSync('index.html', 'utf8');

const arFaqMatch = arHtml.match(/<section id="faq"[\s\S]*?<\/section>/);
console.log('--- AR FAQ HTML ---');
console.log(arFaqMatch ? arFaqMatch[0].slice(0, 1000) : 'NOT FOUND');

const enFaqMatch = indexHtml.match(/<section id="faq"[\s\S]*?<\/section>/);
console.log('--- EN FAQ HTML ---');
console.log(enFaqMatch ? enFaqMatch[0].slice(0, 1000) : 'NOT FOUND');
