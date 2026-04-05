import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * User site (username.github.io): always serve from domain root — base `/`.
 * Build output goes to repo root for “Deploy from branch → / (root)” on GitHub Pages.
 * `index.template.html` is the Vite entry (script → `/src/main.tsx`). `prebuild`/`predev` copy it to `index.html` so production `index.html` never blocks the next build or `npm run dev`.
 */
export default defineConfig({
  base: '/',
  build: {
    outDir: '.',
    emptyOutDir: false,
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
