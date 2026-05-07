import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    lib: {
      entry:    'src/main.jsx',
      name:     'Humora',
      fileName: 'humora.min',
      formats:  ['iife']
    },
    outDir: 'dist',
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    }
  }
})
