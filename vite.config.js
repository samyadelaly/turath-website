import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
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
