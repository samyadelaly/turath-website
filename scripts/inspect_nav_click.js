import fs from 'fs';

const mainJs = fs.readFileSync('src/main.js', 'utf8');
const navMatch = mainJs.match(/const idToSemantic = \{[\s\S]*?function initFeaturedProducts/);
console.log(navMatch ? navMatch[0].slice(0, 3000) : 'NOT FOUND');
