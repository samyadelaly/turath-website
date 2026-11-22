const fs = require('fs');
['index.html', 'ar.html'].forEach(f => {
  const html = fs.readFileSync(f, 'utf8');
  console.log(f, html.includes('id="faq-bg-media"'));
  const lines = html.split('\n');
  lines.forEach((l, i) => {
    if (l.includes('faq-bg-media') || l.includes('faq-bg-sticky')) {
      console.log(f, (i+1), l.trim());
    }
  });
});
