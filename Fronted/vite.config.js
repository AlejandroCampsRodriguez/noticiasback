import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  "base":"/Noticias-Develop/",
"deploy":"gh-pages -d dist",
  plugins: [react()],
})
