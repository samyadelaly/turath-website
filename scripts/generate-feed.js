import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const BASE_URL = 'https://turath-egypt.vercel.app';
const productsDataPath = path.join(rootDir, 'data', 'products.json');
const outputPath = path.join(rootDir, 'public', 'feed.xml');

function sanitizeCdata(str) {
  if (!str) return '';
  return String(str).replace(/]]>/g, ']]]]><![CDATA[>').trim();
}

async function generateFeed() {
  console.log('Generating product catalog feed (Meta & Google Merchant)...');

  if (!fs.existsSync(productsDataPath)) {
    console.error(`products.json not found at ${productsDataPath}`);
    process.exit(1);
  }

  const rawJson = fs.readFileSync(productsDataPath, 'utf8');
  const catalog = JSON.parse(rawJson);

  let itemCount = 0;
  const itemsXml = [];

  const categories = catalog.categories || {};
  for (const [slug, catData] of Object.entries(categories)) {
    const categoryTitle = catData.title || slug;
    const items = catData.items || [];

    for (const item of items) {
      if (!item.id || !item.title) continue;

      let cleanImagePath = (item.image || '/assets/images/commute-poster.jpg').split('?')[0].replace(/^(\.\.?\/)+/, '');
      if (!cleanImagePath.startsWith('/')) {
        cleanImagePath = '/' + cleanImagePath;
      }
      const imageUrl = `${BASE_URL}${cleanImagePath}`;
      const productUrl = `${BASE_URL}/products/${item.id}/`;

      const title = sanitizeCdata(item.title);
      const description = sanitizeCdata(item.description || item.descriptionAr || item.title);

      itemsXml.push(`    <item>
      <g:id>${item.id}</g:id>
      <g:title><![CDATA[${title} | Turath Egypt]]></g:title>
      <g:description><![CDATA[${description}]]></g:description>
      <g:link>${productUrl}</g:link>
      <g:image_link>${imageUrl}</g:image_link>
      <g:brand>Turath Egypt</g:brand>
      <g:condition>new</g:condition>
      <g:availability>in_stock</g:availability>
      <g:price>0.00 EGP</g:price>
      <g:product_type><![CDATA[${categoryTitle}]]></g:product_type>
      <g:custom_label_0>Bespoke Solid Brass</g:custom_label_0>
      <g:custom_label_1>Cairo Heritage Metalwork</g:custom_label_1>
    </item>`);

      itemCount++;
    }
  }

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Turath Egypt | ورشة تراث للصناعات النحاسية</title>
    <link>${BASE_URL}</link>
    <description>Handcrafted solid brass and red copper architectural metalwork, bespoke lighting, luxury furniture, and artisanal metal casting from Historic Cairo, Egypt.</description>
${itemsXml.join('\n')}
  </channel>
</rss>
`;

  fs.writeFileSync(outputPath, xmlContent, 'utf8');
  console.log(`Successfully generated feed.xml with ${itemCount} products at ${outputPath}`);
}

generateFeed().catch(err => {
  console.error('Error generating feed.xml:', err);
  process.exit(1);
});
