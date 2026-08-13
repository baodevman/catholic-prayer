import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'prompt',
      devOptions: {
        enabled: true,
        type: 'module'
      },
      includeAssets: ['favicon.svg', 'icon.png'],
      manifest: {
        name: 'Kinh Nguyện Công Giáo',
        short_name: 'Kinh Nguyện',
        description: 'Ứng dụng Lời Nguyện & Tuần Cửu Nhật cho người Công Giáo',
        theme_color: '#FAF6EE',
        background_color: '#FAF6EE',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'icon.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'favicon.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          }
        ]
      }
    })
  ]
})
