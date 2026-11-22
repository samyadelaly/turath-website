import fs from 'fs';

const arHtml = fs.readFileSync('ar.html', 'utf8');
const contactMatch = arHtml.match(/<section id="contact"[\s\S]*?<\/section>/);
console.log('Contact HTML tag:', contactMatch ? contactMatch[0].slice(0, 500) : 'NOT FOUND');
