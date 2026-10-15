import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { execSync } from 'node:child_process'
import prerender from '@dotrino/prerender/vite'

// <meta name="commit"> con el hash del commit del build (CONVENCIONES-APPS §3).
function commitMeta () {
  let hash = 'dev'
  try { hash = execSync('git rev-parse --short HEAD').toString().trim() } catch { /* sin git */ }
  return {
    name: 'commit-meta',
    transformIndexHtml: (html) =>
      html.replace('</head>', `  <meta name="commit" content="${hash}" />
  </head>`),
  }
}

export default defineConfig({
  plugins: [
    // El HTML llega con contenido para quien lo lee sin ejecutar JavaScript.
    prerender(),
    commitMeta(),
    // Los tags `dotrino-*` son Web Components del ecosistema, no componentes Vue:
    // sin esto Vue avisa "Failed to resolve component" y no los monta.
    vue({ template: { compilerOptions: { isCustomElement: (tag) => tag.startsWith('dotrino-') } } }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'Favicon Generator',
        short_name: 'FaviconGen',
        description: 'Generate Windows-compatible .ico files and favicons from PNG/JPG images',
        theme_color: '#00658c',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    port: 6061
  },
  build: {
    outDir: 'dist'
  },
  base: './'
})