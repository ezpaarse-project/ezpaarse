<template>
  <v-card>
    <v-tabs v-model="activeTab" grow dark>
      <v-tab to="#tab-signin" v-if="userNumber > 0">
        <v-icon class="pr-1">mdi-account</v-icon> {{ $t('ui.signin') }}
      </v-tab>
      <v-tab to="#tab-signup" color="primary">
        <v-icon class="pr-1">mdi-account-plus</v-icon> {{ $t('ui.signup') }}
      </v-tab>
    </v-tabs>
    <Signin v-if="activeTab === 'tab-signin' && userNumber > 0" />
    <Signup :userNumber="userNumber" v-else />
  </v-card>
</template>

<script>
import Signin from '~/components/Signin'
import Signup from '~/components/Signup'

export default {
  layout: 'sign',
  components: {
    Signin,
    Signup
  },
  data () {
    return {
      activeTab: 'tab-signin'
    }
  },
  async fetch ({ store, redirect }) {
    try {
      await store.dispatch('GET_USER_NUMBER')
      await store.dispatch('GET_USER')
    } catch (e) { }

    if (store.state.user) return redirect(301, '/process')
  },
  computed: {
    userNumber () {
      return this.$store.state.userNumber
    }
  }
}
</script>