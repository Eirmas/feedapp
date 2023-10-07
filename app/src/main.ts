import { createApp } from 'vue';
import App from './App.vue';
import router from './plugins/router';
import pinia from './store';
import i18n from './plugins/i18n';
import './index.scss';

createApp(App).use(router).use(i18n).use(pinia).mount('#app');
