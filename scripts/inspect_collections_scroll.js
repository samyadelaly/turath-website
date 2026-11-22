import fs from 'fs';

const mainJs = fs.readFileSync('src/main.js', 'utf8');
const match = mainJs.match(/function initCollectionsPinnedHorizontal\(\)[\s\S]*?\n\}/);
console.log(match ? match[0] : 'NOT FOUND');
