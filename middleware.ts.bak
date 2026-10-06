import { INITIAL_PRODUCTS, PRODUCT_CATEGORIES } from './initialCatalog';
import { INITIAL_PROJECTS } from './initialProjects';
import { ProductItem, ProjectItem } from './types';

export const config = {
  matcher: [
    '/share/:path*',
    '/p/:path*',
    '/products/:path*',
    '/projects/:path*',
  ],
};

const BASE_URL = 'https://turath-egypt.vercel.app';
const SUPABASE_REST_URL = 'https://rpyzvhetoviqpjvncqfy.supabase.co/rest/v1';
const SUPABASE_ANON_KEY = 'sb_publishable_xJpsJH--P7kPUwmrVNOwwQ_T12KVuWG';

const CRAWLER_USER_AGENTS = /facebookexternalhit|facebot|whatsapp|twitterbot|telegrambot|linkedinbot|slackbot|discordbot|applebot|pinterest|googlebot|bingbot|yandex|duckduckbot|baiduspider|vkshare|w3c_validator/i;

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatAbsoluteUrl(url?: string): string {
  if (!url || !url.trim()) return `${BASE_URL}/turath_logo.jpg`;
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${BASE_URL}${cleanPath}`;
}

async function fetchSupabaseProduct(slug: string): Promise<ProductItem | null> {
  try {
    const encoded = encodeURIComponent(slug);
    const res = await fetch(
      `${SUPABASE_REST_URL}/products?select=*&or=(seo_slug.ilike.${encoded},id.ilike.${encoded},sku.ilike.${encoded})&limit=1`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Accept: 'application/json',
        },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    const row = data[0];
    return {
      id: row.id,
      sku: row.sku || row.id,
      categoryId: row.category_id || 'lighting',
      name: row.name,
      nameEN: row.name_en || row.name,
      nameAR: row.name_ar,
      tagline: row.tagline || '',
      shortDescEN: row.short_desc_en,
      shortDescAR: row.short_desc_ar,
      description: row.description || '',
      fullDescriptionEN: row.full_description_en,
      fullDescriptionAR: row.full_description_ar,
      mainImage: row.main_image || '',
      images: Array.isArray(row.images) ? row.images : [],
      materials: row.materials || row.material || 'Solid Brass',
      finish: row.finish || 'Antique Patina',
      finishOptions: Array.isArray(row.finish_options) ? row.finish_options : [],
      dimensions: row.dimensions,
      price: row.price,
      availability: row.availability,
      seoSlug: row.seo_slug || row.id,
      seoTitle: row.seo_title,
      metaDescription: row.meta_description,
    };
  } catch {
    return null;
  }
}

async function fetchSupabaseProject(slug: string): Promise<ProjectItem | null> {
  try {
    const res = await fetch(
      `${SUPABASE_REST_URL}/site_content?id=eq.projects_catalog&select=*&limit=1`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Accept: 'application/json',
        },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    const content = data[0].content;
    const list = Array.isArray(content) ? content : (content && content.projects);
    if (!Array.isArray(list)) return null;
    const target = slug.toLowerCase();
    const found = list.find((p: any) => (p.slug && p.slug.toLowerCase() === target) || (p.id && p.id.toLowerCase() === target));
    return found || null;
  } catch {
    return null;
  }
}

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const userAgent = request.headers.get('user-agent') || '';
  const isCrawler = CRAWLER_USER_AGENTS.test(userAgent);

  const isShareRoute = pathname.startsWith('/share/') || pathname.startsWith('/p/');
  const isProductRoute = pathname.startsWith('/products/');
  const isProjectRoute = pathname.startsWith('/projects/');

  // If regular browser user visits standard /products/... or /projects/... routes, let SPA handle it
  if (!isShareRoute && !isCrawler) {
    return;
  }

  // Extract slug from URL
  const pathParts = pathname.split('/').filter(Boolean);
  let slug = '';
  let categoryHint = '';
  let isExplicitProject = false;
  let isExplicitProduct = false;

  if (isShareRoute) {
    // /share/product/:slug, /share/project/:slug, /share/:slug, /p/:slug
    if (pathParts[1] === 'product' && pathParts[2]) {
      isExplicitProduct = true;
      slug = pathParts[2];
    } else if (pathParts[1] === 'project' && pathParts[2]) {
      isExplicitProject = true;
      slug = pathParts[2];
    } else if (pathParts[1]) {
      slug = pathParts[1];
    }
  } else if (isProductRoute && isCrawler) {
    // /products/:category/:slug or /products/:slug
    if (pathParts.length >= 3) {
      categoryHint = pathParts[1];
      slug = pathParts[2];
    } else if (pathParts.length >= 2) {
      slug = pathParts[1];
    }
    isExplicitProduct = true;
  } else if (isProjectRoute && isCrawler) {
    // /projects/:slug
    if (pathParts.length >= 2) {
      slug = pathParts[1];
    }
    isExplicitProject = true;
  }

  const cleanSlug = decodeURIComponent(slug || '').trim().toLowerCase();
  if (!cleanSlug) {
    return;
  }

  // 1. Resolve Product if not explicitly a project
  let product: ProductItem | null = null;
  if (!isExplicitProject) {
    // A. Check local compiled catalog
    product = INITIAL_PRODUCTS.find(
      (p) =>
        (p.seoSlug && p.seoSlug.toLowerCase() === cleanSlug) ||
        (p.id && p.id.toLowerCase() === cleanSlug) ||
        (p.sku && p.sku.toLowerCase() === cleanSlug)
    ) || null;

    // B. Check Supabase if not found locally
    if (!product) {
      product = await fetchSupabaseProduct(cleanSlug);
    }
  }

  // 2. If product found, generate rich Product preview card
  if (product) {
    const categoryId = product.categoryId || categoryHint || 'lighting';
    const categoryInfo = PRODUCT_CATEGORIES.find((c) => c.id === categoryId);
    const categoryName = categoryInfo ? categoryInfo.name : 'Handcrafted Egyptian Metalwork';

    const displayName = product.nameEN || product.name || 'TURATH Egyptian Brass';
    const displayTitle = `${displayName} | TURATH Egypt`;
    const rawImage = product.mainImage || (product.images && product.images[0]) || '';
    const ogImage = formatAbsoluteUrl(rawImage);
    const canonicalUrl = `${BASE_URL}/products/${categoryId}/${product.seoSlug || product.id}`;
    const redirectUrl = `/products/${categoryId}/${product.seoSlug || product.id}`;

    const rawDesc = product.metaDescription || product.shortDescEN || product.description || 'Authentic handcrafted Egyptian brass and luxury metalwork created by Cairo artisans.';
    const ogDesc = rawDesc.length > 200 ? rawDesc.slice(0, 197) + '...' : rawDesc;

    const html = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(displayTitle)}</title>
  <meta name="description" content="${escapeHtml(ogDesc)}">

  <!-- Open Graph / WhatsApp / Facebook -->
  <meta property="og:type" content="product">
  <meta property="og:site_name" content="TURATH Egypt | تراث للصناعات النحاسية">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  <meta property="og:title" content="${escapeHtml(displayTitle)}">
  <meta property="og:description" content="${escapeHtml(ogDesc)}">
  <meta property="og:image" content="${escapeHtml(ogImage)}">
  <meta property="og:image:secure_url" content="${escapeHtml(ogImage)}">
  <meta property="og:image:alt" content="${escapeHtml(displayName)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${escapeHtml(canonicalUrl)}">
  <meta name="twitter:title" content="${escapeHtml(displayTitle)}">
  <meta name="twitter:description" content="${escapeHtml(ogDesc)}">
  <meta name="twitter:image" content="${escapeHtml(ogImage)}">

  <link rel="canonical" href="${escapeHtml(canonicalUrl)}">

  <!-- Instant Browser Redirect: Human visitors are instantly forwarded into the SPA -->
  <script>
    if (typeof window !== 'undefined') {
      window.location.replace('${redirectUrl}');
    }
  </script>
</head>
<body style="margin:0; background:#070709; color:#f5f0e6; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; padding:20px;">
  <div style="max-width:540px; width:100%; background:#101014; border:1px solid rgba(212,197,157,0.4); border-radius:16px; padding:28px; text-align:center; box-shadow:0 25px 60px rgba(0,0,0,0.8);">
    <div style="font-size:12px; letter-spacing:0.2em; text-transform:uppercase; color:#d4c59d; font-weight:700; margin-bottom:8px;">TURATH EGYPT • ${escapeHtml(categoryName)}</div>
    <div style="border-radius:12px; overflow:hidden; border:1px solid rgba(212,197,157,0.3); margin:16px 0; background:#000;">
      <img src="${escapeHtml(ogImage)}" alt="${escapeHtml(displayName)}" style="width:100%; height:auto; max-height:420px; object-fit:contain; display:block;" />
    </div>
    <h1 style="font-size:22px; color:#f5f0e6; margin:12px 0 6px 0;">${escapeHtml(displayName)}</h1>
    ${product.nameAR ? `<div style="font-size:16px; color:#d4c59d; margin-bottom:12px;">${escapeHtml(product.nameAR)}</div>` : ''}
    <p style="font-size:14px; color:#a89f88; line-height:1.5; margin:0 0 20px 0;">${escapeHtml(ogDesc)}</p>
    <a href="${redirectUrl}" style="display:inline-block; background:#d4c59d; color:#000; padding:12px 28px; border-radius:30px; font-weight:700; text-decoration:none; font-size:14px; text-transform:uppercase; letter-spacing:0.05em;">View Handcrafted Piece</a>
  </div>
</body>
</html>`;

    return new Response(html, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
      },
    });
  }

  // 3. Resolve Project if not explicitly a product
  if (!isExplicitProduct) {
    let project = INITIAL_PROJECTS.find(
      (p) => (p.slug && p.slug.toLowerCase() === cleanSlug) || (p.id && p.id.toLowerCase() === cleanSlug)
    ) || null;

    if (!project) {
      project = await fetchSupabaseProject(cleanSlug);
    }

    if (project) {
      const projTitle = `${project.title} | TURATH Egypt`;
      const projImg = formatAbsoluteUrl(project.coverImage || (project.gallery && project.gallery[0]));
      const canonicalUrl = `${BASE_URL}/projects/${project.slug || project.id}`;
      const redirectUrl = `/projects/${project.slug || project.id}`;
      const projDesc = project.shortDescription || project.description || `Architectural brass installation delivered for ${project.title}.`;

      const html = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(projTitle)}</title>
  <meta name="description" content="${escapeHtml(projDesc)}">

  <meta property="og:type" content="article">
  <meta property="og:site_name" content="TURATH Egypt | تراث للصناعات النحاسية">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  <meta property="og:title" content="${escapeHtml(projTitle)}">
  <meta property="og:description" content="${escapeHtml(projDesc)}">
  <meta property="og:image" content="${escapeHtml(projImg)}">
  <meta property="og:image:secure_url" content="${escapeHtml(projImg)}">
  <meta property="og:image:alt" content="${escapeHtml(project.title)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${escapeHtml(canonicalUrl)}">
  <meta name="twitter:title" content="${escapeHtml(projTitle)}">
  <meta name="twitter:description" content="${escapeHtml(projDesc)}">
  <meta name="twitter:image" content="${escapeHtml(projImg)}">

  <link rel="canonical" href="${escapeHtml(canonicalUrl)}">

  <script>
    if (typeof window !== 'undefined') {
      window.location.replace('${redirectUrl}');
    }
  </script>
</head>
<body style="margin:0; background:#070709; color:#f5f0e6; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; padding:20px;">
  <div style="max-width:540px; width:100%; background:#101014; border:1px solid rgba(212,197,157,0.4); border-radius:16px; padding:28px; text-align:center; box-shadow:0 25px 60px rgba(0,0,0,0.8);">
    <div style="font-size:12px; letter-spacing:0.2em; text-transform:uppercase; color:#d4c59d; font-weight:700; margin-bottom:8px;">TURATH EGYPT • ARCHITECTURAL PROJECTS</div>
    <div style="border-radius:12px; overflow:hidden; border:1px solid rgba(212,197,157,0.3); margin:16px 0; background:#000;">
      <img src="${escapeHtml(projImg)}" alt="${escapeHtml(project.title)}" style="width:100%; height:auto; max-height:420px; object-fit:contain; display:block;" />
    </div>
    <h1 style="font-size:22px; color:#f5f0e6; margin:12px 0 6px 0;">${escapeHtml(project.title)}</h1>
    ${project.titleAR ? `<div style="font-size:16px; color:#d4c59d; margin-bottom:12px;">${escapeHtml(project.titleAR)}</div>` : ''}
    <p style="font-size:14px; color:#a89f88; line-height:1.5; margin:0 0 20px 0;">${escapeHtml(projDesc)}</p>
    <a href="${redirectUrl}" style="display:inline-block; background:#d4c59d; color:#000; padding:12px 28px; border-radius:30px; font-weight:700; text-decoration:none; font-size:14px; text-transform:uppercase; letter-spacing:0.05em;">View Project Details</a>
  </div>
</body>
</html>`;

      return new Response(html, {
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
        },
      });
    }
  }

  // 4. If on /share/ or /p/ and item was not found, return branded 404
  if (isShareRoute) {
    const notFoundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Piece Not Found | TURATH Egypt</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex">
</head>
<body style="margin:0; background:#000; color:#f5f0e6; font-family:-apple-system,sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; padding:20px; text-align:center;">
  <div style="max-width:440px; padding:32px; border:1px solid rgba(212,197,157,0.3); border-radius:16px; background:#0d0d12;">
    <div style="color:#d4c59d; font-size:12px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; margin-bottom:8px;">404 — Item Not Found</div>
    <h1 style="color:#f5f0e6; font-size:24px; margin:0 0 12px 0;">Piece Not Found</h1>
    <p style="color:#d4c59d; font-size:16px; margin:0 0 16px 0;">عذراً، هذه القطعة التراثية غير متوفرة أو تم تغيير الرابط</p>
    <a href="/" style="display:inline-block; background:#d4c59d; color:#000; padding:10px 24px; border-radius:24px; font-weight:700; text-decoration:none; font-size:13px; text-transform:uppercase;">Return to Catalog</a>
  </div>
</body>
</html>`;

    return new Response(notFoundHtml, {
      status: 404,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  }

  return;
}
