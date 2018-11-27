<template>
  <v-app id="ezpaarse">
    <v-content>
      <Header />
      <Drawer />
      <v-container fluid>
        <nuxt/>
      </v-container>

      <Snackbar />
    </v-content>
  </v-app>
</template>

<script>
import Header from '~/components/Header'
import Drawer from '~/components/Drawer'
import Snackbar from '~/components/Snackbar.vue'
import { detect } from 'detect-browser'

export default {
  components: {
    Header,
    Drawer,
    Snackbar
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
  mounted () {
    const browser = detect()
    if (browser) {
      console.log(browser.name)
      console.log(browser.version)
      console.log(browser.os)
    }
  }
}
</script>
