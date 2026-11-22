import fs from 'fs';

const mainJs = fs.readFileSync('src/main.js', 'utf8');
const start = mainJs.indexOf('function initScene07()');
console.log(mainJs.slice(start, start + 2500));
