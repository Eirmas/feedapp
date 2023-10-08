import type { Meta, StoryFn } from '@storybook/vue3';
import Card from './Card.vue';
import { html } from 'code-tag';

const meta = {
  title: 'Atoms/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export const Template: StoryFn<typeof Card> = args => ({
  components: {
    Card,
  },
  setup() {
    return { args };
  },
  template: html`
    <Card v-bind="args">
      <p class="mb-0 font-button text-neutral-dark">Hello world!</p>
    </Card>
  `,
});

export default meta;
