import { defineConfig } from '@lovable.dev/vite-tanstack-config';

export default defineConfig({
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
