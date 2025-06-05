import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/',
      plugins: [react()],
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true,
        manifest: true,
        emptyOutDir: true
      },
      css: {
        modules: {
          localsConvention: 'camelCase',
          generateScopedName: '[name]__[local]__[hash:base64:5]'
        }
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': process.cwd() + '/src'
        }
      },
      server: {
        port: 5173,
        strictPort: true,
        hmr: {
          host: 'localhost'
        },
        host: true,
        watch: {
          usePolling: true
        },
        open: true
      }
    };
});
