import { mount } from '@vue/test-utils';
import { expect, test } from 'vitest';
import Index from './Index.vue';

test('get hello world', () => {
  expect(Index).toBeTruthy();
  const wrapper = mount(Index);
  expect(wrapper.text()).toContain('Hello, World');
});
