import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { proxy: { '/api': 'http://localhost:8081', '/ws': { target: 'ws://localhost:8081', ws: true } } },
  resolve: {
    // Resolve workspace packages from TypeScript source in dev/build.
    // 'source' maps to ./src/index.ts in @evonexus/ui's exports field.
    conditions: ['source', 'import', 'module', 'browser', 'default'],
  },
})
