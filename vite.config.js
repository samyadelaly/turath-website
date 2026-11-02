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
  base: './',
  plugins: [
    vercelApiDevPlugin(),
    ViteImageOptimizer({
      test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
      includePublic: true,
      logStats: true,
      ansiColors: true,
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                cleanupNumericValues: false,
                removeViewBox: false,
              },
            },
          },
        ],
      },
      png: {
        quality: 80,
        compressionLevel: 8,
      },
      jpeg: {
        quality: 75,
        progressive: true,
        mozjpeg: true,
      },
      jpg: {
        quality: 75,
        progressive: true,
        mozjpeg: true,
      },
      webp: {
        lossless: false,
        quality: 75,
        effort: 4,
      },
      avif: {
        lossless: false,
        quality: 70,
        effort: 4,
      },
    })
  ],
  build: {
    minify: 'esbuild',
    cssMinify: true,
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
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('gsap')) {
              return 'vendor-gsap';
            }
            return 'vendor';
          }
        }
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
