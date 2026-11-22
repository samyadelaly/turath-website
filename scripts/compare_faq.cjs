const fs = require('fs');
const arHtml = fs.readFileSync('ar.html', 'utf8');
const enHtml = fs.readFileSync('index.html', 'utf8');

const arFaqStart = arHtml.indexOf('id="faq"');
const enFaqStart = enHtml.indexOf('id="faq"');

const arFaqSnippet = arHtml.slice(arFaqStart + 1200, arFaqStart + 2500);
const enFaqSnippet = enHtml.slice(enFaqStart + 1200, enFaqStart + 2500);

console.log('=== AR FAQ SNIPPET (cont) ===');
console.log(arFaqSnippet);
console.log('=== EN FAQ SNIPPET (cont) ===');
console.log(enFaqSnippet);
