import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), reactRefresh()],
  server: {
    hmr: {
      clientPort: (process.env.VITE_CLIENT_PORT && Number(process.env.VITE_CLIENT_PORT)) || null,
    },
  }
});
