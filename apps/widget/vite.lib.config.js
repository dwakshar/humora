import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    lib: {
      entry:    'src/index.js',
      name:     'HumoraWidget',
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
      formats:  ['es', 'cjs'],
    },
    outDir: 'dist/lib',
    rollupOptions: {
      // React is a peer dep — don't bundle it
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react:           'React',
          'react-dom':     'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
      },
    },
  },
})
