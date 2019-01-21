<template>
  <v-app id="ezpaarse">
    <v-content>
      <Drawer />
      <Header />
      <v-container fluid>
        <nuxt/>
        <Snackbar />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Header from '~/components/Header'
import Drawer from '~/components/Drawer'
import Snackbar from '~/components/Snackbar.vue'

export default {
  components: {
    Header,
    Drawer,
    Snackbar
  },
  mounted () {
    try {
      this.$store.dispatch('GET_APP_VERSION')
      this.$store.dispatch('LOAD_PKBS')
      this.$store.dispatch('LOAD_STATUS')
    } catch(e) { }
  },
  computed: {
    dialog: {
      get () { return this.$store.state.dialog },
      set (newVal) { this.$store.dispatch('SET_DIALOG', newVal) }
    },
    signupDialog: {
      get () { return this.$store.state.signup },
      set (newVal) { this.$store.dispatch('SET_SIGNUP', newVal) }
    }
  },
  sockets: {
    'castor:update': function (data) {
      this.$store.dispatch('SET_PKBS', data)
    }
  }
}
</script>
