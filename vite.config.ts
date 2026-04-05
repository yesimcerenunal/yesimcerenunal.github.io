import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * User site (username.github.io): always serve from domain root — base `/`.
 * Build output goes to repo root for “Deploy from branch → / (root)” on GitHub Pages.
 * After `npm run build`, restore dev entry with: `git checkout -- index.html` (or keep a branch without root build).
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
