const fs = require('fs');
const html = fs.readFileSync('ar.html', 'utf8');
const trackStart = html.indexOf('<div class="collections-track');
const afterCard9 = html.indexOf('<!-- Card 9:', trackStart);
const card9End = html.indexOf('</div>\n        </div>', afterCard9);
console.log('card9End:', card9End);
console.log(html.substring(afterCard9, afterCard9 + 1200));
