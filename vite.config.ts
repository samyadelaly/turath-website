import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";

export default defineConfig(() => {
  return {
    publicDir: false,
    plugins: [
      react(),
      tailwindcss(),
      {
        name: "serve-root-static-assets",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const rawUrl = (req.url || "").split("?")[0];
            const cleanPath = rawUrl.startsWith("/") ? rawUrl.slice(1) : rawUrl;
            if (cleanPath && !cleanPath.includes("/")) {
              const rootFile = path.resolve(__dirname, cleanPath);
              if (
                fs.existsSync(rootFile) &&
                fs.statSync(rootFile).isFile() &&
                (cleanPath.endsWith(".txt") ||
                  cleanPath.endsWith(".xml") ||
                  cleanPath.endsWith(".jpg") ||
                  cleanPath.endsWith(".png") ||
                  cleanPath.endsWith(".html") ||
                  cleanPath.endsWith(".zip"))
              ) {
                const ext = path.extname(cleanPath).toLowerCase();
                const mimeTypes: Record<string, string> = {
                  ".jpg": "image/jpeg",
                  ".jpeg": "image/jpeg",
                  ".png": "image/png",
                  ".txt": "text/plain; charset=utf-8",
                  ".xml": "application/xml; charset=utf-8",
                  ".html": "text/html; charset=utf-8",
                  ".zip": "application/zip",
                };
                if (mimeTypes[ext]) {
                  res.setHeader("Content-Type", mimeTypes[ext]);
                }
                return fs.createReadStream(rootFile).pipe(res);
              }
            }
            next();
          });
        },
      },
      {
        name: "copy-root-static-assets",
        closeBundle() {
          const distDir = path.resolve(__dirname, "dist");
          if (!fs.existsSync(distDir)) return;
          const staticFiles = [
            "robots.txt",
            "sitemap.xml",
            "meta-product-feed.xml",
            "_redirects",
            "_headers",
            "turath_logo.jpg",
            "turath_pattern_watermark.png",
            "googlespNP-SOf-Jc6UhFPynCcBtYrIkFXrZQ2dX28Tfb_qFs.html",
            "googlewb3AUcUJZuOC4ZfpeBVpjlwfSWhOqKaCmdUglKugcyY.html",
            "turath-website.zip",
            "turath-flat.zip",
            "turath-latest.zip",
            "turath-folder.zip",
            "turath-flat-direct.zip",
            "turath-flat-update.zip",
            "turath-project.zip",
            "turath-complete-project.zip",
            "turath_website.zip",
            "turath-social-share-final.zip",
            "turath-social-share-flat-final.zip",
            "turath-website-complete-github-ready.zip"
          ];
          for (const file of staticFiles) {
            const srcFile = path.resolve(__dirname, file);
            if (fs.existsSync(srcFile)) {
              fs.copyFileSync(srcFile, path.join(distDir, file));
            }
          }
        }
      }
    ],
    server: {
      port: 3000,
      host: "0.0.0.0",
      allowedHosts: true as const,
    }
  };
});
