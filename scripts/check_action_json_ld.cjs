const fs = require('fs');

['action.html', 'action-ar.html'].forEach(f => {
  const html = fs.readFileSync(f, 'utf8');
  const matches = [...html.matchAll(/<script[^>]*type=[\"']application\/ld\+json[\"'][^>]*>([\s\S]*?)<\/script>/g)];
  console.log(`=== ${f}: found ${matches.length} JSON-LD schemas ===`);
  matches.forEach((m, idx) => {
    try {
      const data = JSON.parse(m[1]);
      console.log(`Schema #${idx+1} @type:`, data['@type']);
    } catch(e) {
      console.log(`Schema #${idx+1} Error:`, e.message);
    }
  });
});
