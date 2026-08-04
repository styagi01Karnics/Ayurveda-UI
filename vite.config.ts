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
      '/api/v1/treatment-plans': serviceProxy(8103),
      '/api/v1/therapies': serviceProxy(8103),
      '/api/v1/doshas': serviceProxy(8103),
      '/api/v1/systemic-examinations': serviceProxy(8103),
      '/api/v1/physical-examinations': serviceProxy(8103),
      '/api/v1/medical-histories': serviceProxy(8103),
      '/api/v1/medical-assessment': serviceProxy(8103),
      '/api/v1/lifestyle-information': serviceProxy(8103),
      '/api/v1/ayurvedic-assessments': serviceProxy(8103),
      '/api/v1/dashboard/todays-schedule': serviceProxy(8103),

      // Auth-service :8111
      '/api/v1/auth': serviceProxy(8111),
      '/api/v1/tenants': serviceProxy(8111),

      // File-upload-service :8105
      '/api/v1/documents': serviceProxy(8105),

      // Attendance-service :8106
      '/api/v1/attendances': serviceProxy(8106),

      // Activity-log-service :8107
      '/api/v1/activity-logs': serviceProxy(8107),

      // Medicine & Dashboard-service :8108
      '/api/v1/medicines': serviceProxy(8108),
      '/api/v1/dashboard/medicine-stock': serviceProxy(8108),

      // Billing-service :8109
      '/api/v1/invoices': serviceProxy(8109),
      '/api/v1/sales': serviceProxy(8109),
      '/api/v1/dashboard/billing-summary': serviceProxy(8109),

      // Notification-service :8110
      '/api/v1/notifications': serviceProxy(8110),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
});
