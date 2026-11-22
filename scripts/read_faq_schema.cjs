const fs = require('fs');

const ar = fs.readFileSync('ar.html', 'utf8');
const matches = ar.match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/gi) || [];

matches.forEach((m, i) => {
  if (m.includes('FAQPage')) {
    const json = JSON.parse(m.replace(/<script[^>]*>|<\/script>/gi, ''));
    console.log('Script', i, 'Type:', json['@type']);
    if (json.mainEntity) {
      console.log('Total questions:', json.mainEntity.length);
      console.log('Sample Q:', json.mainEntity[0].name);
      console.log('Sample A:', json.mainEntity[0].acceptedAnswer ? json.mainEntity[0].acceptedAnswer.text.slice(0, 100) : null);
    }
  }
});
