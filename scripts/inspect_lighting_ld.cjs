const fs = require('fs');
const content = fs.readFileSync('lighting-ar.html', 'utf8');
const match = content.match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/);
if (match) {
  const json = JSON.parse(match[1]);
  console.log('lighting-ar.html @graph items:', json['@graph'].map(i => i['@type']));
  console.log('CollectionPage keys:', Object.keys(json['@graph'][1]));
  if (json['@graph'][1].mainEntity) {
    console.log('mainEntity items count:', json['@graph'][1].mainEntity.itemListElement.length);
    console.log('First item:', json['@graph'][1].mainEntity.itemListElement[0]);
  }
}
