/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

const BACKEND_HOST = 'http://103.174.103.250';

/**
 * Same-origin proxy (no CORS). Browser calls `/api/v1/...` directly —
 * no `/appointment-api` prefix. Vite forwards to the correct service port.
 */
function serviceProxy(port: number) {
  return {
    target: `${BACKEND_HOST}:${port}`,
    changeOrigin: true,
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // Patient-service :8101
      '/api/v1/patients': serviceProxy(8101),

      // Doctor-service :8102
      '/api/v1/doctors': serviceProxy(8102),

      // Therapist-service :8104
      '/api/v1/therapists': serviceProxy(8104),

      // Appointment-service :8103
      '/api/v1/appointments': serviceProxy(8103),
      '/api/v1/appointment-therapies': serviceProxy(8103),
      '/api/v1/treatment-categories': serviceProxy(8103),
      '/api/v1/therapies': serviceProxy(8103),
      '/api/v1/doshas': serviceProxy(8103),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
});
