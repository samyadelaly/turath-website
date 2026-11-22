const fs = require('fs');
const html = fs.readFileSync('ar.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('<video')) {
    console.log((i+1) + ': ' + l.slice(0, 100));
  }
});
