import type { Meta } from '@storybook/vue3';
import Badge from './Badge.vue';
import { BadgeTypes } from './types';

export default {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: {
        type: 'select',
      },
      options: [undefined, ...Object.values(BadgeTypes)],
    },
  },
} as Meta<typeof Badge>;

export const Default = {
  args: {
    text: 'Confirmed',
    type: 'success',
  },
};
