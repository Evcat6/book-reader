import { ConfigEnv, defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import tsconfigPathsPlugin from 'vite-tsconfig-paths';

const config = ({ mode }: ConfigEnv): ReturnType<typeof defineConfig> => {
  const { VITE_APP_PROXY_SERVER_URL, VITE_APP_DEVELOPMENT_PORT } = loadEnv(mode, process.cwd());

  // https://vitejs.dev/config/
  return defineConfig({
    plugins: [vue(), tsconfigPathsPlugin()],
    server: {
      port: Number(VITE_APP_DEVELOPMENT_PORT) || 3000,
      proxy: {
        '/api': {
          target: VITE_APP_PROXY_SERVER_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      exclude: ['js-big-decimal'],
    },
  });
};

export default config;
