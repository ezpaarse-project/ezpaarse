<template>
  <v-card v-if="!feedback">
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
    <v-flex xs4 sm4 right text-xs-right>
      <v-btn color="primary" @click="feedback = true">
        {{ $t('ui.drawer.feedback') }}
      </v-btn>
    </v-flex>
  </v-card>
  <v-card v-else flat>
    <Feedback />
    <v-flex xs4 sm4 right text-xs-right>
      <v-btn color="primary" @click="feedback = false">
        {{ $t('ui.back') }}
      </v-btn>
    </v-flex>
  </v-card>
</template>

<script>
import Signin from '~/components/Sign/Signin';
import Signup from '~/components/Sign/Signup';
import Feedback from '~/components/Feedback';

export default {
  auth: true,
  layout: 'sign',
  components: {
    Signin,
    Signup,
    Feedback
  },
  data () {
    return {
      feedback: false,
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

    try {
      await store.dispatch('GET_FEEDBACK_STATUS');
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
