import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Important for relative paths in extensions
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve('index.html'),
      },
    },
  },
});