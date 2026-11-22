const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('id="founder"') || l.includes("id='founder'")) {
    console.log((i+1) + ': ' + l.trim());
    console.log('Context:', lines.slice(Math.max(0, i - 5), i + 6).join('\n'));
  }
});
