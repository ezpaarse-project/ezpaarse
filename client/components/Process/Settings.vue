<template>
  <v-card>
    <v-card-text>
      <v-layout row wrap>
        <v-flex xs12 sm12>
          <v-autocomplete
            v-model="currentPredefinedSettings"
            :items="predefinedSettings"
            :item-text="predefinedSettingsText"
            :label="$t('ui.pages.process.settings.selectAnOption')"
            :return-object="true"
            solo
            append-outer-icon="mdi-close-circle"
            @click:append-outer="resetSettings"
          ></v-autocomplete>
        </v-flex>

        <v-flex xs12 sm12 mb-3 v-if="currentPredefinedSettings">
          <v-expansion-panel expand>
            <v-expansion-panel-content class="teal lighten-3 white--text">
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
                        placeholder="DD/MMM/YYYY:HH:mm:ss Z"
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

                    <v-flex xs12 sm12 v-if="currentPredefinedSettings.headers['Log-Format'].value || currentPredefinedSettings.headers['Log-Format'].format">
                      <v-textarea
                        :label="$t('ui.pages.process.settings.logFormat')"
                        :value="currentPredefinedSettings.headers['Log-Format'].value"
                      ></v-textarea>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>

            <v-expansion-panel-content class="teal lighten-3 white--text" v-if="currentPredefinedSettings">
              <div slot="header">{{ $t('ui.pages.process.settings.output') }}</div>
                <v-card>
                  <v-card-text>
                    <v-layout row wrap>
                      <v-flex xs4 sm4 pr-2>
                        <v-select
                          :items="counterFormats"
                          v-model="currentPredefinedSettings.headers['COUNTER-Format']"
                          :label="$t('ui.pages.process.settings.counterFormat')"
                        ></v-select>
                      </v-flex>

                      <v-flex xs4 sm4>
                        <v-select
                          :items="tracesLevel"
                          v-model="currentPredefinedSettings.headers['Trace-Level']"
                          :label="$t('ui.pages.process.settings.traceLevel')"
                        ></v-select>
                      </v-flex>

                      <v-flex xs4 sm4 pl-2>
                        <v-text-field
                          v-model="currentPredefinedSettings.headers['ezPAARSE-Job-Notifications']"
                          label="Notifications"
                          :placeholder="$t('ui.pages.process.settings.notificationsEmails')"
                          required
                        ></v-text-field>
                      </v-flex>

                      <v-flex xs12 sm12>
                        <v-checkbox
                          :label="$t('ui.pages.process.settings.counterReports')"
                          v-model="currentPredefinedSettings.headers['COUNTER-Reports']"
                          @change="updateCounterFormat"
                        ></v-checkbox>
                      </v-flex>

                      <v-flex xs6 sm6>
                        <v-combobox
                          v-model="currentPredefinedSettings.headers['Output-Fields'].plus"
                          :label="$t('ui.pages.process.settings.outputFields')"
                          chips
                          clearable
                          :placeholder="$t('ui.pages.process.settings.add')"
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
                          :placeholder="$t('ui.pages.process.settings.remove')"
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

            <v-expansion-panel-content class="teal lighten-3 white--text" v-if="currentPredefinedSettings">
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

        <v-btn color="primary" block large @click="resetSettings">
          <v-icon left>mdi-reload</v-icon>
          {{ $t('ui.pages.process.settings.defaultParams') }}
        </v-btn>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data () {
    return {
      logTypes: [
        { value: null, text: 'Reconnaissance auto' },
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
        { group: 'Encoding', name: 'Response-Encoding', anchor: 'response-encoding' },
        { group: 'Encoding', name: 'Accept-Encoding', anchor: 'accept-encoding' },
        { group: 'Encoding', name: 'Request-Charset', anchor: 'request-charset' },
        { group: 'Encoding', name: 'Response-Charset', anchor: 'response-charset' },
        { header: 'Format' },
        { group: 'Format', name: 'Accept', anchor: 'accept' },
        { group: 'Format', name: 'Log-Format-xxx', anchor: 'log-format-xxx' },
        { group: 'Format', name: 'Date-Format', anchor: 'date-format' },
        { group: 'Format', name: 'Output-Fields', anchor: 'output-fields' },
        { group: 'Format', name: 'Max-Parse-Attempts', anchor: 'max-parse-attempts' },
        { header: 'Extraction' },
        { group: 'Extraction', name: 'Extract', anchor: 'extract' },
        { header: 'COUNTER' },
        { group: 'COUNTER', name: 'COUNTER-Reports', anchor: 'counter-reports' },
        { group: 'COUNTER', name: 'COUNTER-Format', anchor: 'counter-format' },
        { group: 'COUNTER', name: 'COUNTER-Customer', anchor: 'counter-customer' },
        { group: 'COUNTER', name: 'COUNTER-Vendor', anchor: 'counter-vendor' },
        { header: 'Deduplication' },
        { group: 'Deduplication', name: 'Double-Click-Removal', anchor: 'double-click-xxx' },
        { group: 'Deduplication', name: 'Double-Click-HTML', anchor: 'double-click-xxx' },
        { group: 'Deduplication', name: 'Double-Click-PDF', anchor: 'double-click-xxx' },
        { group: 'Deduplication', name: 'Double-Click-MISC', anchor: 'double-click-xxx' },
        { group: 'Deduplication', name: 'Double-Click-MIXED', anchor: 'double-click-xxx' },
        { group: 'Deduplication', name: 'Double-Click-Strategy', anchor: 'double-click-xxx' },
        { group: 'Deduplication', name: 'Double-Click-C-Field', anchor: 'double-click-xxx' },
        { group: 'Deduplication', name: 'Double-Click-L-Field', anchor: 'double-click-xxx' },
        { group: 'Deduplication', name: 'Double-Click-I-Field', anchor: 'double-click-xxx' },
        { header: 'Anonymization' },
        { group: 'Anonymization', name: 'Crypted-Fields', anchor: 'crypted-fields' },
        { header: 'Other' },
        { group: 'Other', name: 'Traces-Level', anchor: 'traces-level' },
        { group: 'Other', name: 'Reject-Files', anchor: 'reject-files' },
        { group: 'Other', name: 'Clean-Only', anchor: 'clean-only' },
        { group: 'Other', name: 'Force-Parser', anchor: 'force-parser' },
        { group: 'Other', name: 'Geoip', anchor: 'geoip' },
        { group: 'Other', name: 'ezPAARSE-Job-Notifications', anchor: 'ezpaarse-job-notifications' },
        { group: 'Other', name: 'ezPAARSE-Enrich', anchor: 'ezpaarse-enrich' },
        { group: 'Other', name: 'ezPAARSE-Predefined-Settings', anchor: 'ezpaarse-predefined-settings' },
        { group: 'Other', name: 'ezPAARSE-Filter-Redirects', anchor: 'ezpaarse-filter-redirects' },
        { group: 'Other', name: 'Disable-Filters', anchor: 'disable-filters' },
        { group: 'Other', name: 'Force-ECField-Publisher', anchor: 'force-ecfield-publisher' },
        { group: 'Other', name: 'Extract', anchor: 'extract' },
        { group: 'Other', name: 'ezPAARSE-Middlewares', anchor: 'ezpaarse-middlewares' },
        { header: 'Metadata enrichment' },
        { group: 'Metadata enrichment', name: 'Crossref-enrich', anchor: 'crossref' },
        { group: 'Metadata enrichment', name: 'Crossref-ttl', anchor: 'crossref' },
        { group: 'Metadata enrichment', name: 'Crossref-throttle', anchor: 'crossref' },
        { group: 'Metadata enrichment', name: 'Crossref-paquet-size', anchor: 'crossref' },
        { group: 'Metadata enrichment', name: 'Crossref-buffer-size', anchor: 'crossref' },
        { group: 'Metadata enrichment', name: 'Sudoc-enrich', anchor: 'sudoc' },
        { group: 'Metadata enrichment', name: 'Sudoc-ttl', anchor: 'sudoc' },
        { group: 'Metadata enrichment', name: 'Sudoc-throttle', anchor: 'sudoc' },
        { group: 'Metadata enrichment', name: 'Hal-enrich', anchor: 'hal' },
        { group: 'Metadata enrichment', name: 'Hal-ttl', anchor: 'hal' },
        { group: 'Metadata enrichment', name: 'Hal-throttle', anchor: 'hal' },
        { group: 'Metadata enrichment', name: 'Istex-enrich', anchor: 'istex' },
        { group: 'Metadata enrichment', name: 'Istex-ttl', anchor: 'istex' },
        { group: 'Metadata enrichment', name: 'Istex-throttle', anchor: 'istex' }
      ]
    }
  },
  computed: {
    currentPredefinedSettings: {
      get () { return this.$store.state.process.currentPredefinedSettings },
      set (newVal) { this.$store.dispatch('process/SET_CURRENT_PREDEFINED_SETTINGS', JSON.parse(JSON.stringify(newVal))) }
    },
    predefinedSettings () {
      return this.$store.state.process.predefinedSettings
    }
  },
  methods: {
    removeOutputPlus (index) {
      this.currentPredefinedSettings.headers['Output-Fields'].plus.splice(index, 1)
    },
    removeOutputMinus (index) {
      this.currentPredefinedSettings.headers['Output-Fields'].minus.splice(index, 1)
    },
    addOutputPlus (data) {
      this.currentPredefinedSettings.headers['Output-Fields'].plus.push(data)
    },
    addOutputMinus (data) {
      this.currentPredefinedSettings.headers['Output-Fields'].minus.push(data)
    },
    removeCryptedField (value) {
      this.currentPredefinedSettings.headers['Crypted-Fields'].splice(value, 1)
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
    predefinedSettingsText (item) {
      return `${item['country']} - ${item['fullName']}`
    },
    updateCounterFormat () {
      if (this.currentPredefinedSettings.headers['COUNTER-Reports']) this.currentPredefinedSettings.headers['COUNTER-Format'] = 'tsv'
    },
    resetSettings () {
      const currentSettings = this.predefinedSettings.filter(param => {
        return param.fullName === this.currentPredefinedSettings.fullName
      })
      this.$store.dispatch('process/SET_CURRENT_PREDEFINED_SETTINGS', JSON.parse(JSON.stringify(currentSettings)))
    },
    removeEmail (index) {
      this.currentPredefinedSettings.headers.emails.splice(index, 1)
    }
  }
}
</script>
