import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/portfolio/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        cv: resolve(__dirname, 'cv.html')
      }
    }
  }
});
