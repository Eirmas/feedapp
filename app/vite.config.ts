import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { tsconfigBaseAliases } from 'nx-vue3-vite';
import { VitePWA } from 'vite-plugin-pwa';

const isStorybook = process.env.NX_TASK_TARGET_TARGET === 'build-storybook';

const vitePwaConfig = VitePWA({
  registerType: 'autoUpdate',
  devOptions: {
    enabled: true,
  },
  srcDir: 'src',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}'],
  },
  includeAssets: [
    'favicon.ico',
    'favicon-16x16.ico',
    'favicon-32x32.ico',
    'robots.txt',
    'android-chrome-192x192.png',
    'android-chrome-512x512.png',
    'apple-touch-icon.png',
    'mstile-70x70.png',
    'mstile-144x144.png',
    'mstile-150x150.png',
    'mstile-310x150.png',
    'mstile-310x310.png',
    'safari-pinned-tab.svg',
  ],
  manifest: {
    name: 'FeedApp',
    short_name: 'FeedApp',
    description:
      'Empower your voice and make every vote count with our interactive polling app. ' +
      'Create, vote on, and explore polls with ease. Join the community of active participants today and be part of the conversation.',
    theme_color: '#e5dfec',
    icons: [
      {
        src: 'android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: 'android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: 'android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  },
});

export default defineConfig({
  resolve: {
    alias: {
      ...tsconfigBaseAliases(__dirname),
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
      '@': path.resolve(__dirname, './src'),
    },
  },
  publicDir: path.resolve(__dirname, './public'),
  plugins: [isStorybook ? null : vitePwaConfig, vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./unit.setup.ts'],
  },
});
