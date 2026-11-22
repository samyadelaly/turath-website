import fs from 'fs';

['ar.html', 'index.html'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/(founder-dark\.jpg\?v=4"[^>]*?)loading="lazy"/g, '$1loading="eager" fetchpriority="high"');
  content = content.replace(/(founder-lit\.jpg\?v=5"[^>]*?)loading="lazy"/g, '$1loading="eager" fetchpriority="high"');
  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully updated', file);
});
