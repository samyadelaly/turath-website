import fs from 'fs';

const mainJs = fs.readFileSync('src/main.js', 'utf8');
const navMatch = mainJs.match(/function initNavDrawer\(\)[\s\S]*?\n\}/);
console.log(navMatch ? navMatch[0].slice(0, 3500) : 'NOT FOUND');
