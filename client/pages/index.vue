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
        class="body-2"
      >
        <v-icon class="pr-1">
          mdi-account
        </v-icon> {{ $t('ui.signin') }}
      </v-tab>
      <v-tab
        to="#tab-signup"
        color="primary"
        class="body-2"
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
import Signin from '~/components/Sign/Signin.vue';
import Signup from '~/components/Sign/Signup.vue';

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
  async fetch ({ store }) {
    try {
      await store.dispatch('GET_USER_NUMBER');
    } catch (e) {
      await store.dispatch('snacks/error', 'ui.errors.cannotLoadUserNumber');
    }

    try {
      await store.dispatch('GET_APP_INFOS');
    } catch (e) {
      await store.dispatch('snacks/error', 'ui.errors.cannotGetAppInfos');
    }
  },
  computed: {
    userNumber () {
      return this.$store.state.userNumber;
    }
  }
};
</script>
