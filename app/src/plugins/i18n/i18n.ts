import { createI18n } from 'vue-i18n';
import en from '../../translations/en.json';
import no from '../../translations/no.json';
import { setDefaultOptions } from 'date-fns';
import { nb, enUS } from 'date-fns/locale';
import { useStorage } from '@vueuse/core';
import { computed } from 'vue';
import { z, defaultErrorMap } from 'zod';
import noErrorMap from './norwegianZodErrorMap';

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en, no },
});

export const setLocale = (locale: 'en' | 'no') => {
  if (locale !== 'no' && locale !== 'en') {
    return console.warn('Locale not supported');
  }
  z.setErrorMap(locale === 'no' ? noErrorMap : defaultErrorMap);
  setDefaultOptions({ locale: locale === 'no' ? nb : enUS });
  i18n.global.locale.value = locale;
  storedLocale.value = locale;
};

const browserLocale = navigator.language.split('-')[0];
let lang: 'en' | 'no' = 'en';

if (['nb', 'nn', 'no'].includes(browserLocale)) {
  lang = 'no';
}

const storedLocale = useStorage<'en' | 'no' | undefined>('feedapp-browser-locale', undefined);

setLocale(storedLocale.value ?? lang);

export const currentLocale = computed(() => storedLocale.value);

export default i18n;
