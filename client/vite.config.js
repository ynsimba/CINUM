import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_DEV_API_TARGET || 'http://127.0.0.1:5001'

  return {
  plugins: [react()],
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('react-dom') || id.includes('/react/') || id.includes('react-router')) {
            return 'vendor-react'
          }
          if (id.includes('i18next') || id.includes('helmet-async')) {
            return 'vendor-i18n'
          }
          if (id.includes('axios')) {
            return 'vendor-http'
          }
        },
      },
    },
  },
  server: {
    headers: {
      'Cache-Control': 'no-store',
    },
    // 127.0.0.1 évite des blocages liés à la résolution de « localhost » (IPv4 / IPv6) sur certains Mac.
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        timeout: 30_000,
        proxyTimeout: 30_000,
      },
      '/uploads': {
        target: apiTarget,
        changeOrigin: true,
        timeout: 30_000,
        proxyTimeout: 30_000,
      },
    },
  },
  }
})
