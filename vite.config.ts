import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
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
        theme_color: '#ffffff',
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