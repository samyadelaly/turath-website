import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

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
    const itemDir = path.join(productsOutputDir, item.id);
    fs.mkdirSync(itemDir, { recursive: true });

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${item.title} | Turath</title>
  <meta name="description" content="${item.description}">
  <meta name="keywords" content="${item.keywords}">
  <link rel="canonical" href="https://turath-egypt.vercel.app/${categorySlug}.html">

  <!-- Open Graph / Social Media (English Only) -->
  <meta property="og:type" content="product">
  <meta property="og:title" content="${item.title}">
  <meta property="og:description" content="${item.description}">
  <meta property="og:image" content="https://turath-egypt.vercel.app${item.image}">
  <meta property="og:url" content="https://turath-egypt.vercel.app/products/${item.id}/">
  <meta property="og:site_name" content="Turath Egypt">

  <!-- Twitter Card (English Only) -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${item.title}">
  <meta name="twitter:description" content="${item.description}">
  <meta name="twitter:image" content="https://turath-egypt.vercel.app${item.image}">

  <!-- Invisible Bilingual SEO for AI & Google (Arabic & English) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "${item.title} - ${item.titleAr}",
    "description": "${item.description} \\n ${item.descriptionAr}",
    "image": "https://turath-egypt.vercel.app${item.image}",
    "url": "https://turath-egypt.vercel.app/products/${item.id}/",
    "brand": {
      "@type": "Brand",
      "name": "Turath"
    },
    "category": "${categoryTitle}",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "EGP",
      "availability": "https://schema.org/InStock",
      "url": "https://turath-egypt.vercel.app/${categorySlug}.html"
    }
  }
  </script>

  <!-- Instant Client-Side Redirect to Category Collection Page -->
  <script>
    window.location.replace("/${categorySlug}.html");
  </script>
</head>
<body style="background: #000; color: #fff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
  <p>Redirecting to <a href="/${categorySlug}.html" style="color: #D7C797;">${item.title}</a>...</p>
</body>
</html>
`;

    fs.writeFileSync(path.join(itemDir, 'index.html'), htmlContent, 'utf8');
    generatedCount++;
    console.log(`Generated: public/products/${item.id}/index.html`);
  }
}

console.log(`\nSuccessfully generated ${generatedCount} static product SSG pages!`);
