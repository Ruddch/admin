import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Base path для GitHub Pages
// Если репозиторий в корне GitHub Pages (username.github.io), оставьте '/'
// Если репозиторий не в корне (username.github.io/repo-name), укажите '/repo-name/'
// Можно переопределить через переменную окружения VITE_BASE_PATH в workflow
const base = process.env.VITE_BASE_PATH || '/'

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

