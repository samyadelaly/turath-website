const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const faqStart = html.indexOf('<section id="faq"');
const faqEnd = html.indexOf('</section>', faqStart);
const faqHtml = html.substring(faqStart, faqEnd + 10);

const h4s = [];
const re = /<h4[^>]*>([\s\S]*?)<\/h4>/g;
let m;
while ((m = re.exec(faqHtml)) !== null) {
  h4s.push(m[1].trim());
}
console.log('Total questions in index.html:', h4s.length);
h4s.forEach((q, i) => console.log(`${i+1}: ${q}`));
