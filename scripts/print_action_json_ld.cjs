const fs = require('fs');

['action.html', 'action-ar.html'].forEach(f => {
  const html = fs.readFileSync(f, 'utf8');
  const match = html.match(/<script[^>]*type=[\"']application\/ld\+json[\"'][^>]*>([\s\S]*?)<\/script>/);
  if (match) {
    console.log(`=== ${f} JSON-LD ===`);
    console.log(match[1].slice(0, 500));
  }
});
