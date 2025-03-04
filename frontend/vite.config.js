import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: '/static/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
          main: path.resolve(__dirname, "index.html"),
      },
    },
  },
  publicDir: "public"
});
