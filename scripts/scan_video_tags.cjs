const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const matches = [...content.matchAll(/<video[^>]*>/g)];
  if (matches.length > 0) {
    console.log(f, 'has', matches.length, 'video tags');
    matches.forEach((m, idx) => {
      console.log(`  [${idx+1}] ${m[0].slice(0, 80)}...`);
    });
  }
});
