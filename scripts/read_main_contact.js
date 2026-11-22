import fs from 'fs';

const js = fs.readFileSync('src/main.js', 'utf8');
const lines = js.split('\n');

const idx = lines.findIndex(l => l.includes('function initContactSection'));
console.log(lines.slice(idx - 2, idx + 40).map((l, i) => (idx - 2 + i + 1) + ': ' + l).join('\n'));
