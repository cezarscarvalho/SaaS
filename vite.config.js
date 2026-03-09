import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Isso permite que você use '@' em vez de '../../'
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Garante que o build seja limpo a cada tentativa
    outDir: 'dist',
    emptyOutDir: true,
  }
})