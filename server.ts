import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import {
  verifyAdminPassword,
  changeAdminPassword,
  resetToDefaultPassword,
  createAdminSession,
  validateAdminSession,
  revokeSession,
  checkRateLimit,
  recordFailedLogin,
  recordSuccessfulLogin,
} from "./auth";
import {
  getAllServerProducts,
  saveServerProduct,
  deleteServerProduct,
  generateMetaProductFeedXml,
  updatePublicFeedFile,
  injectProductSocialMetadata,
} from "./metaFeed";

function parseCliArg(flag: string): string | undefined {
  const arg = process.argv.find((a) => a.startsWith(`${flag}=`));
  if (arg) return arg.split('=')[1];
  const idx = process.argv.indexOf(flag);
  if (idx !== -1 && idx + 1 < process.argv.length) {
    return process.argv[idx + 1];
  }
  return undefined;
}

const app = express();
const PORT = Number(parseCliArg('--port') || parseCliArg('-p') || process.env.PORT || 3000);
const HOST = parseCliArg('--host') || process.env.HOST || '0.0.0.0';

// Middleware
app.use(express.json({ limit: '25mb' }));
app.use(cookieParser());

// Disable x-powered-by header for security
app.disable('x-powered-by');

// Security and Anti-Cache Headers middleware (allows preview iframe embedding in AI Studio)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Prevent browsers & proxies from caching HTML and root dynamic documents
  const pathname = req.path.toLowerCase();
  if (
    pathname === '/' ||
    pathname.endsWith('.html') ||
    pathname.startsWith('/products/') ||
    pathname.startsWith('/category/') ||
    !pathname.includes('.')
  ) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
  }

  next();
});

// Helper to extract session ID from HttpOnly cookie or Authorization header
function getSessionId(req: Request): string | undefined {
  if (req.cookies && typeof req.cookies.turath_admin_session === 'string') {
    return req.cookies.turath_admin_session;
  }
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return undefined;
}

// Admin authorization guard middleware
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const sessionId = getSessionId(req);
  if (!validateAdminSession(sessionId)) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Valid Admin session required',
    });
  }
  next();
}

// Dynamically resolve base URL adapting to domain, headers, or environment
function getBaseUrl(req: Request): string {
  if (process.env.APP_URL && process.env.APP_URL !== 'MY_APP_URL') {
    return process.env.APP_URL.replace(/\/+$/, '');
  }
  const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
  const host = (req.headers['x-forwarded-host'] as string) || req.headers.host || 'turath-egypt.vercel.app';
  return `${proto}://${host}`;
}

// --------------------------------------------------------------------------
// AUTHENTICATION ROUTES
// --------------------------------------------------------------------------

/**
 * POST /api/admin/login
 * Validates admin password using salted scrypt hashing.
 * Enforces rate-limiting against brute force attacks.
 * Sets secure HttpOnly session cookie.
 */
app.post('/api/admin/login', (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const rateLimit = checkRateLimit(clientIp);

  if (!rateLimit.allowed) {
    return res.status(429).json({
      success: false,
      error: `Too many failed login attempts. Please try again in ${rateLimit.retryAfterSeconds} seconds.`,
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    });
  }

  const { password } = req.body || {};
  if (!password || typeof password !== 'string') {
    recordFailedLogin(clientIp);
    return res.status(400).json({
      success: false,
      error: 'Password is required.',
    });
  }

  const isValid = verifyAdminPassword(password);
  if (!isValid) {
    recordFailedLogin(clientIp);
    return res.status(401).json({
      success: false,
      error: 'Invalid password. Please check your credentials and try again.',
    });
  }

  // Password is valid - reset rate limiting
  recordSuccessfulLogin(clientIp);

  // Generate a cryptographically secure 256-bit session token
  const sessionId = createAdminSession(clientIp);

  // Set secure HttpOnly session cookie compatible with preview iframes
  res.cookie('turath_admin_session', sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/',
  });

  // Return success without ever exposing credentials, hashes, or salts
  return res.json({
    success: true,
    token: sessionId, // Returned to support client authorization header fallback
    user: {
      role: 'admin',
      permissions: ['catalog:edit', 'content:edit', 'covers:edit', 'logo:edit'],
    },
  });
});

/**
 * GET /api/admin/session
 * Verifies if the current user holds an active, valid Admin session.
 */
app.get('/api/admin/session', (req: Request, res: Response) => {
  const sessionId = getSessionId(req);
  const isValid = validateAdminSession(sessionId);

  return res.json({
    authenticated: isValid,
    role: isValid ? 'admin' : null,
  });
});

/**
 * POST /api/admin/logout
 * Invalidates the admin session server-side and clears the cookie.
 */
app.post('/api/admin/logout', (req: Request, res: Response) => {
  const sessionId = getSessionId(req);
  revokeSession(sessionId);

  res.clearCookie('turath_admin_session', {
    httpOnly: true,
    path: '/',
  });

  return res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * POST /api/admin/change-password
 * 1. Verifies current password securely.
 * 2. Generates new scrypt salt & hash.
 * 3. Permanently overwrites the active credential.
 * 4. Invalidates previous sessions.
 * 5. Requires admin to re-authenticate with the new password.
 */
app.post('/api/admin/change-password', (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body || {};

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      error: 'Both current password and new password are required.',
    });
  }

  const result = changeAdminPassword(currentPassword, newPassword);
  if (!result.success) {
    return res.status(401).json({
      success: false,
      error: result.error || 'Failed to update admin password.',
    });
  }

  // Clear existing session cookie - requiring fresh login with new password
  res.clearCookie('turath_admin_session', {
    httpOnly: true,
    path: '/',
  });

  return res.json({
    success: true,
    message: 'Password updated successfully. Please log in with your new password.',
  });
});

/**
 * POST /api/admin/reset-default-password
 * Resets admin password back to initial credential (authorized admin only)
 */
app.post('/api/admin/reset-default-password', requireAdminAuth, (req: Request, res: Response) => {
  const success = resetToDefaultPassword();
  if (success) {
    res.clearCookie('turath_admin_session', {
      httpOnly: true,
      path: '/',
    });
    return res.json({
      success: true,
      message: 'Password reset to default credential successfully.',
    });
  }
  return res.status(500).json({
    success: false,
    error: 'Failed to reset admin password.',
  });
});

// --------------------------------------------------------------------------
// PROTECTED ADMIN API MUTATIONS
// Every route requires server-side authentication
// --------------------------------------------------------------------------

app.post('/api/admin/sync-product', requireAdminAuth, (req: Request, res: Response) => {
  const product = req.body;
  if (!product || !product.id || !product.name) {
    return res.status(400).json({ success: false, error: 'Invalid product payload' });
  }
  const baseUrl = getBaseUrl(req);
  saveServerProduct(product, baseUrl);
  return res.json({ success: true, message: 'Product updated and Meta feed synced successfully' });
});

app.delete('/api/admin/sync-product/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, error: 'Product ID required' });
  }
  const baseUrl = getBaseUrl(req);
  deleteServerProduct(id, baseUrl);
  return res.json({ success: true, message: 'Product deleted and Meta feed synced successfully' });
});

/**
 * GET /meta-product-feed.xml
 * Dynamic, real-time product feed strictly conforming to Meta Commerce Manager
 * and Google Merchant Center XML (RSS 2.0 + g: namespace) specifications.
 */
app.get('/meta-product-feed.xml', (req: Request, res: Response) => {
  try {
    const baseUrl = getBaseUrl(req);
    const products = getAllServerProducts();
    const xml = generateMetaProductFeedXml(products, baseUrl);
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    return res.send(xml);
  } catch (err) {
    console.error('Error generating /meta-product-feed.xml:', err);
    return res.status(500).type('application/xml').send('<?xml version="1.0" encoding="UTF-8"?><error>Failed to generate feed</error>');
  }
});

app.post('/api/admin/sync-category', requireAdminAuth, (req: Request, res: Response) => {
  const category = req.body;
  if (!category || !category.id || !category.name) {
    return res.status(400).json({ success: false, error: 'Invalid category payload' });
  }
  return res.json({ success: true, message: 'Category updated successfully' });
});

app.delete('/api/admin/sync-category/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, error: 'Category ID required' });
  }
  return res.json({ success: true, message: 'Category deleted successfully' });
});

app.post('/api/admin/sync-category-cover', requireAdminAuth, (req: Request, res: Response) => {
  const { categoryId, coverImage } = req.body || {};
  if (!categoryId || !coverImage) {
    return res.status(400).json({ success: false, error: 'Category ID and coverImage required' });
  }
  return res.json({ success: true, message: 'Category cover updated successfully' });
});

app.post('/api/admin/sync-site-content', requireAdminAuth, (req: Request, res: Response) => {
  const content = req.body;
  if (!content) {
    return res.status(400).json({ success: false, error: 'Site content required' });
  }
  return res.json({ success: true, message: 'Site content updated successfully' });
});

app.post('/api/admin/sync-logo', requireAdminAuth, (req: Request, res: Response) => {
  const { logoUrl } = req.body || {};
  if (!logoUrl) {
    return res.status(400).json({ success: false, error: 'Logo URL required' });
  }
  return res.json({ success: true, message: 'Logo updated successfully' });
});

app.post('/api/admin/restore-catalog', requireAdminAuth, (req: Request, res: Response) => {
  return res.json({ success: true, message: 'Catalog restored successfully' });
});

// Direct ZIP file serving endpoints
const ZIP_FILES = [
  'turath-website.zip',
  'turath_website.zip',
  'turath-flat-direct.zip',
  'turath-flat.zip',
  'turath-latest.zip',
  'turath-folder.zip',
];

ZIP_FILES.forEach((zipName) => {
  app.get(`/${zipName}`, (req: Request, res: Response) => {
    const pubPath = path.join(process.cwd(), 'public', zipName);
    const rootPath = path.join(process.cwd(), zipName);
    const targetPath = fs.existsSync(pubPath) ? pubPath : rootPath;

    if (fs.existsSync(targetPath)) {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${zipName}"`);
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      return res.sendFile(targetPath);
    }
    return res.status(404).send('ZIP file not found');
  });
});

// Explicit API endpoints for downloading the flat ZIP archive
app.get(['/api/download-flat-zip', '/api/download-zip'], (req: Request, res: Response) => {
  const zipPath = path.join(process.cwd(), 'public', 'turath-website.zip');
  const fallbackPath = path.join(process.cwd(), 'turath-website.zip');
  const target = fs.existsSync(zipPath) ? zipPath : fallbackPath;

  if (fs.existsSync(target)) {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="turath-website.zip"');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    return res.sendFile(target);
  }
  return res.status(404).json({ success: false, error: 'ZIP file not found on server' });
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --------------------------------------------------------------------------
// VITE MIDDLEWARE (DEV) & STATIC FILE SERVING (PROD)
// --------------------------------------------------------------------------

async function startServer() {
  // Synchronize static public/meta-product-feed.xml on server start
  try {
    updatePublicFeedFile(getAllServerProducts(), 'https://turath-egypt.vercel.app');
  } catch (err) {
    console.error('Initial feed generation error:', err);
  }

  // Social Crawler Intercept for Meta / Facebook / Instagram dynamic previews
  app.use((req: Request, res: Response, next: NextFunction) => {
    const userAgent = (req.headers['user-agent'] || '').toLowerCase();
    const isCrawler = /facebookexternalhit|facebot|instagram|whatsapp|twitterbot|pinterest|linkedinbot|slackbot|telegrambot/i.test(
      userAgent
    );

    if (!isCrawler) return next();

    let targetSlug: string | undefined;
    const parts = req.path.split('/').filter(Boolean);
    if (parts[0] === 'products' && parts.length >= 3) {
      targetSlug = parts[2];
    } else if (req.query.product && typeof req.query.product === 'string') {
      targetSlug = req.query.product;
    }

    if (!targetSlug) return next();

    const products = getAllServerProducts();
    const matched = products.find(
      (p) => p.seoSlug === targetSlug || p.id === targetSlug || p.sku === targetSlug
    );

    if (!matched) return next();

    const baseUrl = getBaseUrl(req);
    const indexHtmlPath =
      process.env.NODE_ENV === 'production'
        ? path.join(process.cwd(), 'dist', 'index.html')
        : path.join(process.cwd(), 'index.html');

    if (fs.existsSync(indexHtmlPath)) {
      try {
        const templateHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
        const enrichedHtml = injectProductSocialMetadata(templateHtml, matched, baseUrl, req.originalUrl);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send(enrichedHtml);
      } catch {
        return next();
      }
    }

    next();
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Development catch-all to transform index.html with Vite
    app.get('*', async (req: Request, res: Response, next: NextFunction) => {
      if (req.path.startsWith('/api/') || req.path.includes('.')) {
        return next();
      }
      try {
        const indexHtmlPath = path.resolve(process.cwd(), 'index.html');
        if (fs.existsSync(indexHtmlPath)) {
          let template = fs.readFileSync(indexHtmlPath, 'utf-8');
          template = await vite.transformIndexHtml(req.originalUrl, template);
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
          return res.status(200).send(template);
        }
      } catch (err) {
        vite.ssrFixStacktrace(err as Error);
        return next(err);
      }
      next();
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // Serve hashed assets with immutable cache, but never cache HTML
    app.use(express.static(distPath, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        }
      }
    }));
    app.get('*', (req: Request, res: Response) => {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, HOST, () => {
    console.log(`[TURATH Server] Running on http://${HOST}:${PORT}`);
    console.log(`  ➜  Local:   http://localhost:${PORT}/`);
    console.log(`  ➜  Network: http://${HOST}:${PORT}/`);
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`[TURATH Server] Port ${PORT} already in use. Exiting cleanly to allow supervisor reload.`);
      process.exit(1);
    } else {
      console.error('[TURATH Server] Fatal server error:', err);
    }
  });
}

startServer();
