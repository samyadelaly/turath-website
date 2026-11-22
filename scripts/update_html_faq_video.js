import fs from 'fs';

['ar.html', 'index.html'].forEach(filename => {
  let html = fs.readFileSync(filename, 'utf8');
  
  // 1. Remove autoplay and loop from #faq-bg-video
  html = html.replace(/(<video[\s\S]*?id="faq-bg-video"[\s\S]*?)autoplay[\s\n\r]*loop/g, '$1');
  
  // 2. Ensure scene-07 has clear mobile padding
  html = html.replace(/(id="scene-07"[^>]*?class="[^"]*?)\bpt-4\b/g, '$1pt-16 sm:pt-20 lg:pt-4');
  
  fs.writeFileSync(filename, html, 'utf8');
  console.log(`Updated HTML in ${filename}`);
});
