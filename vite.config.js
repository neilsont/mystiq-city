import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/mystiq-city/',  // for GitHub Pages root
  server: {
    port: 5173,
    host: 'localhost',
    strictPort: false
  },
  build: {
    outDir: 'dist',  // Changed back to 'dist' (standard for Vite)
    sourcemap: false,
    minify: 'esbuild'
  }
})
