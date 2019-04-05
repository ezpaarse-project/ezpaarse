import Vue from 'vue';
import Vuetify from 'vuetify';
import colors from 'vuetify/es5/util/colors';

Vue.use(Vuetify, {
  iconfont: 'mdi',
  theme: {
    primary: colors.teal,
    secondary: colors.grey.darken3,
    accent: colors.blue.base
  }
});
