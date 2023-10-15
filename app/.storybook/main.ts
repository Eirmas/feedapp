import { mergeConfig } from 'vite';
import path from 'path';
import { StorybookConfig } from '@storybook/vue3-vite';
import { VitePWA } from 'vite-plugin-pwa';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)', './stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-actions',
    '@storybook/addon-styling',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [
        VitePWA({
          registerType: 'autoUpdate',
          devOptions: {
            enabled: true,
          },
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}'],
          },
        }),
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../src'),
        },
      },
    });
  },
};
export default config;
