import { defineConfig } from '@lovable.dev/vite-tanstack-config';

export default defineConfig({
  css: {
    transformer: 'postcss',
  },
  tanstackStart: {
    server: { entry: 'server' },
  },
});
