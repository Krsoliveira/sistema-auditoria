import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Em dev: base '/' para o router funcionar em localhost:5173/
  // Em build (prod): '/static/cronograma/' para o Django servir os assets corretamente
  base: command === 'build' ? '/static/cronograma/' : '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/main.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
}))
