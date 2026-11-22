const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const faqIdx = indexHtml.indexOf('id="faq"');
console.log('--- INDEX.HTML FAQ ---');
console.log(indexHtml.substring(faqIdx - 150, faqIdx + 1200));

const css = fs.readFileSync('src/style.css', 'utf8');
const cssLines = css.split('\n');
console.log('--- CSS FAQ RULES ---');
cssLines.forEach((line, i) => {
  if (line.includes('#faq') || line.includes('faq-')) {
    console.log(`${i+1}: ${line}`);
  }
});
