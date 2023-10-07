import type { Meta } from '@storybook/vue3';
import Image from './Image.vue';

export default {
  title: 'Atoms/Image',
  component: Image,
  tags: ['autodocs'],
} as Meta<typeof Image>;

export const Default = {
  args: {
    src: 'https://picsum.photos/200/300',
    alt: 'Random image'
  }
};
