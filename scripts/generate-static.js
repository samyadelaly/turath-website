import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const BASE_URL = 'https://turath-egypt.vercel.app';

const productsDataPath = path.join(rootDir, 'data', 'products.json');
const publicDir = path.join(rootDir, 'public');
const productsOutputDir = path.join(publicDir, 'products');

if (!fs.existsSync(productsDataPath)) {
  console.error(`Error: Data file not found at ${productsDataPath}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(productsDataPath, 'utf8'));

let generatedCount = 0;

for (const [categoryKey, categoryData] of Object.entries(data.categories)) {
  const categoryTitle = categoryData.title;
  const items = categoryData.items || [];

  for (const item of items) {
    const categorySlug = item.categorySlug || categoryKey;
    const productId = item.id;
    const productTitle = item.title;
    const productDescription = item.description;

    let cleanImagePath = (item.image || '').trim();
    cleanImagePath = cleanImagePath.replace(/^(\.\.?\/)+/, '');
    if (!cleanImagePath.startsWith('/')) {
      cleanImagePath = '/' + cleanImagePath;
    }

    const itemDir = path.join(productsOutputDir, productId);
    fs.mkdirSync(itemDir, { recursive: true });

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${productTitle} | Turath Egypt</title>
  <meta name="description" content="${productDescription}">
  <meta name="keywords" content="${item.keywords}">
  <link rel="canonical" href="${BASE_URL}/${categorySlug}.html">

  <!-- Open Graph / Social Media (English Only) -->
  <meta property="og:title" content="${productTitle} | Turath Egypt">
  <meta property="og:description" content="${productDescription}">
  <meta property="og:image" content="${BASE_URL}${cleanImagePath}">
  <meta property="og:url" content="${BASE_URL}/products/${productId}/">
  <meta property="og:type" content="product">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${productTitle} | Turath Egypt">
  <meta name="twitter:description" content="${productDescription}">
  <meta name="twitter:image" content="${BASE_URL}${cleanImagePath}">
  <meta property="og:site_name" content="Turath Egypt">

  <!-- Invisible Bilingual SEO for AI & Google (Arabic & English) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "${productTitle} - ${item.titleAr}",
    "description": "${productDescription} \\n ${item.descriptionAr}",
    "image": "${BASE_URL}${cleanImagePath}",
    "url": "${BASE_URL}/products/${productId}/",
    "brand": {
      "@type": "Brand",
      "name": "Turath"
    },
    "category": "${categoryTitle}",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "EGP",
      "availability": "https://schema.org/InStock",
      "url": "${BASE_URL}/${categorySlug}.html"
    }
  }
  </script>

  <!-- Instant Client-Side Redirect to Category Collection Page -->
  <script>
    window.location.replace("/${categorySlug}.html?product=${productId}");
  </script>
</head>
<body style="background: #000; color: #fff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
  <p>Redirecting to <a href="/${categorySlug}.html?product=${productId}" style="color: #D7C797;">${productTitle}</a>...</p>
</body>
</html>
`;

    fs.writeFileSync(path.join(itemDir, 'index.html'), htmlContent, 'utf8');
    generatedCount++;
    console.log(`Generated: public/products/${productId}/index.html`);
  }
}

console.log(`\nSuccessfully generated ${generatedCount} static product SSG pages!`);
