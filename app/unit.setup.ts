import { createTestingPinia } from '@pinia/testing';
import { config } from '@vue/test-utils';
import en from './src/translations/en.json';
import sinon from 'sinon';

const t = (k: keyof typeof en) => en[k];

config.global.mocks['$t'] = t;
config.global.plugins.push([
  createTestingPinia({
    createSpy: sinon.spy,
  }),
]);
