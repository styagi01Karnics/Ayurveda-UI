/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

const BACKEND_HOST = 'http://103.174.103.250';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/patient-api': {
        target: `${BACKEND_HOST}:8101`,
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/patient-api/, ''),
      },
      '/doctor-api': {
        target: `${BACKEND_HOST}:8102`,
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/doctor-api/, ''),
      },
      '/appointment-api': {
        target: `${BACKEND_HOST}:8103`,
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/appointment-api/, ''),
      },
      '/therapist-api': {
        target: `${BACKEND_HOST}:8104`,
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/therapist-api/, ''),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
});
