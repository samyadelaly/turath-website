const fs = require('fs');
const html = fs.readFileSync('action-ar.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('URLSearchParams') || l.includes('location.search') || l.includes('film') || l.includes('currentIndex')) {
    console.log((i+1) + ': ' + l.slice(0, 100));
  }
});
