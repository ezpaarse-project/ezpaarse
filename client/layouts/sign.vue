<template>
  <v-app id="ezpaarse-sign">
    <v-layout
      row
      wrap
    >
      <v-flex
        xs12
        sm6
      >
        <v-card
          flat
          height="100%"
          color="teal white--text"
          tile
        >
          <v-container
            fill-height
            grid-list-md
            text-xs-center
          >
            <v-layout
              row
              wrap
              align-center
            >
              <v-card
                flat
                color="transparent"
                class="white--text"
              >
                <v-card-text class="headline">
                  <h3 class="mb-0">
                    {{ $t('ui.pages.index.whatIsEzpaarse') }}
                  </h3>
                  <p v-html="$t('ui.pages.index.description', descriptionLinks)" />
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-chip v-on="on">
                        <v-avatar>
                          <v-icon right>
                            mdi-thumb-up-outline
                          </v-icon>
                        </v-avatar>
                        {{ $t('ui.pages.index.simpleTool') }}
                      </v-chip>
                    </template>
                    <span v-text="$t('ui.pages.index.fewClicksToInstall')" />
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-chip v-on="on">
                        <v-avatar>
                          <v-icon right>
                            mdi-comment
                          </v-icon>
                        </v-avatar>
                        {{ $t('ui.pages.index.availableTeam') }}
                      </v-chip>
                    </template>
                    <span v-text="$t('ui.pages.index.contactUs')" />
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-chip v-on="on">
                        <v-avatar>
                          <v-icon right>
                            mdi-account-group
                          </v-icon>
                        </v-avatar>
                        {{ $t('ui.pages.index.growingCommunity') }}
                      </v-chip>
                    </template>
                    <span v-text="$t('ui.pages.index.notOnlyFrench')" />
                  </v-tooltip>
                </v-card-text>
              </v-card>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>

      <v-flex
        xs12
        sm6
      >
        <v-container
          fill-height
          grid-list-md
          text-xs-center
        >
          <v-layout
            row
            wrap
            align-center
          >
            <v-flex
              xs12
              sm12
            >
              <img
                src="~/assets/img/logo.png"
                alt="ezPAARSE"
              >
              <p v-text="$t('ui.pages.index.signInEasy')" />
              <v-alert
                v-if="appInfos.demo"
                :value="true"
                color="info"
              >
                <h3>{{ $t('ui.pages.index.demoHeader') }}</h3>
                <div>{{ $t('ui.pages.index.demoText') }}</div>
              </v-alert>

              <nuxt />

              <v-flex
                xs12
                sm12
                md5
              >
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
                />
              </v-flex>
            </v-flex>
          </v-layout>
        </v-container>
        <Snackbar />
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script>
import Snackbar from '~/components/Snackbar.vue';

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
      ],
      descriptionLinks: {
        github: 'https://github.com/ezpaarse-project/ezpaarse',
        analogist: 'http://analyses.ezpaarse.org/',
        doc: 'https://ezpaarse.readthedocs.io/en/master/development/routes.html'
      }
    };
  },
  computed: {
    appInfos () {
      return this.$store.state.appInfos;
    }
  }
};
</script>

<style scoped>
a {
  color: #ccc;
}
</style>
