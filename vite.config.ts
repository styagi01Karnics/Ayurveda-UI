/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

function resolveBackendHost(raw: string): string {
  const trimmed = raw.replace(/\/+$/, '');
  // Avoid Windows resolving localhost to IPv6 ::1 when services listen on 127.0.0.1
  if (trimmed === 'http://localhost' || trimmed === 'https://localhost') {
    return 'http://127.0.0.1';
  }
  return trimmed;
}

/**
 * Same-origin proxy (no CORS). Browser calls `/api/v1/...` directly —
 * no `/appointment-api` prefix. Vite forwards to the correct service port.
 *
 * Override in `.env.development.local`:
 *   VITE_BACKEND_HOST=http://103.174.103.250   (remote staging)
 *   VITE_BACKEND_HOST=http://127.0.0.1         (local microservices)
 */
function serviceProxy(backendHost: string, port: number) {
  return {
    target: `${backendHost}:${port}`,
    changeOrigin: true,
    secure: false,
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendHost = resolveBackendHost(
    env.VITE_BACKEND_HOST || 'http://103.174.103.250',
  );

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        // Patient-service :8101
        '/api/v1/patients': serviceProxy(backendHost, 8101),

        // Doctor-service :8102
        '/api/v1/doctors': serviceProxy(backendHost, 8102),

        // Therapist-service :8104
        '/api/v1/therapists': serviceProxy(backendHost, 8104),

        // Appointment-service :8103
        '/api/v1/appointments': serviceProxy(backendHost, 8103),
        '/api/v1/appointment-therapies': serviceProxy(backendHost, 8103),
        '/api/v1/treatment-categories': serviceProxy(backendHost, 8103),
        '/api/v1/treatment-plans': serviceProxy(backendHost, 8103),
        '/api/v1/treatment-plan-masters': serviceProxy(backendHost, 8103),
        '/api/v1/consultation-types': serviceProxy(backendHost, 8103),
        '/api/v1/therapies': serviceProxy(backendHost, 8103),
        '/api/v1/doshas': serviceProxy(backendHost, 8103),
        '/api/v1/systemic-examinations': serviceProxy(backendHost, 8103),
        '/api/v1/physical-examinations': serviceProxy(backendHost, 8103),
        '/api/v1/medical-histories': serviceProxy(backendHost, 8103),
        '/api/v1/medical-assessment': serviceProxy(backendHost, 8103),
        '/api/v1/lifestyle-information': serviceProxy(backendHost, 8103),
        '/api/v1/ayurvedic-assessments': serviceProxy(backendHost, 8103),
        '/api/v1/dashboard/todays-schedule': serviceProxy(backendHost, 8103),
        '/api/v1/treatments': serviceProxy(backendHost, 8103),
        '/api/v1/follow-ups': serviceProxy(backendHost, 8103),

        // Auth-service :8111
        '/api/v1/auth': serviceProxy(backendHost, 8111),
        '/api/v1/tenants': serviceProxy(backendHost, 8111),

        // File-upload-service :8105
        '/api/v1/documents': serviceProxy(backendHost, 8105),

        // Attendance-service :8106
        '/api/v1/attendances': serviceProxy(backendHost, 8106),

        // Activity-log-service :8107
        '/api/v1/activity-logs': serviceProxy(backendHost, 8107),

        // Medicine & Dashboard-service :8108
        '/api/v1/medicines': serviceProxy(backendHost, 8108),
        '/api/v1/dashboard/medicine-stock': serviceProxy(backendHost, 8108),

        // Billing-service :8109
        '/api/v1/invoices': serviceProxy(backendHost, 8109),
        '/api/v1/sales': serviceProxy(backendHost, 8109),
        '/api/v1/dashboard/billing-summary': serviceProxy(backendHost, 8109),
        '/api/v1/packages': serviceProxy(backendHost, 8109),
        '/api/v1/package-masters': serviceProxy(backendHost, 8109),

        // Notification-service :8110
        '/api/v1/notifications': serviceProxy(backendHost, 8110),
        '/api/v1/messages': serviceProxy(backendHost, 8110),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: true,
    },
  };
});
