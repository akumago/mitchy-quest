import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: process.env.NODE_ENV === 'production' ? '/mitchy-quest/' : '/',
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true,
        cssCodeSplit: true,
        rollupOptions: {
          input: {
            main: './src/index.tsx'
          }
        },
        manifest: true,
        emptyOutDir: true,
        output: {
          entryFileNames: `assets/[name].js`,
          chunkFileNames: `assets/[name].js`,
          assetFileNames: `assets/[name].[ext]`
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
          '@': '/src'
        }
      }
    };
});
