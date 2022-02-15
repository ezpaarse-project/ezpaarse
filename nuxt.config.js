'use strict';

const config = require('./lib/config');

module.exports = {
  telemetry: false,
  ssr: false,
  /*
  ** Headers of the page
  */
  head: {
    title: 'ezPAARSE',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'ezPAARSE' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ]
  },
  loading: '~/components/Loader.vue',
  loadingIndicator: {
    name: 'folding-cube',
    color: 'teal'
  },
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/i18n',
  ],
  axios: {
    proxy: true
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: '/api/auth/login', method: 'post' },
          logout: { url: '/api/auth/logout', method: 'post' },
          user: { url: '/api/auth/session', method: 'get', propertyName: '' }
        },
        tokenRequired: false
      }
    },
    redirect: {
      login: '/',
      logout: '/',
      home: '/process',
      callback: '/'
    }
  },
  router: {
    middleware: [ 'auth' ]
  },
  buildModules: [],
  plugins: [
    { src: '~/plugins/vuetify.js' },
    { src: '~/plugins/axios.js', ssr: false },
    { src: '~/plugins/socket.js', ssr: false }
  ],
  /*
  ** Global CSS
  */
  css: [],
  /*
  ** Add global packages
  */
  build: {
    extend (config, ctx) {}
  },
  srcDir: 'client/',
  i18n: {
    locales: [
      {
        name: 'Français',
        code: 'fr',
        iso: 'fr-FR',
        file: 'fr.json',
      },
      {
        name: 'English',
        code: 'en',
        iso: 'en-US',
        file: 'en.json',
      },
    ],
    baseUrl: '/',
    defaultLocale: config.DEFAULT_LOCALE,
    lazy: true,
    langDir: 'locales/',
    strategy: 'no_prefix',
    vueI18n: {
      fallbackLocale: ['en', 'fr'],
    },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'ezpaarse_i18n',
      alwaysRedirect: true,
      fallbackLocale: 'en',
    },
  }
};
