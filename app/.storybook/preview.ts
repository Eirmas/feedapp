import '../src/index.scss';
import type { Preview } from '@storybook/vue3';
import { useArgs } from '@storybook/client-api';

export const decorators: Preview['decorators'] = [
  (story, context) => {
    const [_, updateArgs] = useArgs();
    return story({ ...context, updateArgs });
  },
];

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    previewTabs: {
      'storybook/docs/panel': { index: -1 },
    },
  },
};

export default preview;
