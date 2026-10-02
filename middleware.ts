/**
 * TURATH Website - Middleware Bypass
 * This is a Vite + React Single Page Application.
 * All routing is handled client-side by React SPA with Vercel CDN static rewrites.
 * This file disables Edge Middleware invocation on all standard website routes.
 */

export const config = {
  matcher: [
    // Dummy path so middleware is never invoked for normal visitors, products, or sharing
    '/__turath_disabled_middleware__',
  ],
};

export default function middleware() {
  return new Response('TURATH OK', {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
