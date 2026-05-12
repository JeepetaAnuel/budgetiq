import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'pwa-192x192.svg', 'pwa-512x512.svg', 'pwa-192x192-maskable.svg', 'pwa-512x512-maskable.svg'],
      manifest: {
        name: 'BudgetIQ - Gestión Financiera Inteligente',
        short_name: 'BudgetIQ',
        description: 'Controla tus finanzas con análisis IA y presupuestos inteligentes. Optimiza tu dinero con barras de progreso interactivas y recomendaciones de inteligencia artificial.',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'minimal-ui'],
        orientation: 'portrait-primary',
        lang: 'es',
        start_url: '/',
        scope: '/',
        id: 'com.budgetiq.app',
        categories: ['finance', 'productivity', 'utilities'],
        shortcuts: [
          {
            name: 'Dashboard',
            short_name: 'Inicio',
            description: 'Ver resumen financiero',
            url: '/',
            icons: [{ src: '/pwa-192x192.svg', sizes: '192x192' }]
          },
          {
            name: 'Modo IA',
            short_name: 'IA',
            description: 'Generar plan optimizado con IA',
            url: '/ai-mode',
            icons: [{ src: '/pwa-192x192.svg', sizes: '192x192' }]
          },
          {
            name: 'Presupuestos',
            short_name: 'Gastos',
            description: 'Gestionar presupuestos',
            url: '/budgets',
            icons: [{ src: '/pwa-192x192.svg', sizes: '192x192' }]
          }
        ],
        icons: [
          {
            src: 'pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'pwa-192x192-maskable.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'maskable'
          },
          {
            src: 'pwa-512x512-maskable.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ],
        screenshots: [],
        prefer_related_applications: false,
        related_applications: [],
        edge_side_panel: { preferred_width: 400 }
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,json,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ],
})
