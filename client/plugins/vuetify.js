import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';
import colors from 'vuetify/es5/util/colors';

Vue.use(Vuetify);

export default ctx => {
  const vuetify = new Vuetify({
    font: {
      family: 'Roboto'
    },
    icons: {
      iconfont: 'mdi'
    },
    theme: {
      themes: {
        dark: {
          primary: colors.teal,
          secondary: colors.grey.darken3,
          accent: colors.blue.base
        },
        light: {
          primary: colors.teal,
          secondary: colors.grey.darken3,
          accent: colors.blue.base
        }
      }
    }
  });

  ctx.app.vuetify = vuetify;
  ctx.$vuetify = vuetify.framework;
};
