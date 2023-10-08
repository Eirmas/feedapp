import type { Meta, StoryFn } from '@storybook/vue3';
import Switch from './Switch.vue';
import { action } from '@storybook/addon-actions';
import { SwitchSizes } from './types';
import { html } from 'code-tag';

export default {
  title: 'Atoms/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: {
        type: 'select',
      },
      options: Object.values(SwitchSizes),
    },
  },
} as Meta<typeof Switch>;

const Template: StoryFn<typeof Switch> = (args, { updateArgs }) => ({
  components: {
    Switch,
  },
  setup() {
    return { args };
  },
  template: html` <Switch v-bind="args" @update:modelValue="updateModel"></Switch> `,
  methods: {
    updateModel(modelValue: number) {
      action('update:modelValue')(modelValue);
      updateArgs({ modelValue });
    },
  },
});

export const Default = Template.bind({});
Default.args = {
  modelValue: false,
  size: SwitchSizes.MEDIUM,
};
