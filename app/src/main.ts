import { createApp } from 'vue';
import App from './App.vue';
import router from './plugins/router';
import pinia from './store';
import i18n from './plugins/i18n/i18n';
import FocusDirective from './plugins/directives/focus';
import DebounceDirective from './plugins/directives/debounce';
import './index.scss';

createApp(App).use(router).use(i18n).use(pinia).use(FocusDirective).use(DebounceDirective).mount('#app');
