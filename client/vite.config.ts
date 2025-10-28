import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { componentTagger } from 'lovable-tagger'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 8080, // ✅ fixed port
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      devOptions: { enabled: true, type: 'module' }, // ✅ show PWA in dev
      includeAssets: [
        'icons/icon-192.png',
        'icons/icon-512.png',
        'icons/maskable-192.png',
        'icons/maskable-512.png',
        'icons/apple-touch-icon-180.png',
        'offline.html'
      ],
      manifest: {
        name: 'C3',
        short_name: 'C3',
        description: 'WhatsApp automation – fast, installable, offline-capable.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        display_override: ['standalone', 'fullscreen', 'minimal-ui'],
        background_color: '#ffffff',
        theme_color: '#16a34a',
        icons: [
          { src: '/icons/icon-192.png',     sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png',     sizes: '512x512', type: 'image/png' },
          { src: '/icons/maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: '/icons/apple-touch-icon-180.png', sizes: '180x180', type: 'image/png' }
        ],
        shortcuts: [
          {
            name: 'Orders',
            short_name: 'Orders',
            url: '/orders',
            icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }]
          },
          {
            name: 'Analytics',
            short_name: 'Analytics',
            url: '/analytics',
            icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }]
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'firebase/app', 'firebase/auth']
  }
}))
