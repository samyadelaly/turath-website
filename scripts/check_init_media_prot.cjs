const fs = require('fs');
const js = fs.readFileSync('src/main.js', 'utf8');
const lines = js.split('\n');
lines.forEach((l, i) => {
  if (l.includes('initMediaProtection')) {
    console.log((i+1) + ': ' + l.trim());
  }
});
