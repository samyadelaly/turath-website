import fs from 'fs';

const ar = fs.readFileSync('ar.html', 'utf8');
const lines = ar.split('\n');
const s3Idx = lines.findIndex(l => l.includes('id="scene-03"'));
console.log(lines.slice(s3Idx - 5, s3Idx + 45).map((l, i) => (s3Idx - 5 + i + 1) + ': ' + l).join('\n'));
