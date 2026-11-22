const fs = require('fs');
let content = fs.readFileSync('ar.html', 'utf8');
content = content.replace(/<base\s+href=["'][^"']*["']\s*\/?>\r?\n?/i, '');
fs.writeFileSync('ar.html', content, 'utf8');
console.log('Removed base tag from ar.html successfully.');
