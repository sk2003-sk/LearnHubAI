import react from '@vitejs/plugin-react'
import { env } from 'node:process'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// Requests are proxied through the dev server so the app works on any local
// host/port. Override the target with VITE_API_PROXY_TARGET when pointing the
// dev server at a remote API.
const API_TARGET = env.VITE_API_PROXY_TARGET || "http://127.0.0.1:5050";

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
