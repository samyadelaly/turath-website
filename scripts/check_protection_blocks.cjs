const fs = require('fs');

const subFiles = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'index.html' && f !== 'ar.html');

subFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const idx = content.indexOf('// Surgical Image & Media Protection');
  if (idx !== -1) {
    console.log(f, 'found block at line', content.substring(0, idx).split('\n').length);
  } else {
    console.log(f, 'BLOCK NOT FOUND');
  }
});
