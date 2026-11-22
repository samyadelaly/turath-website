import fs from 'fs';

const arHtml = fs.readFileSync('ar.html', 'utf8');
const indexHtml = fs.readFileSync('index.html', 'utf8');

const arTrack = arHtml.match(/<div class="collections-track[\s\S]*?<\/div>\s*<\/div>/);
console.log('--- AR CARDS (First 2) ---');
if (arTrack) {
  const cards = arTrack[0].match(/<div class="collection-card[\s\S]*?<\/div>\s*<\/div>/g);
  console.log(cards ? cards.slice(0, 2).join('\n---\n') : 'NO CARDS');
}

const enTrack = indexHtml.match(/<div class="collections-track[\s\S]*?<\/div>\s*<\/div>/);
console.log('--- EN CARDS (First 2) ---');
if (enTrack) {
  const cards = enTrack[0].match(/<div class="collection-card[\s\S]*?<\/div>\s*<\/div>/g);
  console.log(cards ? cards.slice(0, 2).join('\n---\n') : 'NO CARDS');
}
