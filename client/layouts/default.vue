<template>
  <v-app id="ezpaarse">
    <v-content>
      <Drawer />
      <Header />
      <v-container fluid>
        <v-alert
          :value="!appInfos.demo"
          type="info"
          dismissible
          outline
        >
          <div class="subheading font-weight-bold">{{ $t('ui.pages.index.demoHeader') }}</div>
          <div>{{ $t('ui.pages.index.demoText') }}</div>
        </v-alert>
        <v-dialog
          v-model="modal"
          persistent
          width="600"
        >
          <v-card
            color="primary"
            dark
          >
            <v-card-text>
              {{ $t('ui.ezPAARSEOffline') }}
              <v-progress-linear
                indeterminate
                color="white"
                class="mb-0"
              />
            </v-card-text>
          </v-card>
        </v-dialog>
        <nuxt />
        <Snackbar />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Header from '~/components/Header';
import Drawer from '~/components/Drawer';
import Snackbar from '~/components/Snackbar.vue';

export default {
  components: {
    Header,
    Drawer,
    Snackbar
  },
  data () {
    return {
      modal: false
    };
  },
  computed: {
    dialog: {
      get () { return this.$store.state.dialog; },
      set (newVal) { this.$store.dispatch('SET_DIALOG', newVal); }
    },
    signupDialog: {
      get () { return this.$store.state.signup; },
      set (newVal) { this.$store.dispatch('SET_SIGNUP', newVal); }
    },
    appInfos () {
      return this.$store.state.appInfos;
    },
    disconnected () {
      return !this.$store.state.socket.socketid;
    }
  },
  watch: {
    disconnected () {
      this.modal = this.disconnected;
    }
  },
  mounted () {
    this.$store.dispatch('GET_APP_INFOS').catch(err => {
      this.$store.dispatch('snacks/error', `E${err.response.status} - ${this.$t('ui.errors.cannotGetAppInfos')}`);
    });
    this.$store.dispatch('LOAD_PKBS').catch(err => {
      this.$store.dispatch('snacks/error', `E${err.response.status} - ${this.$t('ui.errors.cannotLoadPKBS')}`);
    });
    this.$store.dispatch('LOAD_STATUS').catch(err => {
      this.$store.dispatch('snacks/error', `E${err.response.status} - ${this.$t('ui.errors.cannotLoadStatus')}`);
    });
  }
};
</script>
