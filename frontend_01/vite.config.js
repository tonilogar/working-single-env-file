import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    base: '/',
    server: {
      host: '0.0.0.0',
      port: parseInt(env.VITE_PORT_FRONTEND_01_DOCKER),
      watch: {
        usePolling: true,
      },
      hmr: {
        host: 'localhost',
      },
    },
    build: {
      outDir: 'dist',
    }
  };
});
