import type { Meta } from '@storybook/vue3';
import Button from './Button.vue';
import { ButtonCorners, ButtonIconModes, ButtonSizes, ButtonThemes } from './types';
import { UserGroupIcon as Icon } from '@heroicons/vue/24/outline';

export default {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: {
        type: 'select',
      },
      options: Object.values(ButtonThemes),
    },
    size: {
      control: {
        type: 'select',
      },
      options: Object.values(ButtonSizes),
    },
    iconMode: {
      control: {
        type: 'select',
      },
      options: Object.values(ButtonIconModes),
    },
    corners: {
      control: {
        type: 'select',
      },
      options: Object.values(ButtonCorners),
    },
  },
} as Meta<typeof Button>;

export const Default = {
  args: {
    icon: Icon,
    default: 'Button',
    size: 'medium',
    corners: 'rounded',
    iconMode: 'append',
    theme: 'primary',
    disabled: false,
  },
};
