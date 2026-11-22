import fs from 'fs';

const content = fs.readFileSync('src/main.js', 'utf8');
const lines = content.split('\n');

console.log('--- Lines 1866 to 2000 ---');
console.log(lines.slice(1865, 2000).map((l, i) => (i + 1866) + ': ' + l).join('\n'));

console.log('--- Lines 2000 to 2150 ---');
console.log(lines.slice(1999, 2150).map((l, i) => (i + 2000) + ': ' + l).join('\n'));
