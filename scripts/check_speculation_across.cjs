const fs = require('fs');

const subpages = [
  'ar.html', 'index.html',
  'action-ar.html', 'action.html',
  'lighting-ar.html', 'lighting.html'
];

subpages.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  console.log(`${file} has speculationrules? ${content.includes('type="speculationrules"')}`);
});
