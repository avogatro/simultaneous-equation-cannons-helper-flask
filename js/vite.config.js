import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-404',
      closeBundle() {
        fs.copyFileSync(
          path.resolve(process.cwd(), 'dist/index.html'),
          path.resolve(process.cwd(), 'dist/404.html')
        );
      }
    },
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['img/icon.webp', 'img/icon.png', 'img/icon50.png', 'fonts/poppins-regular.woff2', 'fonts/poppins-semibold.woff2'],
      workbox: {
        navigateFallbackDenylist: [/sitemap\.xml$/, /robots\.txt$/]
      },
      manifest: {
        name: 'Yu-Gi-Oh! SEC Helper',
        short_name: 'SEC Helper',
        description: 'Calculator and Helper for Simultaneous Equation Cannons',
        theme_color: '#1a1a1a',
        background_color: '#1a1a1a',
        display: 'standalone',
        icons: [
          {
            src: 'img/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'img/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  base: '/simultaneous-equation-cannons-helper-flask/',
})
