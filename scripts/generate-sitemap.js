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

// 1. Homepages (English & Arabic) & Catalog Hub
urls.push({
  loc: `${BASE_URL}/`,
  lastmod: today,
  changefreq: 'daily',
  priority: '1.0'
});

urls.push({
  loc: `${BASE_URL}/ar.html`,
  lastmod: today,
  changefreq: 'daily',
  priority: '1.0'
});

urls.push({
  loc: `${BASE_URL}/products/`,
  lastmod: today,
  changefreq: 'weekly',
  priority: '0.9'
});

// 2. Category Pages (English + Arabic)
const categoryFiles = [
  'lighting.html', 'lighting-ar.html',
  'mirrors.html', 'mirrors-ar.html',
  'tables.html', 'tables-ar.html',
  'handles.html', 'handles-ar.html',
  'handrails.html', 'handrails-ar.html',
  'decor.html', 'decor-ar.html',
  'wall-art.html', 'wall-art-ar.html',
  'partitions.html', 'partitions-ar.html',
  'tableware.html', 'tableware-ar.html',
  'masterpieces.html', 'masterpieces-ar.html',
  'action.html', 'action-ar.html'
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

    // Exclude non-canonical showcase items to ensure 100% canonical index (Google Search Central best practice)
    if (item.canonicalId || item.canonicalUrl || item.isShowcaseOf) {
      continue;
    }

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

# Search Engine Crawlers
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: YandexBot
Allow: /

# OpenAI Crawlers (ChatGPT Search & AI Training)
User-agent: OAI-SearchBot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

# Google AI & Gemini Crawlers
User-agent: Google-Extended
Allow: /

User-agent: GoogleOther
Allow: /

# Anthropic Claude Crawlers
User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

# Perplexity AI Crawler
User-agent: PerplexityBot
Allow: /

# Apple Intelligence Crawlers
User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

# Foundational AI & Research Crawlers
User-agent: CCBot
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: FacebookBot
Allow: /

User-agent: YouBot
Allow: /

# Sitemap Location
Sitemap: https://turath-egypt.vercel.app/sitemap.xml
`;

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(sitemapPublicPath, sitemapXml.trim() + '\n', 'utf8');
fs.writeFileSync(robotsPublicPath, robotsTxt.trim() + '\n', 'utf8');

if (fs.existsSync(distDir)) {
  fs.writeFileSync(sitemapDistPath, sitemapXml.trim() + '\n', 'utf8');
  fs.writeFileSync(robotsDistPath, robotsTxt.trim() + '\n', 'utf8');
  const llmsPublic = path.join(publicDir, 'llms.txt');
  const llmsDist = path.join(distDir, 'llms.txt');
  if (fs.existsSync(llmsPublic)) fs.copyFileSync(llmsPublic, llmsDist);
  const llmsFullPublic = path.join(publicDir, 'llms-full.txt');
  const llmsFullDist = path.join(distDir, 'llms-full.txt');
  if (fs.existsSync(llmsFullPublic)) fs.copyFileSync(llmsFullPublic, llmsFullDist);
}

console.log(`\n======================================================`);
console.log(`Sitemap generated successfully!`);
console.log(`Saved to: ${sitemapPublicPath}${fs.existsSync(distDir) ? ' and ' + sitemapDistPath : ''}`);
console.log(`Total URLs: ${urls.length} (2 homepages, ${categoryFiles.length} categories, ${productCount} products)`);
console.log(`Robots.txt verified with all AI search engine permissions.`);
console.log(`======================================================\n`);
