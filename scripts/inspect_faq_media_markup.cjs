const fs = require('fs');

['ar.html', 'index.html'].forEach(f => {
  const html = fs.readFileSync(f, 'utf8');
  const start = html.indexOf('id="faq-bg-media"');
  console.log('--- ' + f + ' ---');
  console.log(html.substring(start, start + 800));
});
