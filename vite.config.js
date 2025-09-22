// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://puls-academy-backend-production.up.railway.app', // Your backend URL
        changeOrigin: true,
      },
    },
  },
})