<template>
  <v-app id="ezpaarse-sign">
    <v-content>
      <v-toolbar app dark fixed class="teal">
        <img src="~/assets/img/logo-white.svg" width="48px">
        <v-toolbar-title>ezPAARSE</v-toolbar-title>
    
        <v-spacer></v-spacer>

        <v-toolbar-items>
          <div class="text-xs-center mt-2">
            <v-btn round class="teal lighten-2 pt-2 pb-2 pl-3 pr-3" href="https://ezpaarse.readthedocs.io/en/master/" target="_blank">Documentation</v-btn>
          </div>
        </v-toolbar-items>
      </v-toolbar>

      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm12 md5>
            <nuxt/>

            <v-flex xs12 sm12 md5>
              <v-select
                v-model="locale"
                :items="locales"
                :label="$t('ui.language')"
                item-text="name"
                item-value="value"
                persistent-hint
                return-object
                single-line
                @change="$i18n.locale = locale.value"
              ></v-select>
            </v-flex>
          </v-flex>
        </v-layout>
      </v-container>

      <Snackbar />
    </v-content>
  </v-app>
</template>

<script>
import Snackbar from '~/components/Snackbar.vue'
import { detect } from 'detect-browser'

export default {
  components: {
    Snackbar
  },
  data () {
    return {
      locale: this.$i18n.locale,
      locales: [
        { name: 'Français', value: 'fr' },
        { name: 'English', value: 'en' }
      ]
    }
  }
}
</script>

