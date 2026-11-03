import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// Requests are proxied through the dev server so the app works on any local
// host/port. The mock backend only allows CORS from http://127.0.0.1:5173,
// so talking to it directly breaks as soon as the port changes or the page is
// opened as http://localhost:5173.
const API_TARGET = "https://mockapi-mauve.vercel.app";

const apiProxy = {
  "/api": {
    target: API_TARGET,
    changeOrigin: true,
    secure: true,
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    host: true,
    proxy: apiProxy,
  },
  preview: {
    host: true,
    proxy: apiProxy,
  },
})
