import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173 },
  // Recharts depends on a CommonJS selector shim. Bundle both together and
  // rebuild dev dependencies on startup to prevent stale dependency hashes.
  optimizeDeps: {
    include: ['recharts', 'use-sync-external-store/shim/with-selector'],
    force: true,
  },
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
})
