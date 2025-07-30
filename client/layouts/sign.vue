<template>
  <v-app id="ezpaarse-sign">
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <v-card text height="100%" color="primary" tile>
          <v-container fill-height grid-list-md text-center>
            <v-layout row wrap align-center>
              <v-card text color="transparent" outlined>
                <v-card-text class="headline white--text">
                  <h3 class="mb-0" v-html="$t('ui.pages.index.whatIsEzpaarse')" />
                  <p v-html="$t('ui.pages.index.description', descriptionLinks)" />
                  <v-tooltip bottom>
                    <template #activator="{ on }">
                      <v-chip v-on="on">
                        <v-avatar left>
                          <v-icon small>
                            mdi-thumb-up-outline
                          </v-icon>
                        </v-avatar>
                        <span v-text="$t('ui.pages.index.simpleTool')" />
                      </v-chip>
                    </template>
                    <span v-text="$t('ui.pages.index.fewClicksToInstall')" />
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template #activator="{ on }">
                      <v-chip v-on="on">
                        <v-avatar left>
                          <v-icon small>
                            mdi-comment
                          </v-icon>
                        </v-avatar>
                        <span v-text="$t('ui.pages.index.availableTeam')" />
                      </v-chip>
                    </template>
                    <span v-text="$t('ui.pages.index.contactUs')" />
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template #activator="{ on }">
                      <v-chip v-on="on">
                        <v-avatar left>
                          <v-icon small>
                            mdi-account-group
                          </v-icon>
                        </v-avatar>
                        <span v-text="$t('ui.pages.index.growingCommunity')" />
                      </v-chip>
                    </template>
                    <span v-text="$t('ui.pages.index.notOnlyFrench')" />
                  </v-tooltip>
                </v-card-text>
                <div v-if="$config.isInist" class="drawer-image">
                  <a
                    href="https://inist.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <v-img
                      :src="require('@/static/img/inist-light.png')"
                      alt="Inist CNRS"
                      style="max-width: 120px; max-height: 120px;"
                    />
                  </a>
                </div>
              </v-card>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>

      <v-flex xs12 sm6>
        <v-container fill-height grid-list-md text-center>
          <v-layout row wrap align-center>
            <v-flex xs12 sm12>
              <img
                :src="require('@/static/img/logo.png')"
                alt="ezPAARSE"
                width="254px"
              >
              <p class="body-2" v-html="$t('ui.pages.index.signInEasy')" />

              <v-card v-if="appInfos.demo" color="info" class="white--text my-3">
                <v-toolbar height="8px" color="blue darken-2" flat />

                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-title
                      class="white--text title"
                      v-text="$t('ui.pages.index.demoHeader')"
                    />
                    <v-list-item-subtitle
                      class="white--text"
                      v-text="$t('ui.pages.index.demoText')"
                    />
                  </v-list-item-content>
                </v-list-item>
              </v-card>

              <Feedback v-if="feedback" />
              <span v-else>
                <nuxt />
              </span>

              <v-layout row wrap>
                <v-flex xs12 sm12 md3>
                  <v-select
                    :value="locale"
                    :items="availableLocales"
                    :label="$t('ui.language')"
                    item-text="name"
                    item-value="code"
                    single-line
                    @change="changeLocale"
                  />
                </v-flex>
                <v-spacer />
                <v-flex
                  v-if="!feedback"
                  xs12
                  sm12
                  md9
                  class="text-right"
                >
                  <v-btn
                    color="primary"
                    class="body-2 mt-3"
                    @click="feedback = true"
                    v-text="$t('ui.drawer.feedback')"
                  />
                </v-flex>
                <v-flex
                  v-if="feedback"
                  xs12
                  sm12
                  md9
                  class="text-right"
                >
                  <v-btn
                    color="primary"
                    class="body-2 mt-3"
                    @click="feedback = false"
                    v-text="$t('ui.back')"
                  />
                </v-flex>
              </v-layout>
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
import Feedback from '~/components/Feedback.vue';

export default {
  components: {
    Snackbar,
    Feedback
  },
  data () {
    return {
      feedback: false,
      descriptionLinks: {
        github: 'https://github.com/ezpaarse-project/ezpaarse',
        analogist: 'http://analyses.ezpaarse.org/',
        doc: 'https://ezpaarse-project.github.io/ezpaarse/development/routes.html'
      }
    };
  },
  computed: {
    appInfos () {
      return this.$store.state.appInfos;
    },
    locale () {
      return this.$i18n.locale;
    },
    availableLocales () {
      return this.$i18n.locales;
    }
  },
  methods: {
    changeLocale (code) {
      this.$i18n.setLocale(code);
    }
  }
};
</script>

<style scoped>
a {
  color: #ccc;
}

.drawer-image {
  display: flex;
  justify-content: center;
  padding: 16px;
}
</style>
