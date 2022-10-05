import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import ssr from 'vite-plugin-ssr/plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), react(), ssr()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    hmr: {
      path: '/hmr',
      clientPort: 443,
    },
  },
  optimizeDeps: {
    include: ['@4ks/api-fetch'],
  },
});
