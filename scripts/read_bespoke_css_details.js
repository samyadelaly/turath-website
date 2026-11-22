import fs from 'fs';

const css = fs.readFileSync('src/style.css', 'utf8');
const lines = css.split('\n');

console.log('--- Lines 1030 to 1060 ---');
console.log(lines.slice(1029, 1060).map((l, i) => (i + 1030) + ': ' + l).join('\n'));

console.log('--- Lines 2180 to 2210 ---');
console.log(lines.slice(2179, 2210).map((l, i) => (i + 2180) + ': ' + l).join('\n'));

console.log('--- Lines 3055 to 3080 ---');
console.log(lines.slice(3054, 3080).map((l, i) => (i + 3055) + ': ' + l).join('\n'));
