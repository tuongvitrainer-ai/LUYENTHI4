import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import { fileURLToPath } from 'url'

// Định nghĩa __dirname cho môi trường ES Module (fix lỗi __dirname is not defined)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  // 1. Cấu hình Alias (Để dùng @ thay cho src)
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // 2. Cấu hình Server (Để kết nối Backend và mở mạng LAN)
  server: {
    port: 5173,
    host: true, // Mở host để điện thoại có thể truy cập
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Chuyển hướng API về Backend
        changeOrigin: true,
        secure: false,
      },
    },
  },

  plugins: [
    react(),
    
    // 3. Cấu hình PWA (Giữ nguyên của bạn)
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192x192.svg', 'icon-512x512.svg', 'apple-touch-icon.svg'],

      manifest: {
        name: 'Vượt Vũ Môn',
        short_name: 'VVM',
        description: 'Ứng dụng luyện thi trực tuyến cho học sinh',
        theme_color: '#87CEEB',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icon-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: 'icon-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: 'apple-touch-icon.svg',
            sizes: '180x180',
            type: 'image/svg+xml',
            purpose: 'apple touch icon',
          },
        ],
      },

      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/localhost:5173\/.*\.html$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
            },
          },
          {
            urlPattern: /\.(?:css|js)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 60,
              },
            },
          },
          {
            urlPattern: /^\/api\/.*/, // Sửa lại regex để khớp với proxy
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5,
              },
              networkTimeoutSeconds: 10,
            },
          },
        ],
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
      },

      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
})