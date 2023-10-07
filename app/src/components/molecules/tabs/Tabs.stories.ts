import type { Meta, StoryFn } from '@storybook/vue3';
import { action } from '@storybook/addon-actions';
import Tabs from './Tabs.vue';
import Tab from './Tab.vue';
import { html } from 'code-tag';

const meta = {
  title: 'Molecules/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: {
        type: 'select',
      },
      options: ['small', 'medium'],
    },
  },
} satisfies Meta<typeof Tabs>;

const Template: StoryFn<typeof Tabs> = (args, { updateArgs }) => ({
  components: {
    Tabs,
    Tab,
  },
  setup() {
    return { args };
  },
  template: html`
    <Tabs v-bind="args" @update:modelValue="updateModel">
      <Tab value="1" :size="args.size">Option 1</Tab>
      <Tab value="2" :size="args.size">Option 2</Tab>
      <Tab value="3" :size="args.size">Option 3</Tab>
      <Tab value="4" :size="args.size" disabled>Option 4</Tab>
    </Tabs>
  `,
  methods: {
    updateModel(modelValue: number) {
      action('update:modelValue')(modelValue);
      updateArgs({ modelValue });
    },
  },
});

export const Default = Template.bind({});
Default.args = {
  modelValue: 1,
  size: 'medium',
};

export default meta;
