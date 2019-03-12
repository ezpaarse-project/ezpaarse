<template>
  <v-app id="ezpaarse-sign">
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <v-card flat height="100%" color="teal white--text">
          <v-container fill-height grid-list-md text-xs-center>
            <v-layout row wrap align-center>
              <v-card flat color="transparent" class="white--text">
                <v-card-text class="headline">
                  <h3 class="mb-0">{{ $t('ui.pages.index.whatIsEzpaarse') }}</h3>
                  <p v-html="$t('ui.pages.index.description')"></p>
                  <v-tooltip bottom>
                    <v-chip slot="activator">
                      <v-avatar>
                        <v-icon right>mdi-thumb-up-outline</v-icon>
                      </v-avatar>
                      {{ $t('ui.pages.index.simpleTool') }}
                    </v-chip>
                    <span v-html="$t('ui.pages.index.fewClicksToInstall')"></span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <v-chip slot="activator">
                      <v-avatar>
                        <v-icon right>mdi-comment</v-icon>
                      </v-avatar>
                      {{ $t('ui.pages.index.availableTeam') }}
                    </v-chip>
                    <span v-html="$t('ui.pages.index.contactUs')"></span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <v-chip slot="activator">
                      <v-avatar>
                        <v-icon right>mdi-account-group</v-icon>
                      </v-avatar>
                      {{ $t('ui.pages.index.growingCommunity') }}
                    </v-chip>
                    <span v-html="$t('ui.pages.index.notOnlyFrench')"></span>
                  </v-tooltip>
                </v-card-text>
              </v-card>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>

      <v-flex xs12 sm6>
        <v-container fill-height grid-list-md text-xs-center>
          <v-layout row wrap align-center>
            <v-flex xs12 sm12>
              <img src="~/assets/img/logo.png" alt="ezPAARSE">
              <p v-html="$t('ui.pages.index.singinEasy')"></p>

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
      </v-flex>
    </v-layout>
    <!-- <v-content>
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
    </v-content>-->
  </v-app>
</template>

<script>
import Snackbar from "~/components/Snackbar.vue";
import { detect } from "detect-browser";

export default {
  components: {
    Snackbar
  },
  data() {
    return {
      locale: this.$i18n.locale,
      locales: [
        { name: "Français", value: "fr" },
        { name: "English", value: "en" }
      ]
    };
  }
};
</script>

<style scoped>
a {
  color: #ccc;
}
</style>
