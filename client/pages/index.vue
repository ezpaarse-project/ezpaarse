<template>
  <v-card>
    <v-tabs
      v-model="activeTab"
      grow
      dark
    >
      <v-tab
        v-if="userNumber > 0"
        to="#tab-signin"
      >
        <v-icon class="pr-1">
          mdi-account
        </v-icon> {{ $t('ui.signin') }}
      </v-tab>
      <v-tab
        to="#tab-signup"
        color="primary"
      >
        <v-icon class="pr-1">
          mdi-account-plus
        </v-icon> {{ $t('ui.signup') }}
      </v-tab>
    </v-tabs>
    <Signin v-if="activeTab === 'tab-signin' && userNumber > 0" />
    <Signup
      v-else
      :user-number="userNumber"
    />
  </v-card>
</template>

<script>
/* eslint-disable import/no-unresolved */
import Signin from '~/components/Sign/Signin';
import Signup from '~/components/Sign/Signup';

export default {
  auth: true,
  layout: 'sign',
  components: {
    Signin,
    Signup
  },
  data () {
    return {
      activeTab: 'tab-signin'
    };
  },
  async fetch ({ store, app }) {
    try {
      await store.dispatch('GET_USER_NUMBER');
      return true;
    } catch (e) {
      await store.dispatch('snack/error', app.i18n.t('ui.errors.error'));
      return false;
    }
  },
  computed: {
    userNumber () {
      return this.$store.state.userNumber;
    }
  }
};
</script>
