import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Should be 'dist' to match the Dockerfile
    emptyOutDir: true,
  },
  base: '/static/', // Important for Django's static file serving
});
