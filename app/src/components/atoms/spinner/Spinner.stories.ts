import type { Meta, StoryFn } from '@storybook/vue3';
import Spinner from './Spinner.vue';
import { html } from 'code-tag';

export default {
  title: 'Atoms/Spinner',
  component: Spinner,
  tags: ['autodocs'],
} as Meta<typeof Spinner>;

const Template: StoryFn<typeof Spinner> = args => ({
  components: {
    Spinner,
  },
  setup() {
    return { args };
  },
  template: html` <Spinner v-bind="args" style="width: 200px"></Spinner>`,
});

export const Default = Template.bind({});
Default.args = {};
