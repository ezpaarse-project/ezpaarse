<template>
  <v-card>
    <v-toolbar
      class="secondary"
      dark
      dense
      card
    >
      <v-toolbar-title>{{ $t('ui.pages.process.title') }}</v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <h1>{{ $t('ui.pages.process.prepareTreatment') }}</h1>

      <v-alert
        :value="true"
        color="teal"
        xs12
        sm12
        outline
      >
        <p
          class="text-xs-justify"
          v-html="$t('ui.pages.process.explainationLogs')"
        />
        <p
          class="text-xs-justify"
          v-html="$t('ui.pages.process.explainationTestsLogs', { url: 'https://github.com/ezpaarse-project/ezpaarse-dataset-samples' })"
        />
      </v-alert>

      <v-layout
        row
        wrap
      >
        <v-flex
          xs6
          sm6
        >
          <h4>{{ $t('ui.pages.process.settings.currentSettings') }}</h4>
          <span v-if="currentPredefinedSettings">
            {{ currentPredefinedSettings.fullName }}
          </span>
          <span v-if="settingsIsModified">
            ({{ $t('ui.pages.process.settings.modified') }})
          </span>
        </v-flex>

        <v-flex
          xs12
          sm12
        >
          <v-tabs
            v-model="activeTab"
            grow
            dark
          >
            <v-tab to="#tab-logs-files">
              <v-icon class="pr-1">
                mdi-folder-open
              </v-icon>
              {{ $t('ui.pages.process.settings.logFiles') }}
              <v-spacer />
            </v-tab>
            <v-tab to="#tab-log-format">
              <v-icon class="pr-1">
                mdi-file-document
              </v-icon>
              {{ $t('ui.pages.process.settings.designLogFormat') }}
              <v-spacer />
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="activeTab">
            <v-tab-item value="tab-logs-files">
              <LogFiles />
            </v-tab-item>

            <v-tab-item value="tab-log-format">
              <LogFormat />
            </v-tab-item>
          </v-tabs-items>
        </v-flex>

        <v-flex
          xs12
          sm12
          mt-2
        >
          <v-expansion-panel expand>
            <v-expansion-panel-content class="teal white--text">
              <div slot="header">
                {{ $t('ui.pages.process.settings.title') }}
              </div>
              <Settings />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
/* eslint-disable import/no-unresolved */
/* eslint consistent-return: "off" */
import LogFiles from '~/components/Process/LogFiles';
import LogFormat from '~/components/Process/LogFormat';
import Settings from '~/components/Process/Settings';

export default {
  auth: true,
  components: {
    LogFiles,
    LogFormat,
    Settings
  },
  data () {
    return {
      activeTab: 'tab-logs-files',
      paramsSaved: false
    };
  },
  async fetch ({ store, redirect, app }) {
    try {
      if (store.state.process.inProgress && store.state.process.processProgress < 100) {
        return redirect('/process/job');
      }

      if (store.state.process.inProgress && store.state.process.processProgress >= 100) {
        store.dispatch('process/SET_IN_PROGRESS', false);
      }
    } catch (e) {
      await store.dispatch('snacks/error', app.i18n.t('ui.errors.error'));
    }

    try { await store.dispatch('process/GET_PREDEFINED_SETTINGS'); } catch (e) {
      await store.dispatch('snacks/error', `E${e.response.status} - ${this.$t('ui.errors.cannotLoadPredefinedSettings')}`);
    }

    try { await store.dispatch('process/GET_COUNTRIES'); } catch (e) {
      await store.dispatch('snacks/error', `E${e.response.status} - ${this.$t('ui.errors.cannotGetCountriesList')}`);
    }
  },
  computed: {
    user () {
      return this.$store.state.user;
    },
    predefinedSettings () {
      return this.$store.state.process.predefinedSettings;
    },
    currentPredefinedSettings () {
      return this.$store.state.process.currentPredefinedSettings;
    },
    settingsIsModified () {
      return this.$store.state.process.settingsIsModified;
    }
  },
  methods: {
    saveParams () {
      this.paramsSaved = !this.paramsSaved;
    }
  }
};
</script>

<style scoped>
.saveParams {
  float: right;
}
</style>
