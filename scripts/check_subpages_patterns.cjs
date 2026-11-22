const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && !f.startsWith('action') && !f.startsWith('index') && !f.startsWith('ar') && !f.startsWith('calculator'));

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const hasShare = content.includes('const shareBtn = document.getElementById(\'share-btn\');');
  const hasWa = content.includes('const productWaBtn = document.getElementById(\'product-wa-btn\');');
  const hasProtection = content.includes('// Surgical Image & Media Protection');
  console.log(f, { hasShare, hasWa, hasProtection });
});
