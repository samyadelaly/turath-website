import fs from 'fs';

const mainJs = fs.readFileSync('src/main.js', 'utf8');
const start = mainJs.indexOf("function smoothScrollToSemanticHash");
const end = mainJs.indexOf("function initFeaturedProducts", start);
console.log(mainJs.slice(start, end));
