import { defineConfig } from '@lovable.dev/vite-tanstack-config';

export default defineConfig({
  server: {
    fs: {
      strict: false,
      allow: ['..'],
    },
  },
  css: {
    transformer: 'postcss',
  },
  tanstackStart: {
    server: { entry: 'server' },
  },
});
