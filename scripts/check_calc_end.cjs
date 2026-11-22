const fs = require('fs');
const html = fs.readFileSync('calculator.html', 'utf8');
console.log(html.substring(html.length - 800));
