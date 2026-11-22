import fs from 'fs';

const css = fs.readFileSync('src/style.css', 'utf8');
const lines = css.split('\n');

console.log('--- Lines 1865 to 1900 ---');
console.log(lines.slice(1864, 1900).map((l, i) => (i + 1865) + ': ' + l).join('\n'));

console.log('--- Lines 2445 to 2460 ---');
console.log(lines.slice(2444, 2460).map((l, i) => (i + 2445) + ': ' + l).join('\n'));
