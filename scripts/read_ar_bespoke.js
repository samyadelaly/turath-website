import fs from 'fs';

const ar = fs.readFileSync('ar.html', 'utf8');
const lines = ar.split('\n');
const bespokeIdx = lines.findIndex(l => l.includes('id="bespoke"'));
console.log(lines.slice(bespokeIdx - 15, bespokeIdx + 15).map((l, i) => (bespokeIdx - 15 + i + 1) + ': ' + l).join('\n'));
