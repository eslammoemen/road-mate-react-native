import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

import en from './app/locales/en';
import ar from './app/locales/ar';

i18n.fallbacks = true;
i18n.translations = {
  en,
  ar,
};

export default i18n;