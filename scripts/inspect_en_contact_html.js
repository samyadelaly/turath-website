import fs from 'fs';

const indexHtml = fs.readFileSync('index.html', 'utf8');
const contactMatch = indexHtml.match(/<section id="contact"[\s\S]*?<\/section>/);
console.log('EN Contact:', contactMatch ? contactMatch[0].slice(0, 1000) : 'NOT FOUND');
