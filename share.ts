import type { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { getAllServerProducts } from './metaFeed';
import { getAllServerProjects } from './serverProjectStorage';
import { INITIAL_PRODUCTS } from './initialCatalog';
import { INITIAL_PROJECTS } from './initialProjects';
import { ProductItem, ProjectItem } from './types';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://rpyzvhetoviqpjvncqfy.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_xJpsJH--P7kPUwmrVNOwwQ_T12KVuWG';

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatAbsoluteUrl(url: string, baseUrl: string): string {
  if (!url) return `${baseUrl}/turath_logo.jpg`;
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${cleanBase}${cleanPath}`;
}

export default async function handler(req: Request, res: Response) {
  const query = req.query || {};
  const baseUrl = 'https://turath-egypt.vercel.app';
  const slug = ((query.slug || query.id || query.product || query.project || query.p || '') as string).trim();
  const cleanSlug = slug.toLowerCase();
  const explicitType = ((query.type as string) || '').toLowerCase();

  // Determine if target is a project or product
  const isExplicitProject = explicitType === 'project' || req.path.includes('/projects/') || req.path.includes('/share/project');
  const isExplicitProduct = explicitType === 'product' || req.path.includes('/products/') || req.path.includes('/share/product');

  // Supabase client instance
  let supabase: any = null;
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  } catch {}

  // --------------------------------------------------------------------------
  // 1. PROJECT PREVIEW RESOLUTION
  // --------------------------------------------------------------------------
  if (isExplicitProject || (!isExplicitProduct && slug)) {
    let matchedProject: ProjectItem | null = null;

    // A. Query Supabase projects table
    if (supabase && cleanSlug) {
      try {
        const { data } = await supabase
          .from('projects')
          .select('*')
          .or(`slug.ilike.${cleanSlug},id.eq.${cleanSlug}`)
          .maybeSingle();

        if (data) {
          matchedProject = {
            id: data.id,
            title: data.title,
            titleAR: data.title_ar,
            slug: data.slug || data.id,
            location: data.location || 'Cairo, Egypt',
            projectType: data.project_type || 'Custom Project',
            year: data.year,
            shortDescription: data.short_description,
            description: data.description || '',
            craftStory: data.craft_story,
            materials: data.materials || 'Solid Egyptian Yellow Brass',
            finish: data.finish,
            workDelivered: Array.isArray(data.work_delivered) ? data.work_delivered : [],
            customManufacturing: data.custom_manufacturing,
            coverImage: data.cover_image,
            mediaType: data.media_type || 'image',
            coverRatio: data.cover_ratio || 'Original',
            coverFit: data.cover_fit || 'cover',
            gallery: Array.isArray(data.gallery) ? data.gallery : [],
            published: data.published !== false,
            sortOrder: data.sort_order || 0,
            seoTitle: data.seo_title,
            metaDescription: data.meta_description,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
        }
      } catch {}
    }

    // B. Check site_content projects_catalog in Supabase if not found
    if (!matchedProject && supabase && cleanSlug) {
      try {
        const { data } = await supabase
          .from('site_content')
          .select('content')
          .eq('id', 'projects_catalog')
          .maybeSingle();

        if (data?.content && Array.isArray(data.content.projects)) {
          matchedProject = data.content.projects.find(
            (p: ProjectItem) =>
              (p.slug && p.slug.toLowerCase() === cleanSlug) ||
              (p.id && p.id.toLowerCase() === cleanSlug)
          ) || null;
        }
      } catch {}
    }

    // C. Fallback to server projects / INITIAL_PROJECTS
    if (!matchedProject) {
      let serverProjects: ProjectItem[] = [];
      try {
        serverProjects = getAllServerProjects();
      } catch {}
      if (!serverProjects || serverProjects.length === 0) {
        serverProjects = INITIAL_PROJECTS;
      }
      matchedProject = serverProjects.find(
        (p) =>
          (p.slug && p.slug.toLowerCase() === cleanSlug) ||
          (p.id && p.id.toLowerCase() === cleanSlug)
      ) || null;
    }

    // If explicit project requested OR matched a project, render project metadata
    if (matchedProject || isExplicitProject) {
      const proj = matchedProject || INITIAL_PROJECTS[0];
      const projectSlug = proj.slug || proj.id;
      const targetUrl = `${baseUrl}/projects/${projectSlug}`;

      const title = `${proj.title} | TURATH Egypt`;
      const rawDesc = proj.metaDescription || proj.shortDescription || proj.description || 'Authentic handcrafted Egyptian brass and luxury architectural metalwork.';
      const description = rawDesc.length > 200 ? rawDesc.slice(0, 197) + '...' : rawDesc;

      const rawImg = proj.coverImage || (Array.isArray(proj.gallery) && proj.gallery[0]) || '/turath_logo.jpg';
      const imageUrl = formatAbsoluteUrl(rawImg, baseUrl);

      const html = generateShareHtml({
        title,
        description,
        imageUrl,
        targetUrl,
        ogType: 'article',
        heading: proj.title,
        buttonText: 'View Project on TURATH &rarr;',
      });

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');
      return res.send(html);
    }
  }

  // --------------------------------------------------------------------------
  // 2. PRODUCT PREVIEW RESOLUTION
  // --------------------------------------------------------------------------
  let matchedProduct: ProductItem | null = null;

  // A. Query Supabase products table
  if (supabase && cleanSlug) {
    try {
      const { data } = await supabase
        .from('products')
        .select('*')
        .or(`seo_slug.ilike.${cleanSlug},id.eq.${cleanSlug},sku.ilike.${cleanSlug}`)
        .maybeSingle();

      if (data) {
        matchedProduct = {
          id: data.id,
          sku: data.sku || data.id,
          categoryId: data.category_id || 'mirrors',
          name: data.name_en || data.name || 'Untitled Piece',
          nameEN: data.name_en || data.name || 'Untitled Piece',
          nameAR: data.name_ar,
          tagline: data.tagline || data.short_desc_en || '',
          shortDescEN: data.short_desc_en,
          shortDescAR: data.short_desc_ar,
          description: data.description || '',
          fullDescriptionEN: data.full_description_en || data.description,
          mainImage: data.main_image || '',
          images: Array.isArray(data.images) ? data.images : [],
          galleryImages: Array.isArray(data.gallery_images) ? data.gallery_images : [],
          mediaType: data.media_type || 'image',
          materials: data.materials || 'Solid Egyptian Yellow Brass',
          dimensions: data.dimensions || 'Custom Sizing',
          price: data.price,
          availability: data.availability,
          seoSlug: data.seo_slug || data.id,
          seoTitle: data.seo_title,
          metaDescription: data.meta_description,
          finishOptions: Array.isArray(data.finish_options) ? data.finish_options : [],
        };
      }
    } catch {}
  }

  // B. Fallback to server products or INITIAL_PRODUCTS
  if (!matchedProduct) {
    let serverProducts: ProductItem[] = [];
    try {
      serverProducts = getAllServerProducts();
    } catch {}
    if (!serverProducts || serverProducts.length === 0) {
      serverProducts = INITIAL_PRODUCTS;
    }

    if (cleanSlug) {
      matchedProduct = serverProducts.find(
        (p) =>
          (p.seoSlug && p.seoSlug.toLowerCase() === cleanSlug) ||
          p.id.toLowerCase() === cleanSlug ||
          (p.sku && p.sku.toLowerCase() === cleanSlug)
      ) || null;
    }

    if (!matchedProduct) {
      matchedProduct = serverProducts[0] || INITIAL_PRODUCTS[0];
    }
  }

  const category = (query.category as string) || matchedProduct.categoryId || 'mirrors';
  const productSlug = matchedProduct.seoSlug || matchedProduct.id;
  const targetUrl = `${baseUrl}/products/${category}/${productSlug}`;

  const title = `${matchedProduct.nameEN || matchedProduct.name} | TURATH Egypt`;
  const rawDesc = matchedProduct.metaDescription || matchedProduct.shortDescEN || matchedProduct.fullDescriptionEN || matchedProduct.description || 'Authentic handcrafted Egyptian brass and luxury metalwork.';
  const description = rawDesc.length > 200 ? rawDesc.slice(0, 197) + '...' : rawDesc;

  const rawImg = matchedProduct.mainImage || (matchedProduct.images && matchedProduct.images[0]) || '/turath_logo.jpg';
  const imageUrl = formatAbsoluteUrl(rawImg, baseUrl);

  const html = generateShareHtml({
    title,
    description,
    imageUrl,
    targetUrl,
    ogType: 'product',
    heading: matchedProduct.nameEN || matchedProduct.name,
    buttonText: 'View Piece on TURATH &rarr;',
  });

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');
  return res.send(html);
}

function generateShareHtml({
  title,
  description,
  imageUrl,
  targetUrl,
  ogType,
  heading,
  buttonText,
}: {
  title: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
  ogType: 'product' | 'article';
  heading: string;
  buttonText: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(targetUrl)}">

  <!-- Open Graph / Facebook / WhatsApp / LinkedIn / Telegram -->
  <meta property="og:type" content="${escapeHtml(ogType)}">
  <meta property="og:site_name" content="TURATH Egypt | تراث للصناعات النحاسية">
  <meta property="og:url" content="${escapeHtml(targetUrl)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${escapeHtml(imageUrl)}">
  <meta property="og:image:secure_url" content="${escapeHtml(imageUrl)}">
  <meta property="og:image:alt" content="${escapeHtml(heading)}">
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
      max-width: 520px;
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
      <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(heading)}">
    </div>
    <h1>${escapeHtml(heading)}</h1>
    <p>${escapeHtml(description)}</p>
    <a class="btn" href="${escapeHtml(targetUrl)}">${buttonText}</a>
  </div>
</body>
</html>`;
}
