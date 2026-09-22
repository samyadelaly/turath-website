import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: "copy-root-static-assets",
        closeBundle() {
          const distDir = path.resolve(__dirname, "dist");
          if (!fs.existsSync(distDir)) return;
          const staticFiles = [
            "robots.txt",
            "sitemap.xml",
            "_redirects",
            "turath_logo.jpg",
            "googlespNP-SOf-Jc6UhFPynCcBtYrIkFXrZQ2dX28Tfb_qFs.html",
            "googlewb3AUcUJZuOC4ZfpeBVpjlwfSWhOqKaCmdUglKugcyY.html"
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
