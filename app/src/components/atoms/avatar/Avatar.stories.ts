import type { Meta } from '@storybook/vue3';
import Avatar from './Avatar.vue';

export default {
  title: 'Atoms/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: {
        type: 'select',
      },
      options: ['small', 'medium', 'large'],
    },
    state: {
      control: {
        type: 'select',
      },
      options: [undefined, 'offline', 'online', 'idle'],
    }
  },
} as Meta<typeof Avatar>;

export const Default = {
  args: {
    src: 'https://avatars.githubusercontent.com/u/38263092?v=4',
    name: 'Eirik Måseidvåg'
  }
};
