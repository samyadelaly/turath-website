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

function isSupabaseStorageUrl(url?: string): boolean {
  if (!url) return false;
  return url.includes('supabase.co/storage/v1/object/public/');
}

function isUnsplashUrl(url?: string): boolean {
  if (!url) return false;
  return url.includes('images.unsplash.com');
}

function formatAbsoluteUrl(url: string | undefined, baseUrl: string): string {
  if (!url || !url.trim()) return `${baseUrl}/turath_logo.jpg`;
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

  // Extract path parts if available
  const rawPath = req.originalUrl || req.path || '';
  const cleanPathOnly = rawPath.split('?')[0];
  const pathParts = cleanPathOnly.split('/').filter(Boolean);

  let category = ((query.category || query.cat || '') as string).trim();
  let slug = ((query.slug || query.id || query.product || query.project || query.p || '') as string).trim();

  // If path has route info and slug is empty
  if (!slug && pathParts.length >= 2) {
    if (pathParts[0] === 'products') {
      if (pathParts.length >= 3) {
        category = pathParts[1];
        slug = pathParts[2];
      } else {
        slug = pathParts[1];
      }
    } else if (pathParts[0] === 'projects') {
      slug = pathParts[1];
    }
  }

  const explicitType = ((query.type as string) || '').toLowerCase();
  const isExplicitProject = explicitType === 'project' || cleanPathOnly.startsWith('/projects') || cleanPathOnly.includes('/share/project');
  const isExplicitProduct = explicitType === 'product' || cleanPathOnly.startsWith('/products') || cleanPathOnly.includes('/share/product');

  const cleanSlug = slug.toLowerCase();
  const cleanCat = category.toLowerCase();

  // Supabase client instance
  let supabase: any = null;
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  } catch {}

  // Helper to resolve project from Supabase or memory
  async function resolveProject(targetSlug: string): Promise<ProjectItem | null> {
    if (!targetSlug) return null;

    // A. Check site_content -> projects_catalog in Supabase
    if (supabase) {
      try {
        const { data } = await supabase
          .from('site_content')
          .select('*')
          .eq('id', 'projects_catalog')
          .maybeSingle();

        if (data && data.content) {
          const list: any[] = Array.isArray(data.content) ? data.content : data.content.projects;
          if (Array.isArray(list)) {
            const found = list.find(
              (p: any) =>
                (p.slug && p.slug.toLowerCase() === targetSlug) ||
                (p.id && p.id.toLowerCase() === targetSlug)
            );
            if (found) {
              return {
                id: found.id,
                title: found.title,
                titleAR: found.titleAR || found.title_ar,
                slug: found.slug || found.id,
                location: found.location || 'Cairo, Egypt',
                projectType: found.projectType || found.project_type || 'Custom Project',
                year: found.year,
                shortDescription: found.shortDescription || found.short_description,
                description: found.description || '',
                craftStory: found.craftStory || found.craft_story,
                materials: found.materials || 'Solid Egyptian Yellow Brass',
                finish: found.finish,
                workDelivered: Array.isArray(found.workDelivered) ? found.workDelivered : [],
                customManufacturing: found.customManufacturing || found.custom_manufacturing,
                coverImage: found.coverImage || found.cover_image,
                mediaType: found.mediaType || found.media_type || 'image',
                coverRatio: found.coverRatio || found.cover_ratio || 'Original',
                coverFit: found.coverFit || found.cover_fit || 'cover',
                gallery: Array.isArray(found.gallery) ? found.gallery : [],
                published: found.published !== false,
                sortOrder: found.sortOrder || found.sort_order || 0,
                seoTitle: found.seoTitle || found.seo_title,
                metaDescription: found.metaDescription || found.meta_description,
                createdAt: found.createdAt || found.created_at,
                updatedAt: found.updatedAt || found.updated_at,
              };
            }
          }
        }
      } catch {}
    }

    // B. Check Supabase projects table (if exists)
    if (supabase) {
      try {
        const { data } = await supabase
          .from('projects')
          .select('*')
          .or(`slug.ilike.${targetSlug},id.eq.${targetSlug}`)
          .maybeSingle();

        if (data) {
          return {
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

    // C. Fallback to server projects / INITIAL_PROJECTS
    let serverProjects: ProjectItem[] = [];
    try {
      serverProjects = getAllServerProjects();
    } catch {}
    if (!serverProjects || serverProjects.length === 0) {
      serverProjects = INITIAL_PROJECTS;
    }
    return (
      serverProjects.find(
        (p) =>
          (p.slug && p.slug.toLowerCase() === targetSlug) ||
          (p.id && p.id.toLowerCase() === targetSlug)
      ) || null
    );
  }

  function sendProjectHtml(proj: ProjectItem) {
    const projectSlug = proj.slug || proj.id;
    const targetUrl = `${baseUrl}/projects/${projectSlug}`;

    const title = `${proj.title} | TURATH Egypt`;
    const rawDesc =
      proj.metaDescription ||
      proj.shortDescription ||
      proj.description ||
      'Authentic handcrafted Egyptian brass and luxury architectural metalwork.';
    const description = rawDesc.length > 200 ? rawDesc.slice(0, 197) + '...' : rawDesc;

    const rawImg =
      proj.coverImage ||
      (Array.isArray(proj.gallery) && proj.gallery[0]) ||
      '/turath_logo.jpg';
    const imageUrl = formatAbsoluteUrl(rawImg, baseUrl);

    const html = generateShareHtml({
      title,
      description,
      imageUrl,
      targetUrl,
      canonicalUrl: targetUrl,
      ogType: 'article',
      heading: proj.title,
      buttonText: 'View Project on TURATH &rarr;',
    });

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');
    return res.send(html);
  }

  // ==========================================================================
  // 1. EXPLICIT PROJECT PREVIEW RESOLUTION
  // ==========================================================================
  if (isExplicitProject) {
    const matchedProject = await resolveProject(cleanSlug);
    if (matchedProject) {
      return sendProjectHtml(matchedProject);
    }
  }

  // ==========================================================================
  // 2. PRODUCT PREVIEW RESOLUTION
  // ==========================================================================
  let matchedProduct: ProductItem | null = null;
  let matchedCategoryInfo: { id: string; name: string; description: string; coverImage: string } | null = null;

  if (supabase && cleanSlug) {
    try {
      // 1) Direct product lookup by seo_slug, id, or sku
      const { data: directMatch } = await supabase
        .from('products')
        .select('*')
        .or(`seo_slug.ilike.${cleanSlug},id.eq.${cleanSlug},sku.ilike.${cleanSlug}`);

      if (directMatch && directMatch.length > 0) {
        let chosen = directMatch[0];
        if (cleanCat) {
          const catMatch = directMatch.find((p: any) => p.category_id && p.category_id.toLowerCase() === cleanCat);
          if (catMatch) chosen = catMatch;
        }
        matchedProduct = mapSupabaseProduct(chosen);
      }

      // 2) If not found, check if cleanSlug is a category_id in products table
      if (!matchedProduct) {
        const { data: catProducts } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', cleanSlug)
          .order('featured', { ascending: false })
          .order('created_at', { ascending: false });

        if (catProducts && catProducts.length > 0) {
          matchedProduct = mapSupabaseProduct(catProducts[0]);
        }
      }

      // 3) Check categories table in Supabase
      if (!matchedProduct) {
        const { data: catRow } = await supabase
          .from('categories')
          .select('*')
          .eq('id', cleanSlug)
          .maybeSingle();

        if (catRow) {
          matchedCategoryInfo = {
            id: catRow.id,
            name: catRow.name || 'Brass and Copper Collection',
            description: catRow.description || catRow.short_desc || 'Handcrafted Egyptian Brass Collection',
            coverImage: catRow.cover_image || '',
          };

          const { data: catProds } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', catRow.id)
            .order('featured', { ascending: false })
            .order('created_at', { ascending: false });

          if (catProds && catProds.length > 0) {
            matchedProduct = mapSupabaseProduct(catProds[0]);
          }
        }
      }
    } catch (e) {
      console.error('[share.ts] Supabase query error:', e);
    }
  }

  // Fallback to server products or INITIAL_PRODUCTS
  if (!matchedProduct && !matchedCategoryInfo) {
    let serverProducts: ProductItem[] = [];
    try {
      serverProducts = getAllServerProducts();
    } catch {}
    if (!serverProducts || serverProducts.length === 0) {
      serverProducts = INITIAL_PRODUCTS;
    }

    if (cleanSlug) {
      matchedProduct =
        serverProducts.find(
          (p) =>
            (p.seoSlug && p.seoSlug.toLowerCase() === cleanSlug) ||
            p.id.toLowerCase() === cleanSlug ||
            (p.sku && p.sku.toLowerCase() === cleanSlug) ||
            (p.categoryId && p.categoryId.toLowerCase() === cleanSlug)
        ) || null;
    }
  }

  // If no product or category matched, check if it matches a project
  if (!matchedProduct && !matchedCategoryInfo && !isExplicitProduct && cleanSlug) {
    const matchedProject = await resolveProject(cleanSlug);
    if (matchedProject) {
      return sendProjectHtml(matchedProject);
    }
  }

  // If a slug was requested but no product, project, or category matched, return clean 404
  if (!matchedProduct && !matchedCategoryInfo) {
    if (cleanSlug) {
      res.status(404).setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Piece Not Found | TURATH Egypt</title>
  <meta name="robots" content="noindex, nofollow">
  <style>
    body { background: #050505; color: #f5f0e6; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; padding: 20px; }
    .box { max-width: 480px; background: #0d0d10; border: 1px solid #d4c59d; border-radius: 16px; padding: 36px 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.8); }
    h1 { color: #d4c59d; margin: 0 0 12px 0; font-size: 1.5rem; }
    p { color: #9e9174; line-height: 1.6; margin: 0 0 24px 0; font-size: 0.95rem; }
    a { display: inline-block; background: #d4c59d; color: #000; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 8px; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px; }
  </style>
</head>
<body>
  <div class="box">
    <h1>Piece Not Found</h1>
    <p>The requested handcrafted piece or project could not be found in the TURATH collection.</p>
    <a href="${baseUrl}/products">Explore Catalog &rarr;</a>
  </div>
</body>
</html>`);
    }
  }

  // Build Social Metadata response
  let title = '';
  let description = '';
  let imageUrl = '';
  let targetUrl = '';
  let canonicalUrl = '';
  let heading = '';

  if (matchedProduct) {
    const prodCat = category || matchedProduct.categoryId || 'mirrors';
    const prodSlug = matchedProduct.seoSlug || matchedProduct.id;

    if (cleanPathOnly.startsWith('/products/') && cleanPathOnly.includes(cleanSlug)) {
      targetUrl = `${baseUrl}${cleanPathOnly}`;
      canonicalUrl = `${baseUrl}${cleanPathOnly}`;
    } else if (category && slug) {
      targetUrl = `${baseUrl}/products/${prodCat}/${prodSlug}`;
      canonicalUrl = `${baseUrl}/products/${prodCat}/${prodSlug}`;
    } else {
      targetUrl = `${baseUrl}/products/${slug || prodSlug}`;
      canonicalUrl = `${baseUrl}/products/${slug || prodSlug}`;
    }

    heading = matchedProduct.nameEN || matchedProduct.name || 'Handcrafted Brass Piece';
    title = `${heading} | TURATH Egypt`;

    const rawDesc =
      matchedProduct.metaDescription ||
      matchedProduct.shortDescEN ||
      matchedProduct.fullDescriptionEN ||
      matchedProduct.description ||
      'Masterfully handcrafted in Cairo, Egypt using authentic traditional techniques.';
    description = rawDesc.length > 200 ? rawDesc.slice(0, 197) + '...' : rawDesc;

    // Resolve Image with priority on public Supabase product images
    let rawImg = '';
    const candidates = [
      matchedProduct.mainImage,
      ...(Array.isArray(matchedProduct.images) ? matchedProduct.images : []),
      ...(Array.isArray(matchedProduct.galleryImages) ? matchedProduct.galleryImages : []),
    ].filter(Boolean);

    const supabaseCandidate = candidates.find((img) => isSupabaseStorageUrl(img));
    if (supabaseCandidate) {
      rawImg = supabaseCandidate;
    } else {
      const nonUnsplash = candidates.find((img) => !isUnsplashUrl(img));
      if (nonUnsplash) {
        rawImg = nonUnsplash;
      } else if (matchedCategoryInfo && isSupabaseStorageUrl(matchedCategoryInfo.coverImage)) {
        rawImg = matchedCategoryInfo.coverImage;
      } else {
        rawImg = candidates[0] || '/turath_logo.jpg';
      }
    }

    imageUrl = formatAbsoluteUrl(rawImg, baseUrl);
  } else if (matchedCategoryInfo) {
    targetUrl = `${baseUrl}/products/${matchedCategoryInfo.id}`;
    canonicalUrl = `${baseUrl}/products/${matchedCategoryInfo.id}`;
    heading = matchedCategoryInfo.name;
    title = `${heading} | TURATH Egypt`;
    description = matchedCategoryInfo.description;
    imageUrl = formatAbsoluteUrl(matchedCategoryInfo.coverImage, baseUrl);
  } else {
    targetUrl = `${baseUrl}/products`;
    canonicalUrl = `${baseUrl}/products`;
    heading = 'Egyptian Handcrafted Brass & Copper';
    title = 'TURATH | Handcrafted Brass, Copper & Decorative Metals from Egypt';
    description = 'Authentic handcrafted Egyptian brass and luxury architectural metalwork.';
    imageUrl = `${baseUrl}/turath_logo.jpg`;
  }

  const html = generateShareHtml({
    title,
    description,
    imageUrl,
    targetUrl,
    canonicalUrl,
    ogType: 'product',
    heading,
    buttonText: 'View Piece on TURATH &rarr;',
  });

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');
  return res.send(html);
}

function mapSupabaseProduct(data: any): ProductItem {
  return {
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

function generateShareHtml({
  title,
  description,
  imageUrl,
  targetUrl,
  canonicalUrl,
  ogType,
  heading,
  buttonText,
}: {
  title: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
  canonicalUrl: string;
  ogType: string;
  heading: string;
  buttonText: string;
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}">

  <!-- Open Graph / Facebook / WhatsApp / LinkedIn / Telegram -->
  <meta property="fb:app_id" content="1817785808529324">
  <meta property="og:type" content="${escapeHtml(ogType)}">
  <meta property="og:site_name" content="TURATH Egypt | تراث للصناعات النحاسية">
  <meta property="og:locale" content="en_US">
  <meta property="og:locale:alternate" content="ar_EG">
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
