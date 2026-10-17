import { defineConfig } from '@lovable.dev/vite-tanstack-config';

export default defineConfig({
  server: {
    fs: {
      strict: false,
      allow: ['..'],
    },
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  css: {
    transformer: 'postcss',
  },
  tanstackStart: {
    server: { entry: 'server' },
  },
});
