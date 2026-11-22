import fs from 'fs';

const en = fs.readFileSync('index.html', 'utf8');
const s = en.indexOf('id="bespoke"');
const e = en.indexOf('</section>', s);
console.log(en.substring(s - 30, e + 10));
