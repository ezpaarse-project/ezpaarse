<template>
  <v-card>
    <v-card-text>
      <v-layout row wrap>
        <v-flex xs12 sm12>
          <v-autocomplete
            v-model="currentPredefinedSettings"
            :items="predefinedSettings"
            item-text="fullName"
            :label="$t('ui.pages.process.settings.selectAnOption')"
            :return-object="true"
            box
            clearable
          >
            <template slot="item" slot-scope="data">
              <v-list-tile-content>
                <v-list-tile-title v-html="data.item.fullName"></v-list-tile-title>
                <v-list-tile-sub-title v-html="data.item.country"></v-list-tile-sub-title>
              </v-list-tile-content>
            </template>
          </v-autocomplete>
        </v-flex>

        <v-flex xs12 sm12 mb-3 v-if="currentPredefinedSettings">
          <v-expansion-panel expand>
            <v-expansion-panel-content class="teal white--text">
              <div slot="header">{{ $t('ui.pages.process.settings.input') }}</div>
              <v-card>
                <v-card-text>
                  <v-layout row wrap>
                    <v-flex xs4 sm4 pr-2>
                      <v-select
                        :items="logTypes"
                        item-value="value"
                        item-text="text"
                        v-model="currentPredefinedSettings.headers['Log-Format'].format"
                        :label="$t('ui.pages.process.settings.typeOfLog')"
                      ></v-select>
                    </v-flex>

                    <v-flex xs4 sm4>
                      <v-text-field
                        v-model="currentPredefinedSettings.headers['Date-Format']"
                        :label="$t('ui.pages.process.settings.dateFormat')"
                        :placeholder="currentPredefinedSettings.headers['Date-Format'].length <= 0 ? 'DD/MMM/YYYY:HH:mm:ss Z' : currentPredefinedSettings.headers['Date-Format']"
                        required
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs4 sm4 pl-2>
                      <v-text-field
                        v-model="currentPredefinedSettings.headers['Force-Parser']"
                        :label="$t('ui.pages.process.settings.defaultParser')"
                        placeholder="dspace"
                        required
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs12 sm12 v-if="currentPredefinedSettings.headers['Log-Format'].value.length > 0 || currentPredefinedSettings.headers['Log-Format'].format.length > 0">
                      <v-textarea
                        :label="$t('ui.pages.process.settings.logFormat')"
                        :value="currentPredefinedSettings.headers['Log-Format'].value"
                        v-model="currentPredefinedSettings.headers['Log-Format'].value"
                      ></v-textarea>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>

            <v-expansion-panel-content class="teal white--text" v-if="currentPredefinedSettings">
              <div slot="header">{{ $t('ui.pages.process.settings.output') }}</div>
                <v-card>
                  <v-card-text>
                    <v-layout row wrap>
                      <v-flex xs6 sm6 pr-2>
                        <v-select
                          :items="counterFormats"
                          v-model="currentPredefinedSettings.headers['COUNTER-Format']"
                          :label="$t('ui.pages.process.settings.counterFormat')"
                        ></v-select>
                      </v-flex>

                      <v-flex xs6 sm6>
                        <v-select
                          :items="tracesLevel"
                          v-model="currentPredefinedSettings.headers['Trace-Level']"
                          :label="$t('ui.pages.process.settings.traceLevel')"
                        ></v-select>
                      </v-flex>

                      <v-flex xs12 sm12>
                        <v-combobox
                          v-model="currentPredefinedSettings.headers['ezPAARSE-Job-Notifications']"
                          :label="$t('ui.pages.process.settings.notificationsEmails')"
                          chips
                          clearable
                          multiple
                          append-icon=""
                        >
                          <template slot="selection" slot-scope="data">
                            <v-chip
                              :selected="data.selected"
                              close
                              @input="removeEmail(data.index)"
                            >
                              <strong>{{ data.item }}</strong>
                            </v-chip>
                          </template>
                        </v-combobox>
                      </v-flex>

                      <v-flex xs12 sm12>
                        <v-checkbox
                          :label="$t('ui.pages.process.settings.counterReports')"
                          v-model="currentPredefinedSettings.headers['COUNTER-Reports']"
                          @change="updateCounterFormat"
                        ></v-checkbox>
                      </v-flex>

                      <v-flex xs12 sm12>
                        <h4>{{ $t('ui.pages.process.settings.outputFields') }} :</h4>
                      </v-flex>
                      <v-flex xs6 sm6>
                        <v-combobox
                          v-model="currentPredefinedSettings.headers['Output-Fields'].plus"
                          :label="$t('ui.pages.process.settings.add')"
                          chips
                          clearable
                          multiple
                          append-icon=""
                        >
                          <template slot="selection" slot-scope="data">
                            <v-chip
                              :selected="data.selected"
                              close
                              @input="removeOutputPlus(data.index)"
                            >
                              <strong>{{ data.item }}</strong>
                            </v-chip>
                          </template>
                        </v-combobox>
                      </v-flex>

                      <v-flex xs6 sm6 pl-2>
                        <v-combobox
                          v-model="currentPredefinedSettings.headers['Output-Fields'].minus"
                          chips
                          clearable
                          :label="$t('ui.pages.process.settings.remove')"
                          multiple
                          append-icon=""
                        >
                          <template slot="selection" slot-scope="data">
                            <v-chip
                              :selected="data.selected"
                              close
                              @input="removeOutputMinus(data.index)"
                            >
                              <strong>{{ data.item }}</strong>
                            </v-chip>
                          </template>
                        </v-combobox>
                      </v-flex>

                      <v-flex xs12 sm12>
                        <v-combobox
                          v-model="currentPredefinedSettings.headers['Crypted-Fields']"
                          chips
                          clearable
                          :label="$t('ui.pages.process.settings.cryptedFields')"
                          multiple
                          append-icon=""
                        >
                          <template slot="selection" slot-scope="data">
                            <v-chip
                              :selected="data.selected"
                              close
                              @input="removeCryptedField(data.index)"
                            >
                              <strong>{{ data.item }}</strong>
                            </v-chip>
                          </template>
                        </v-combobox>                      
                      </v-flex>

                      <v-flex xs12 sm12 mt-3>
                        {{ $t('ui.pages.process.settings.counterReportDetail') }}
                      </v-flex>

                    </v-layout>
                  </v-card-text>
                </v-card>
            </v-expansion-panel-content>

            <v-expansion-panel-content class="teal white--text" v-if="currentPredefinedSettings">
              <div slot="header">Headers ({{ $t('ui.pages.process.settings.advancedHeaders') }})</div>
              <v-card>
                <v-card-text>
                  <v-layout row wrap>
                    <v-flex xs12 sm12>
                      <v-autocomplete
                        v-model="header"
                        :items="headers"
                        item-text="name"
                        item-value="name"
                        box
                        label="Headers"
                        append-icon="mdi-chevron-down"
                        @change="addHeader(header)"
                      >
                      </v-autocomplete>
                    </v-flex>
                    
                    <v-flex xs12 sm12 v-for="(header, key) in currentPredefinedSettings.headers.advancedHeaders" :key="key">
                      <v-layout row wrap>
                        <v-flex xs2 sm2 pr-2>
                          <v-text-field
                            :value="header.header"
                            v-model="header.header"
                            prepend-icon="mdi-information"
                            @click:prepend="informations(header.header)"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs10 sm10>
                          <v-text-field
                            :value="header.value"
                            v-model="header.value"
                            append-outer-icon="mdi-close-circle"
                            @click:append-outer="removeHeader(key)"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>          
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-flex>

        <v-flex xs12 sm12 class="text-xs-center">
          <ButtonGroup>
            <v-btn color="success" block large @click="saveCustomSettings" :disabled="disabledButton">
              <v-icon left>mdi-content-save-settings</v-icon>
              {{ $t('ui.save') }}
            </v-btn>
            <v-btn color="primary" block large @click="resetSettings" :disabled="disabledButton">
              {{ $t('ui.pages.process.settings.defaultParams') }}
              <v-icon right>mdi-reload</v-icon>
            </v-btn>
          </ButtonGroup>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import ButtonGroup from '~/components/ButtonGroup'
import isEqual from 'lodash.isequal'

export default {
  components: {
    ButtonGroup
  },
  data () {
    return {
      disabledButton: true,
      logTypes: [
        { value: '', text: 'Reconnaissance auto' },
        { value: 'ezproxy', text: 'EZproxy' },
        { value: 'apache', text: 'Apache' },
        { value: 'squid', text: 'Squid' }
      ],
      counterFormats: [
        { value: 'csv', text: 'CSV'},
        { value: 'tsv', text: 'TSV'},
        { value: 'json', text: 'JSON' }
      ],
      tracesLevel: [
        { value: 'info', text: 'Informations générales'},
        { value: 'error', text: 'Erreurs uniquement'},
        { value: 'warn', text: 'Warnings sans conséquences' }
      ],
      header: null,
      headers: [
        { header: 'Encodage' },
        { name: 'Response-Encoding', anchor: 'response-encoding' },
        { name: 'Accept-Encoding', anchor: 'accept-encoding' },
        { name: 'Request-Charset', anchor: 'request-charset' },
        { name: 'Response-Charset', anchor: 'response-charset' },
        { divider: true },
        { header: 'Format' },
        { name: 'Accept', anchor: 'accept' },
        { name: 'Log-Format-xxx', anchor: 'log-format-xxx' },
        { name: 'Date-Format', anchor: 'date-format' },
        { name: 'Output-Fields', anchor: 'output-fields' },
        { name: 'Max-Parse-Attempts', anchor: 'max-parse-attempts' },
        { divider: true },
        { header: 'Extraction' },
        { name: 'Extract', anchor: 'extract' },
        { divider: true },
        { header: 'COUNTER' },
        { name: 'COUNTER-Reports', anchor: 'counter-reports' },
        { name: 'COUNTER-Format', anchor: 'counter-format' },
        { name: 'COUNTER-Customer', anchor: 'counter-customer' },
        { name: 'COUNTER-Vendor', anchor: 'counter-vendor' },
        { divider: true },
        { header: 'Deduplication' },
        { name: 'Double-Click-Removal', anchor: 'double-click-xxx' },
        { name: 'Double-Click-HTML', anchor: 'double-click-xxx' },
        { name: 'Double-Click-PDF', anchor: 'double-click-xxx' },
        { name: 'Double-Click-MISC', anchor: 'double-click-xxx' },
        { name: 'Double-Click-MIXED', anchor: 'double-click-xxx' },
        { name: 'Double-Click-Strategy', anchor: 'double-click-xxx' },
        { name: 'Double-Click-C-Field', anchor: 'double-click-xxx' },
        { name: 'Double-Click-L-Field', anchor: 'double-click-xxx' },
        { name: 'Double-Click-I-Field', anchor: 'double-click-xxx' },
        { divider: true },
        { header: 'Anonymization' },
        { name: 'Crypted-Fields', anchor: 'crypted-fields' },
        { divider: true },
        { header: 'Other' },
        { name: 'Traces-Level', anchor: 'traces-level' },
        { name: 'Reject-Files', anchor: 'reject-files' },
        { name: 'Clean-Only', anchor: 'clean-only' },
        { name: 'Force-Parser', anchor: 'force-parser' },
        { name: 'Geoip', anchor: 'geoip' },
        { name: 'ezPAARSE-Job-Notifications', anchor: 'ezpaarse-job-notifications' },
        { name: 'ezPAARSE-Enrich', anchor: 'ezpaarse-enrich' },
        { name: 'ezPAARSE-Predefined-Settings', anchor: 'ezpaarse-predefined-settings' },
        { name: 'ezPAARSE-Filter-Redirects', anchor: 'ezpaarse-filter-redirects' },
        { name: 'Disable-Filters', anchor: 'disable-filters' },
        { name: 'Force-ECField-Publisher', anchor: 'force-ecfield-publisher' },
        { name: 'Extract', anchor: 'extract' },
        { name: 'ezPAARSE-Middlewares', anchor: 'ezpaarse-middlewares' },
        { divider: true },
        { header: 'Metadata enrichment' },
        { name: 'Crossref-enrich', anchor: 'crossref' },
        { name: 'Crossref-ttl', anchor: 'crossref' },
        { name: 'Crossref-throttle', anchor: 'crossref' },
        { name: 'Crossref-paquet-size', anchor: 'crossref' },
        { name: 'Crossref-buffer-size', anchor: 'crossref' },
        { name: 'Sudoc-enrich', anchor: 'sudoc' },
        { name: 'Sudoc-ttl', anchor: 'sudoc' },
        { name: 'Sudoc-throttle', anchor: 'sudoc' },
        { name: 'Hal-enrich', anchor: 'hal' },
        { name: 'Hal-ttl', anchor: 'hal' },
        { name: 'Hal-throttle', anchor: 'hal' },
        { name: 'Istex-enrich', anchor: 'istex' },
        { name: 'Istex-ttl', anchor: 'istex' },
        { name: 'Istex-throttle', anchor: 'istex' }
      ]
    }
  },
  computed: {
    currentPredefinedSettings: {
      get () { return this.$store.state.process.currentPredefinedSettings },
      set (newVal) { this.$store.dispatch('process/SET_CURRENT_PREDEFINED_SETTINGS', JSON.parse(JSON.stringify(newVal || this.predefinedSettings[0]))) }
    },
    predefinedSettings () {
      return this.$store.state.process.predefinedSettings
    }
  },
  watch: {
    currentPredefinedSettings: {
      handler: function (newVal) {
        let changed = this.predefinedSettings.find(p => {
          return p.fullName === newVal.fullName
        })
        this.disabledButton = !!isEqual(changed, this.currentPredefinedSettings)
      },
      deep: true
    }
  },
  methods: {
    removeOutputPlus (index) {
      this.currentPredefinedSettings.headers['Output-Fields'].plus.splice(index, 1)
    },
    removeOutputMinus (index) {
      this.currentPredefinedSettings.headers['Output-Fields'].minus.splice(index, 1)
    },
    removeCryptedField (value) {
      this.currentPredefinedSettings.headers['Crypted-Fields'].splice(value, 1)
    },
    removeEmail (index) {
      this.currentPredefinedSettings.headers['ezPAARSE-Job-Notifications'].plus.splice(index, 1)
    },
    addHeader (value) {
      if (value) {
        this.currentPredefinedSettings.headers.advancedHeaders.push({ header: value, value: null })
        this.header = null
      }
    },
    removeHeader (header) {
      this.currentPredefinedSettings.headers.advancedHeaders.splice(header, 1)
    },
    updateCounterFormat () {
      if (this.currentPredefinedSettings.headers['COUNTER-Reports']) this.currentPredefinedSettings.headers['COUNTER-Format'] = 'tsv'
    },
    resetSettings () {
      const currentSettings = this.predefinedSettings.find(param => {
        return param.fullName === this.currentPredefinedSettings.fullName
      })
      this.$store.dispatch('process/SET_CURRENT_PREDEFINED_SETTINGS', JSON.parse(JSON.stringify(currentSettings)))
    },
    informations (header) {
      const h = this.headers.find(h => {
        return header === h.name
      })
      if (h) window.open(`https://ezpaarse.readthedocs.io/en/master/configuration/parametres.html#${h.anchor}`, '_blank')
    },
    saveCustomSettings () {
      let customPs
      if (localStorage.getItem('ezpaarse_cps')) {
        const ezpaarseCps = JSON.parse(localStorage.getItem('ezpaarse_cps'))
        let index = ezpaarseCps.findIndex(cps => {
          return cps.fullName === this.currentPredefinedSettings.fullName
        })
        
        customPs = JSON.parse(JSON.stringify(this.currentPredefinedSettings))
        customPs.fullName = `${customPs.fullName}`
        if (index >= 0) {
          ezpaarseCps[index] = customPs
        } else {
          ezpaarseCps.push(customPs)
        }

        localStorage.setItem('ezpaarse_cps', JSON.stringify(ezpaarseCps))
      } else {
        customPs = JSON.parse(JSON.stringify(this.currentPredefinedSettings))
        customPs.fullName = `${customPs.fullName}`
        localStorage.setItem('ezpaarse_cps', JSON.stringify([customPs]))
      }
    }
  }
}
</script>
