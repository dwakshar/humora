import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  envDir: 'config/widget-env',
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': '{}',
    'process': '{"env":{}}',
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/embed/humora-api.js'),
      name: 'Humora',
      formats: ['iife'],
      fileName: () => 'humora.min.js',
      cssFileName: 'humora',
    },
    rollupOptions: {
      external: [],
    },
    outDir: 'dist',
    cssCodeSplit: false,
  },
});
