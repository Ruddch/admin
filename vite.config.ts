import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Base path для GitHub Pages (замените на название вашего репозитория)
// Например, если репозиторий называется "admin", то base будет "/admin/"
// Если репозиторий в корне GitHub Pages, оставьте "/"
const base = import.meta.env.VITE_BASE_PATH || '/'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base,
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})

