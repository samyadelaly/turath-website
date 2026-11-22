import fs from 'fs';

const mainJs = fs.readFileSync('src/main.js', 'utf8');
const start = mainJs.indexOf("if (realId === 'scene-03' || realId === 'gallery'");
console.log(mainJs.slice(start, start + 2500));
