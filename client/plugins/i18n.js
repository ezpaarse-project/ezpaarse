/* eslint-disable import/no-unresolved */
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import moment from 'moment';

import en from '~/locales/en.json';
import fr from '~/locales/fr.json';

Vue.use(VueI18n);
moment.locale('fr');

export default ({ app }) => {
  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  app.i18n = new VueI18n({
    locale: 'fr',
    fallbackLocale: 'fr',
    messages: {
      en,
      fr
    }
  });
};
