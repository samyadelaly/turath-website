const fs = require('fs');

const html = fs.readFileSync('ar.html', 'utf8');
const matches = [...html.matchAll(/<script[^>]*type=[\"']application\/ld\+json[\"'][^>]*>([\s\S]*?)<\/script>/g)];

matches.forEach((m, idx) => {
  const json = JSON.parse(m[1]);
  console.log(`\n================ SCHEMA ${idx+1} (${Array.isArray(json['@type']) ? json['@type'].join(', ') : json['@type']}) ================`);
  console.log(JSON.stringify(json, null, 2).slice(0, 800) + '...');
});
