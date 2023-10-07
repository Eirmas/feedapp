import { mount } from '@vue/test-utils';
import { expect, test } from 'vitest';
import Index from './Index.vue';

test('get Index', () => {
  expect(Index).toBeTruthy();
  const wrapper = mount(Index);
  expect(wrapper.text()).toContain('Index');
});
