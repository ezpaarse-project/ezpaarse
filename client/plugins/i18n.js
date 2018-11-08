import Vue from 'vue'
import VueI18n from 'vue-i18n'
import moment from 'moment'

Vue.use(VueI18n)
moment.locale('fr')

export default ({ app, store }) => {
  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  app.i18n = new VueI18n({
    locale: 'fr',
    fallbackLocale: 'fr',
    messages: {
      'en': require('~/locales/en.json'),
      'fr': require('~/locales/fr.json')
    }
  })
}
