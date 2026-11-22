import fs from 'fs';

const en = fs.readFileSync('index.html', 'utf8');
const ar = fs.readFileSync('ar.html', 'utf8');

function findSection(html, id) {
  const match = html.match(new RegExp('<section[^>]*id=["\']' + id + '["\'][^>]*>', 'i'));
  return match ? match[0] : 'not found';
}

console.log('EN #scene-03 tag:', findSection(en, 'scene-03'));
console.log('AR #scene-03 tag:', findSection(ar, 'scene-03'));
console.log('EN #bespoke tag:', findSection(en, 'bespoke'));
console.log('AR #bespoke tag:', findSection(ar, 'bespoke'));
console.log('EN #scene-07 tag:', findSection(en, 'scene-07'));
console.log('AR #scene-07 tag:', findSection(ar, 'scene-07'));
console.log('EN #faq tag:', findSection(en, 'faq'));
console.log('AR #faq tag:', findSection(ar, 'faq'));
console.log('EN #contact tag:', findSection(en, 'contact'));
console.log('AR #contact tag:', findSection(ar, 'contact'));
