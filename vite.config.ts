import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this repo at /DEERDIARY/, not from the domain root.
  base: process.env.GH_PAGES ? '/DEERDIARY/' : '/',
  plugins: [react(), tailwindcss()],
})
