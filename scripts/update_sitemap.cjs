const fs = require('fs');

let sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');

// Update all 2026-11-19 dates to 2026-11-22
sitemap = sitemap.replace(/<lastmod>2026-11-19<\/lastmod>/g, '<lastmod>2026-11-22</lastmod>');

// Check if calculator.html is present
if (!sitemap.includes('calculator.html')) {
  const calcEntry = `  <url>
    <loc>https://turath-egypt.vercel.app/calculator.html</loc>
    <lastmod>2026-11-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  sitemap = sitemap.replace('</urlset>', calcEntry + '</urlset>');
  console.log('Added calculator.html to sitemap.xml');
}

fs.writeFileSync('public/sitemap.xml', sitemap, 'utf8');
console.log('Successfully updated sitemap.xml');
