import { defineConfig } from 'vite'
import path from 'path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname)

function gallerySyncPlugin() {
  const run = () => {
    execSync('node scripts/sync-gallery-from-disk.mjs', {
      cwd: projectRoot,
      stdio: 'inherit',
    })
  }
  return {
    name: 'gallery-sync',
    buildStart() {
      run()
    },
    configureServer(server) {
      const galleryDir = path.join(projectRoot, 'public', 'gallery')
      server.watcher.add(galleryDir)
      let timer: ReturnType<typeof setTimeout> | null = null
      const shouldIgnoreGalleryEvent = (file: string | undefined) => {
        if (!file) return false
        const base = path.basename(file)
        if (base === '.DS_Store' || base === 'Thumbs.db') return true
        if (/^README\.md$/i.test(base)) return true
        return false
      }
      const schedule = (file?: string) => {
        if (shouldIgnoreGalleryEvent(file)) return
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
          try {
            run()
          } catch (e) {
            console.error('[gallery-sync]', e)
          }
        }, 500)
      }
      server.watcher.on('add', (f) => schedule(f))
      server.watcher.on('change', (f) => schedule(f))
      server.watcher.on('unlink', (f) => schedule(f))
    },
  }
}

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    gallerySyncPlugin(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
