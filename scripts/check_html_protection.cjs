const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const hasContext = content.includes('contextmenu');
  const hasDrag = content.includes('dragstart');
  const hasTouchCallout = content.includes('-webkit-touch-callout');
  console.log(f.padEnd(22), { hasContext, hasDrag, hasTouchCallout });
});
