import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

/**
 * Local dev server middleware plugin to emulate Vercel Serverless Function (/api/contact)
 * during `npm run dev` so form testing works immediately on local dev and tunnels.
 */
function vercelApiDevPlugin() {
  return {
    name: 'vercel-api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && (req.url === '/api/contact' || req.url.startsWith('/api/contact?'))) {
          try {
            // Load .env variables into process.env if not loaded yet
            if ((!process.env.EMAIL_SERVICE_API_KEY || !process.env.CONTACT_EMAIL) && fs.existsSync('.env')) {
              const envContent = fs.readFileSync('.env', 'utf8');
              envContent.split('\n').forEach(line => {
                const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
                if (m) {
                  let v = (m[2] || '').trim();
                  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
                    v = v.slice(1, -1);
                  }
                  process.env[m[1]] = v;
                }
              });
            }

            const { default: handler } = await import('./api/contact.js');
            return await handler(req, res);
          } catch (err) {
            console.error('[Vite Dev API Error]:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ success: false, error: err.message }));
          }
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [
    vercelApiDevPlugin(),
    ViteImageOptimizer({
      jpg: { quality: 80 },
      png: { quality: 80 },
      webp: { quality: 80, lossless: false }
    })
  ],
  build: {
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        lighting: resolve(__dirname, 'lighting.html'),
        mirrors: resolve(__dirname, 'mirrors.html'),
        tables: resolve(__dirname, 'tables.html'),
        handles: resolve(__dirname, 'handles.html'),
        handrails: resolve(__dirname, 'handrails.html'),
        decor: resolve(__dirname, 'decor.html'),
        wallArt: resolve(__dirname, 'wall-art.html'),
        partitions: resolve(__dirname, 'partitions.html'),
        tableware: resolve(__dirname, 'tableware.html'),
        action: resolve(__dirname, 'action.html'),
        masterpieces: resolve(__dirname, 'masterpieces.html')
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
    cors: true,
    watch: {
      ignored: ['**/public/video/**', '**/*.mp4']
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
    cors: true
  }
});
