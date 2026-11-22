const fs = require('fs');

const html = fs.readFileSync('action-ar.html', 'utf8');
const match = html.match(/<script[^>]*type=[\"']application\/ld\+json[\"'][^>]*>([\s\S]*?)<\/script>/);
if (match) {
  const json = JSON.parse(match[1]);
  console.log('@graph items:', json['@graph'].map(item => item['@type']));
  json['@graph'].forEach((item, i) => {
    console.log(`\nItem #${i+1} (${item['@type']}):`, JSON.stringify(item).slice(0, 300));
  });
}
