const fs = require('fs');
const css = fs.readFileSync('src/style.css', 'utf8');
console.log('Includes faq-scroll-canvas:', css.includes('faq-scroll-canvas'));
