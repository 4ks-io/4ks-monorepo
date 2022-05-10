import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

const hmrPort =
  (process.env.VITE_CLIENT_PORT && Number(process.env.VITE_CLIENT_PORT)) ||
  null;
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), reactRefresh()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    hmr: {
      path: '/hmr',
      clientPort: 443,
    },
  },
});
