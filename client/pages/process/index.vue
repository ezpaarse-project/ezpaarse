<template>
  <v-card>
    <v-toolbar class="secondary" dark dense card>
      <v-toolbar-title>{{ $t('ui.pages.process.processLogs') }}</v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <h1>{{ $t('ui.pages.process.prepareTreatment') }}</h1>

      <v-alert :value="true" color="teal" xs12 sm12 outline>
        <p class="text-xs-justify" v-html="$t('ui.pages.process.explainationLogs')"></p>
        <p
          class="text-xs-justify"
          v-html="$t('ui.pages.process.explainationTestsLogs', { url: 'https://github.com/ezpaarse-project/ezpaarse-dataset-samples' })"
        ></p>
      </v-alert>

      <v-layout row wrap>
        <v-flex xs6 sm6>
          <h4>{{ $t('ui.pages.process.settings.currentSettings') }}</h4>
          <span>{{ currentSettings }}</span>
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
              <v-icon class="pr-1">mdi-folder-open</v-icon>
              {{ $t('ui.pages.process.settings.logFiles') }}
              <v-spacer></v-spacer>
            </v-tab>
            <v-tab to="#tab-log-format">
              <v-icon class="pr-1">mdi-file-document</v-icon>
              {{ $t('ui.pages.process.settings.designLogFormat') }}
              <v-spacer></v-spacer>
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="activeTab">
            <v-tab-item value="tab-logs-files">
              <LogFiles/>
            </v-tab-item>

            <v-tab-item value="tab-log-format">
              <LogFormat/>
            </v-tab-item>
          </v-tabs-items>
        </v-flex>

        <v-flex xs12 sm12 mt-2>
          <v-expansion-panel>
            <v-expansion-panel-content class="teal lighten-3 white--text">
              <div slot="header">{{ $t('ui.pages.process.settings.title') }}</div>
              <Settings :predefinedSettings="predefinedSettings" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import LogFiles from "~/components/Process/LogFiles";
import LogFormat from "~/components/Process/LogFormat";
import Settings from "~/components/Process/Settings";

export default {
  auth: true,
  components: {
    LogFiles,
    LogFormat,
    Settings
  },
  data() {
    return {
      activeTab: "tab-logs-files",
      paramsSaved: false,
      currentSettings: this.$t('ui.pages.process.settings.defaultSettings')
    }
  },
  async fetch ({ store }) {
    try {
      store.dispatch('GET_PREDEFINED_SETTINGS')
    } catch (e) { }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    predefinedSettings () {

      let ps = []

      ps.push({
        name: 'default',
        fullName: 'Default',
        country: 'Worldwide',
        headers: {
          cryptedFields: ['host', 'login'],
          outputFields: {
            plus: [],
            minus: []
          },
          logFormat: {
            format: null,
            value: null
          },
          forceParser: null,
          dateFormat: null,
          counterReports: null,
          counterFormat: 'csv'
        },
        advancedHeaders: []
      })

      if (this.$store.state.predefinedSettings) {
        Object.keys(this.$store.state.predefinedSettings).forEach((k) => {
          let data = this.$store.state.predefinedSettings[k]
          let setting = {
            name: k,
            fullName: data.fullName,
            country: data.country,
            headers: {
              cryptedFields: [],
              outputFields: {
                plus: [],
                minus: []
              },
              logFormat: {
                format: null,
                value: null
              },
              forceParser: null,
              dateFormat: null,
              counterReports: false,
              counterFormat: null
            },
            advancedHeaders: []
          }
          if (data.headers) {
            Object.keys(data.headers).forEach(header => {
              let match
              if ((match = /^(Crypted-Fields|Output-Fields|Force-Parser|Date-Format|COUNTER-Reports|COUNTER-Format)$/i.exec(header)) !== null) {
                for (let i = 1; i < match.length; i++) {
                  switch (match[i]) {
                    case 'Crypted-Fields':
                      if (data.headers[header] === 'none') setting.headers.cryptedFields = []
                      if (data.headers[header] !== 'none') {
                        setting.headers.cryptedFields = data.headers[header].split(',')
                      }
                    break

                    case 'Output-Fields':
                      data.headers[header].split(',').map(e => {
                        if (e.charAt(0) === '+') setting.headers.outputFields.plus.push(e.slice(1))
                        if (e.charAt(0) === '-') setting.headers.outputFields.minus.push(e.slice(1))
                      })
                    break

                    case 'Force-Parser':
                      setting.headers.forceParser = data.headers[header]
                    break

                    case 'Date-Format':
                      setting.headers.dateFormat = data.headers[header]
                    break

                    case 'COUNTER-Reports':
                      setting.headers.counterReports = true
                    break

                    case 'COUNTER-Format':
                      setting.headers.counterFormat = data.headers[header].toUpperCase()
                    break
                  }
                } 
              } else if ((match = /^(Log-Format-ezproxy|Log-Format-apache|Log-Format-squid|)$/i.exec(header)) !== null) {
                for (let i = 1; i < match.length; i++) {
                  switch (match[i]) {
                    case 'Log-Format-ezproxy':
                      setting.headers.logFormat.format = 'ezproxy'
                      setting.headers.logFormat.value = data.headers[header]
                    break

                    case 'Log-Format-apache':
                      setting.headers.logFormat.format = 'apache'
                      setting.headers.logFormat.value = data.headers[header]
                    break

                    case 'Log-Format-squid':
                      setting.headers.logFormat.format = 'squis'
                      setting.headers.logFormat.value = data.headers[header]
                    break
                  }
                }
              } else {
                setting.advancedHeaders.push({ header, value: data.headers[header] })
              }
            })
          }
          ps.push(setting)
        })
      }
      return ps
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