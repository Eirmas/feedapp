import { UserGroupIcon as Icon } from '@heroicons/vue/24/outline';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryFn } from '@storybook/vue3';
import TextInput from './TextInput.vue';
import { TextInputIconModes, TextInputSizes } from './types';

export default {
  title: 'Atoms/Text Input',
  component: TextInput,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: {
        type: 'select',
      },
      options: Object.values(TextInputSizes),
    },
    iconMode: {
      control: {
        type: 'select',
      },
      options: Object.values(TextInputIconModes),
    },
  },
} as Meta<typeof TextInput>;

const Template: StoryFn<typeof TextInput> = (args, { updateArgs }) => ({
  components: { TextInput },
  setup() {
    return { args };
  },
  template: '<TextInput v-bind="args" @update:modelValue="updateModel" />',
  methods: {
    updateModel(modelValue: number) {
      action('update:modelValue')(modelValue);
      updateArgs({ modelValue });
    },
  },
});

export const Default = Template.bind({});
Default.args = {
  icon: Icon,
  label: 'Label',
  hint: 'Hint',
  size: 'medium',
  iconMode: 'prepend',
  disabled: false,
  error: '',
};
