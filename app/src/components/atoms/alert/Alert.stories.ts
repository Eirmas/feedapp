import type { Meta } from '@storybook/vue3';
import Alert from './Alert.vue';
import { AlertTypes } from './types';

export default {
  title: 'Atoms/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: {
        type: 'select',
      },
      options: Object.values(AlertTypes),
    },
  },
} as Meta<typeof Alert>;

export const Default = {
  args: {
    title: 'Successfully updated poll',
    description: 'Your changes have been saved',
    type: 'success',
  },
};
