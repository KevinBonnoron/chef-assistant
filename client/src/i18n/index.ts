import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import filters from './locales/fr/filters.json';
import translation from './locales/fr/translation.json';

i18n.use(initReactI18next).init({
  resources: {
    fr: {
      translation,
      filters,
    },
  },
  lng: 'fr',
  fallbackLng: 'fr',
  ns: ['translation', 'filters'],
  defaultNS: 'translation',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
