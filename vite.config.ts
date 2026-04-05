import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * User site (username.github.io): base `/`. Production build → `dist/` (GitHub Actions deploys that folder).
 * `index.template.html` is the Vite entry; `prebuild`/`predev` copy it to `index.html` for dev/build.
 */
export default defineConfig({
  base: '/',
  build: {
    /** CI + `npm run build` output; GitHub Pages deploys this folder via Actions (not repo root). */
    outDir: 'dist',
    emptyOutDir: true,
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
