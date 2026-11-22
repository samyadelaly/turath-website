const fs = require('fs');

['ar.html', 'index.html'].forEach(file => {
  const c = fs.readFileSync(file, 'utf8');
  const matches = c.match(/<script[^>]+type=[\"']application\/ld\+json[\"'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  matches.forEach((m, idx) => {
    try {
      const json = JSON.parse(m.replace(/<script[^>]*>|<\/script>/gi, ''));
      console.log(file, 'Script #' + (idx+1), 'JSON valid! Type:', json['@type']);
      if (json.keywords) console.log('  Keywords count in Schema:', json.keywords.length);
    } catch(e) {
      console.error(file, 'Script #' + (idx+1), 'INVALID JSON!', e.message);
    }
  });
});
