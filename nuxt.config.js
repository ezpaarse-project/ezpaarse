'use strict';

module.exports = {
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
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto' }
    ]
  },
  mode: 'spa',
  loading: { color: '#FFFFFF' },
  loadingIndicator: {
    name: 'folding-cube',
    color: 'teal'
  },
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth'
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
        }
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
  plugins: [
    '~/plugins/vuetify.js',
    '~/plugins/i18n.js',
    '~/plugins/socket.js',
    '~/plugins/vue-tour.js'
  ],
  /*
  ** Global CSS
  */
  css: [
    'mdi/css/materialdesignicons.min.css',
    'vuetify/dist/vuetify.min.css'
  ],
  /*
  ** Add global packages
  */
  build: {
    analyze: true
  },
  srcDir: 'client/'
};
