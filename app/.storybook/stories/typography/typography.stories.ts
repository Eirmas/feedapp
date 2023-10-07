import type { Meta } from '@storybook/vue3';
import Typography from './Typography.vue';

export enum Levels {
  H1 = 'text-h1',
  H2 = 'text-h2',
  H3 = 'text-h3',
  H4 = 'text-h4',
  'Body Large' = 'text-body-large',
  'Body Bold' = 'text-body-bold',
  'Body' = 'text-body',
  'Body Link' = 'text-body-link',
  'Body Small Bold' = 'text-body-small-bold',
  'Body Small' = 'text-body-small',
  'Body Link Small' = 'text-body-link-small',
  'Button' = 'text-button',
  'Caption' = 'text-caption',
}

export default {
  title: 'Style/Typography',
  component: Typography,
  tags: ['autodocs'],
  argTypes: {
    clazz: {
      control: {
        type: 'select',
      },
      options: Object.keys(Levels),
    },
  },
} as Meta<typeof Typography>;

export const Default = {};
