const fs = require('fs');
const html = fs.readFileSync('lighting-ar.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('URLSearchParams') || l.includes('location.search')) {
    console.log((i+1) + ': ' + l.trim());
  }
});
