import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "https://jackreichelt.github.io/fastapi-adventures-frontend/",
  legacy: { inconsistentCjsInterop: true },
})
