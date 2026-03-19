import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-180.png', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'SQL道場',
        short_name: 'SQL道場',
        description: 'ゲーム感覚でSQLを学べる練習アプリ',
        theme_color: '#0f1117',
        background_color: '#0f1117',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        // sql-wasmは大きいのでキャッシュから除外
        globIgnores: ['**/*.wasm'],
        runtimeCaching: [
          {
            urlPattern: /\.wasm$/,
            handler: 'CacheFirst',
            options: { cacheName: 'wasm-cache' },
          },
        ],
      },
    }),
  ],
  assetsInclude: ['**/*.wasm'],
})
