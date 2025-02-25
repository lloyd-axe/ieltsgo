import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../backend/static', // Place the build output directly in Django's static folder
    emptyOutDir: true,            // Clean the output directory before building
  },
  base: '/static/', // Ensure assets are served from Django's static path
})
