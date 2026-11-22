import fs from 'fs';

const mainJs = fs.readFileSync('src/main.js', 'utf8');
const match = mainJs.match(/function initFaqSection\(\)[\s\S]*?\n\}/);
console.log(match ? match[0] : 'NOT FOUND');
