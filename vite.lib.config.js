import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/Widget.jsx'),
      name: 'Humora',
      formats: ['iife'],
      fileName: () => 'humora.min.js',
    },
    rollupOptions: {
      external: [],
      output: {
        inlineDynamicImports: true,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'humora.css';
          return assetInfo.name;
        },
      },
    },
    outDir: 'dist',
    cssCodeSplit: false,
  },
});