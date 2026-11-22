const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const faqSection = html.substring(html.indexOf('<section id="faq"'), html.indexOf('</section>', html.indexOf('<section id="faq"')) + 10);
console.log('--- FAQ SECTION HTML ---');
console.log(faqSection.substring(0, 2500));
