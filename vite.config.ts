import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'BIOS App',
        short_name: 'BIOS',
        description: 'Mi sistema personal de finanzas y gestión',
        theme_color: '#0f1626',
        background_color: '#0a1120',
        display: 'standalone', // Esto es la magia que quita la barra de Safari en el iPhone
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
})