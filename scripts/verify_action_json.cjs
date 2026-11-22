const fs = require('fs');

['action-ar.html', 'action.html'].forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const match = content.match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/);
  try {
    const json = JSON.parse(match[1]);
    const types = json['@graph'].map(item => item['@type']);
    console.log(f, 'VALID JSON! Types count:', types.length, 'Types:', types);
  } catch(e) {
    console.error(f, 'INVALID JSON:', e.message);
  }
});
