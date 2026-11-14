import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const BASE_URL = 'https://turath-egypt.vercel.app';
const productsDataPath = path.join(rootDir, 'data', 'products.json');
const publicDir = path.join(rootDir, 'public');
const distDir = path.join(rootDir, 'dist');

const sitemapPublicPath = path.join(publicDir, 'sitemap.xml');
const sitemapDistPath = path.join(distDir, 'sitemap.xml');

const robotsPublicPath = path.join(publicDir, 'robots.txt');
const robotsDistPath = path.join(distDir, 'robots.txt');

// Current date in YYYY-MM-DD format for lastmod
const today = new Date().toISOString().split('T')[0];

if (!fs.existsSync(productsDataPath)) {
  console.error(`Error: Products data file not found at ${productsDataPath}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(productsDataPath, 'utf8'));

const urls = [];

// 1. Homepage
urls.push({
  loc: `${BASE_URL}/`,
  lastmod: today,
  changefreq: 'daily',
  priority: '1.0'
});

// 2. Category Pages
const categoryFiles = [
  'lighting.html',
  'mirrors.html',
  'tables.html',
  'handles.html',
  'handrails.html',
  'decor.html',
  'wall-art.html',
  'partitions.html',
  'tableware.html',
  'masterpieces.html',
  'action.html'
];

for (const catFile of categoryFiles) {
  urls.push({
    loc: `${BASE_URL}/${catFile}`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.9'
  });
}

// 3. Individual Product Pages (gathered from data/products.json)
let productCount = 0;
for (const [categoryKey, categoryData] of Object.entries(data.categories)) {
  const items = categoryData.items || [];
  for (const item of items) {
    const productId = item.id;
    if (!productId) continue;

    urls.push({
      loc: `${BASE_URL}/products/${productId}/`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.8'
    });
    productCount++;
  }
}

// Build standard XML sitemap format
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

// Robots.txt content ensuring all bots and AI search engines have full crawl permissions
const robotsTxt = `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

Sitemap: https://turath-egypt.vercel.app/sitemap.xml
`;

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(sitemapPublicPath, sitemapXml.trim() + '\n', 'utf8');
fs.writeFileSync(robotsPublicPath, robotsTxt.trim() + '\n', 'utf8');

if (fs.existsSync(distDir)) {
  fs.writeFileSync(sitemapDistPath, sitemapXml.trim() + '\n', 'utf8');
  fs.writeFileSync(robotsDistPath, robotsTxt.trim() + '\n', 'utf8');
}

console.log(`\n======================================================`);
console.log(`Sitemap generated successfully!`);
console.log(`Saved to: ${sitemapPublicPath}${fs.existsSync(distDir) ? ' and ' + sitemapDistPath : ''}`);
console.log(`Total URLs: ${urls.length} (1 homepage, ${categoryFiles.length} categories, ${productCount} products)`);
console.log(`Robots.txt verified with all AI search engine permissions.`);
console.log(`======================================================\n`);
