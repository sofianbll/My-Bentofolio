import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { adminPlugin } from './vite-admin-plugin'

export default defineConfig({
  plugins: [react(), adminPlugin()],
  base: process.env.VITE_BASE_PATH || '/',
  build: {
    outDir: 'dist',
  },
})
