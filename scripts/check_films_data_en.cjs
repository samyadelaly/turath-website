const fs = require('fs');
const html = fs.readFileSync('action.html', 'utf8');
const start = html.indexOf('const filmsData = [');
console.log(html.substring(start, start + 1200));
