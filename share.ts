import type { Request, Response } from 'express';
import { getAllServerProducts } from './metaFeed';
import { INITIAL_PRODUCTS } from './initialCatalog';
import { ProductItem } from './types';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default function handler(req: Request, res: Response) {
  const query = req.query || {};
  const slug = (query.slug || query.id || query.product || query.p || '') as string;
  const baseUrl = 'https://turath-egypt.vercel.app';

  let products: ProductItem[] = [];
  try {
    products = getAllServerProducts();
  } catch {
    products = INITIAL_PRODUCTS;
  }
  if (!products || products.length === 0) {
    products = INITIAL_PRODUCTS;
  }

  const cleanSlug = slug.toLowerCase().trim();
  const matched =
    products.find(
      (p) =>
        (p.seoSlug && p.seoSlug.toLowerCase() === cleanSlug) ||
        p.id.toLowerCase() === cleanSlug ||
        (p.sku && p.sku.toLowerCase() === cleanSlug)
    ) || products[0];

  const category = matched.categoryId || 'mirrors';
  const productSlug = matched.seoSlug || matched.id;
  const targetUrl = `${baseUrl}/products/${category}/${productSlug}`;

  const title = `${matched.nameEN || matched.name} | TURATH Egypt`;
  const rawDesc = matched.metaDescription || matched.shortDescEN || matched.description || 'Authentic handcrafted Egyptian brass and luxury metalwork.';
  const description = rawDesc.length > 200 ? rawDesc.slice(0, 197) + '...' : rawDesc;

  let rawImg = matched.mainImage || (matched.images && matched.images[0]) || '/turath_logo.jpg';
  let imageUrl = rawImg;
  if (!imageUrl.startsWith('http')) {
    imageUrl = `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  
  <!-- Open Graph / Facebook / WhatsApp / LinkedIn / Telegram -->
  <meta property="og:type" content="product">
  <meta property="og:site_name" content="TURATH Egypt | تراث للصناعات النحاسية">
  <meta property="og:url" content="${escapeHtml(targetUrl)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${escapeHtml(imageUrl)}">
  <meta property="og:image:secure_url" content="${escapeHtml(imageUrl)}">
  <meta property="og:image:alt" content="${escapeHtml(matched.nameEN || matched.name)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${escapeHtml(targetUrl)}">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}">

  <!-- Fast client redirect for real human visitors -->
  <meta http-equiv="refresh" content="0;url=${escapeHtml(targetUrl)}">
  <script>
    window.location.replace(${JSON.stringify(targetUrl)});
  </script>

  <style>
    body {
      background-color: #050505;
      color: #f5f0e6;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }
    .card {
      max-width: 480px;
      width: 100%;
      background: #0d0d10;
      border: 1px solid #d4c59d;
      border-radius: 16px;
      overflow: hidden;
      text-align: center;
      padding: 24px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.8);
    }
    .img-wrap {
      width: 100%;
      height: 280px;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 20px;
      background: #000;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    h1 {
      font-size: 1.25rem;
      color: #f5f0e6;
      margin: 0 0 10px 0;
    }
    p {
      color: #a89f88;
      font-size: 0.9rem;
      line-height: 1.5;
      margin-bottom: 20px;
    }
    .btn {
      display: inline-block;
      background: #d4c59d;
      color: #000000;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 0.8rem;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      transition: background 0.2s;
    }
    .btn:hover {
      background: #e6d8b5;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="img-wrap">
      <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(matched.nameEN || matched.name)}">
    </div>
    <h1>${escapeHtml(matched.nameEN || matched.name)}</h1>
    <p>${escapeHtml(description)}</p>
    <a class="btn" href="${escapeHtml(targetUrl)}">View Piece on TURATH &rarr;</a>
  </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');
  return res.send(html);
}
