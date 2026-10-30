/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

/**
 * Same-origin proxy (no CORS). The browser calls `/api/v1/...` and Vite forwards
 * everything to the API gateway, which routes each path to its service.
 *
 * Override in `.env.development.local`:
 * VITE_API_GATEWAY_URL=http://localhost:8113
 */
const DEFAULT_GATEWAY_URL = 'http://localhost:8113';

function gatewayProxy(gatewayUrl: string) {
  return {
    target: gatewayUrl,
    changeOrigin: true,
    secure: false,
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const gatewayUrl = (env.VITE_API_GATEWAY_URL || DEFAULT_GATEWAY_URL).replace(/\/+$/, '');

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            charts: ['recharts'],
          },
        },
      },
    },
    server: {
      proxy: {
        // All API traffic goes through the gateway, which routes to each service.
        '/api/v1': gatewayProxy(gatewayUrl),
        '/pay': gatewayProxy(gatewayUrl),
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
