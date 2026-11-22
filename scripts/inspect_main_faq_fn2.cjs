const fs = require('fs');
const js = fs.readFileSync('src/main.js', 'utf8');
const start = js.indexOf('// Header Title Reveal:');
console.log(js.substring(start, start + 1800));
