import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Matches Dockerfile COPY command
    emptyOutDir: true,
  },
  server: {
    port: 5173, // Optional: for local development
  },
});
