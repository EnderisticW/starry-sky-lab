import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  base: './',
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        home: resolve(rootDir, 'index.html'),
        observatory: resolve(rootDir, 'observatory.html'),
        logs: resolve(rootDir, 'logs.html'),
        institute: resolve(rootDir, 'institute.html'),
      },
    },
  },
});
