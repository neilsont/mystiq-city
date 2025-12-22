import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/mystiq-city/',
  server: {
    port: 5173,
    host: 'localhost',
    strictPort: false
  },
  build: {
    outDir: 'docs',  // Changed from 'dist' to 'docs'
    sourcemap: false,
    minify: 'esbuild'
  }
})