import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <--- Agregamos esto

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <--- Y esto
  ],
})