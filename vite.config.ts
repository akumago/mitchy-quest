import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: process.env.NODE_ENV === 'production' ? '/mitchy-quest/' : '/',
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true,
        rollupOptions: {
          input: {
            main: './src/index.tsx'
          }
        },
        manifest: true,
        emptyOutDir: true,
        output: {
          entryFileNames: `assets/[name]-[hash].js`,
          chunkFileNames: `assets/[name]-[hash].js`,
          assetFileNames: `assets/[name]-[hash].[ext]`
        }
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
        port: 3000,
        strictPort: true,
        hmr: {
          host: 'localhost'
        }
      },
      publicDir: false
    };
});
