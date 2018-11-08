<template>
  <v-card>
    <v-toolbar class="secondary" dark dense card>
      <v-toolbar-title>
        {{ $t('ui.pages.process.processLogs') }}
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <h1>{{ $t('ui.pages.process.prepareTreatment') }}</h1>

      <v-alert
        :value="true"
        color="teal"
        xs12 sm12
        outline
      >
        <p class="text-xs-justify" v-html="$t('ui.pages.process.explainationLogs')"></p>
        <p class="text-xs-justify" v-html="$t('ui.pages.process.explainationTestsLogs', { url: 'https://github.com/ezpaarse-project/ezpaarse-dataset-samples' })"></p>
      </v-alert>

      <v-layout row wrap>
        <v-flex xs6 sm6>
          <h4>{{ $t('ui.pages.process.settings.currentSettings') }}</h4>
          <span>{{ $t('ui.pages.process.settings.defaultSettings') }}</span>
        </v-flex>
        
        <v-flex xs6 sm6>
          <v-switch
            class="saveParams"
            :label="$t('ui.pages.process.settings.saveSettings')"
            v-model="paramsSaved"
          ></v-switch>
        </v-flex>

        <v-flex xs12 sm12>
          <v-tabs v-model="activeTab" grow dark>
            <v-tab to="#tab-logs-files">
              <v-icon class="pr-1">mdi-folder-open</v-icon> {{ $t('ui.pages.process.settings.logFiles') }}
              <v-spacer></v-spacer>
            </v-tab>
            <v-tab to="#tab-log-format">
              <v-icon class="pr-1">mdi-file-document</v-icon> {{ $t('ui.pages.process.settings.designLogFormat') }}
              <v-spacer></v-spacer>
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="activeTab">
            <v-tab-item id="tab-logs-files">
              <LogFiles />
            </v-tab-item>

            <v-tab-item id="tab-log-format">
                <LogFormat />
            </v-tab-item>
          </v-tabs-items>
        </v-flex>

        <v-flex xs12 sm12 mt-2>
          <v-expansion-panel>
            <v-expansion-panel-content class="teal lighten-3 white--text">
              <div slot="header">{{ $t('ui.pages.process.settings.title') }}</div>
              <Settings />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-flex>

      </v-layout>      
    </v-card-text>
  </v-card>
</template>

<script>
import LogFiles from '~/components/Process/LogFiles'
import LogFormat from '~/components/Process/LogFormat'
import Settings from '~/components/Process/Settings'

export default {
  components: {
    LogFiles,
    LogFormat,
    Settings
  },
  data () {
    return {
      activeTab: 'tab-logs-files',
      paramsSaved: false
    }
  },
  watch: {
    user () {
      if (!this.user) this.$router.push('/')
    }
  },
  async fetch ({ store, redirect }) {
    try {
      await store.dispatch('GET_USER')
    } catch (e) {
      return redirect('/')
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    saveParams () {
      this.paramsSaved = !this.paramsSaved
    }
  }
}
</script>

<style scoped>
.saveParams {
  float: right;
}
</style>