const fs = require('fs');
const html = fs.readFileSync('action-ar.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('videoEl')) {
    console.log((i+1) + ': ' + l.trim());
  }
});
