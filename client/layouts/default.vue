<template>
  <v-app id="ezpaarse">
    <v-content>
      <Drawer />
      <Header />
      <v-container fluid>
        <nuxt />
        <Snackbar />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
/* eslint-disable import/no-unresolved */
import Header from '~/components/Header';
import Drawer from '~/components/Drawer';
import Snackbar from '~/components/Snackbar.vue';

export default {
  components: {
    Header,
    Drawer,
    Snackbar
  },
  computed: {
    dialog: {
      get () { return this.$store.state.dialog; },
      set (newVal) { this.$store.dispatch('SET_DIALOG', newVal); }
    },
    signupDialog: {
      get () { return this.$store.state.signup; },
      set (newVal) { this.$store.dispatch('SET_SIGNUP', newVal); }
    }
  },
  mounted () {
    try {
      this.$store.dispatch('GET_APP_INFOS');
      this.$store.dispatch('LOAD_PKBS');
      this.$store.dispatch('LOAD_STATUS');
    } catch (e) {
      this.$store.dispatch('snack/error', this.$t('ui.errors.error'));
    }
  }
};
</script>
