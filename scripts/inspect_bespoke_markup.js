import fs from 'fs';

const arHtml = fs.readFileSync('ar.html', 'utf8');
const bespokeMatch = arHtml.match(/<section id="bespoke"[\s\S]*?<\/section>/);
console.log('--- AR BESPOKE HTML ---');
console.log(bespokeMatch ? bespokeMatch[0].slice(0, 2000) : 'NOT FOUND');
