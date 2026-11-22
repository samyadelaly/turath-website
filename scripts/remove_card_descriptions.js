import fs from 'fs';

let arHtml = fs.readFileSync('ar.html', 'utf8');

// Remove all <p class="collection-card-desc ...">...</p>
const countBefore = (arHtml.match(/<p class="collection-card-desc[\s\S]*?<\/p>/g) || []).length;
arHtml = arHtml.replace(/\s*<p class="collection-card-desc[\s\S]*?<\/p>/g, '');
const countAfter = (arHtml.match(/<p class="collection-card-desc[\s\S]*?<\/p>/g) || []).length;

fs.writeFileSync('ar.html', arHtml, 'utf8');
console.log(`Removed ${countBefore - countAfter} collection-card-desc paragraphs from ar.html.`);
