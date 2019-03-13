<template>
  <v-card>
    <v-card-text>
      <v-layout
        row
        wrap
      >
        <v-flex
          xs12
          sm12
        >
          <v-autocomplete
            v-model="currentPredefinedSettings"
            :items="predefinedSettingsItems()"
            item-text="fullName"
            :label="$t('ui.pages.process.settings.selectAnOption')"
            :return-object="true"
            :append-outer-icon="appendOuterIconCurrentProcess()"
            box
            clearable
            @click:append-outer="removeCustomPredefinedSettings"
          >
            <template
              slot="item"
              slot-scope="data"
            >
              <v-list-tile-content>
                <v-list-tile-title v-html="data.item.fullName" />
                <v-list-tile-sub-title v-html="data.item.country" />
              </v-list-tile-content>
            </template>
          </v-autocomplete>

          <v-checkbox
            v-if="customPredefinedSettings.length > 0"
            v-model="displayCustomPredefinedSettings"
            class="mTopM20"
            :label="$t('ui.pages.process.settings.showOnlyCustomPredefinedSettings')"
            @change="setCurrentToCustomPredefinedSettings"
          />
        </v-flex>

        <v-flex
          v-if="currentPredefinedSettings"
          xs12
          sm12
          mb-3
        >
          <v-expansion-panel expand>
            <v-expansion-panel-content class="teal white--text">
              <div slot="header">
                {{ $t('ui.pages.process.settings.input') }}
              </div>
              <v-card>
                <v-card-text>
                  <v-layout
                    row
                    wrap
                  >
                    <v-flex
                      xs4
                      sm4
                      pr-2
                    >
                      <v-select
                        v-model="currentPredefinedSettings.headers['Log-Format'].format"
                        :items="logTypes"
                        item-value="value"
                        item-text="text"
                        :label="$t('ui.pages.process.settings.typeOfLog')"
                      />
                    </v-flex>

                    <v-flex
                      xs4
                      sm4
                    >
                      <v-text-field
                        v-model="currentPredefinedSettings.headers['Date-Format']"
                        :label="$t('ui.pages.process.settings.dateFormat')"
                        placeholder="DD/MMM/YYYY:HH:mm:ss Z"
                        required
                      />
                    </v-flex>

                    <v-flex
                      xs4
                      sm4
                      pl-2
                    >
                      <v-text-field
                        v-model="currentPredefinedSettings.headers['Force-Parser']"
                        :label="$t('ui.pages.process.settings.defaultParser')"
                        placeholder="dspace"
                        required
                      />
                    </v-flex>

                    <v-flex
                      v-if="haveLogFormat()"
                      xs12
                      sm12
                    >
                      <v-textarea
                        v-model="currentPredefinedSettings.headers['Log-Format'].value"
                        :label="$t('ui.pages.process.settings.logFormat')"
                        :value="currentPredefinedSettings.headers['Log-Format'].value"
                      />
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>

            <v-expansion-panel-content
              v-if="currentPredefinedSettings"
              class="teal white--text"
            >
              <div slot="header">
                {{ $t('ui.pages.process.settings.output') }}
              </div>
              <v-card>
                <v-card-text>
                  <v-layout
                    row
                    wrap
                  >
                    <v-flex
                      xs6
                      sm6
                      pr-2
                    >
                      <v-select
                        v-model="currentPredefinedSettings.headers['COUNTER-Format']"
                        :items="counterFormats"
                        :label="$t('ui.pages.process.settings.counterFormat')"
                      />
                    </v-flex>

                    <v-flex
                      xs6
                      sm6
                    >
                      <v-select
                        v-model="currentPredefinedSettings.headers['Trace-Level']"
                        :items="tracesLevel"
                        :label="$t('ui.pages.process.settings.traceLevel')"
                      />
                    </v-flex>

                    <v-flex
                      xs12
                      sm12
                    >
                      <v-combobox
                        v-model="currentPredefinedSettings.headers['ezPAARSE-Job-Notifications']"
                        :label="$t('ui.pages.process.settings.notificationsEmails')"
                        chips
                        clearable
                        multiple
                        append-icon=""
                      >
                        <template
                          slot="selection"
                          slot-scope="data"
                        >
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

                    <v-flex
                      xs12
                      sm12
                    >
                      <v-checkbox
                        v-model="currentPredefinedSettings.headers['COUNTER-Reports']"
                        :label="$t('ui.pages.process.settings.counterReports')"
                        @change="updateCounterFormat"
                      />
                    </v-flex>

                    <v-flex
                      xs12
                      sm12
                    >
                      <h4>{{ $t('ui.pages.process.settings.outputFields') }} :</h4>
                    </v-flex>
                    <v-flex
                      xs6
                      sm6
                    >
                      <v-combobox
                        v-model="currentPredefinedSettings.headers['Output-Fields'].plus"
                        :label="$t('ui.pages.process.settings.add')"
                        chips
                        clearable
                        multiple
                        append-icon=""
                      >
                        <template
                          slot="selection"
                          slot-scope="data"
                        >
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

                    <v-flex
                      xs6
                      sm6
                      pl-2
                    >
                      <v-combobox
                        v-model="currentPredefinedSettings.headers['Output-Fields'].minus"
                        chips
                        clearable
                        :label="$t('ui.pages.process.settings.remove')"
                        multiple
                        append-icon=""
                      >
                        <template
                          slot="selection"
                          slot-scope="data"
                        >
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

                    <v-flex
                      xs12
                      sm12
                    >
                      <v-combobox
                        v-model="currentPredefinedSettings.headers['Crypted-Fields']"
                        chips
                        clearable
                        :label="$t('ui.pages.process.settings.cryptedFields')"
                        multiple
                        append-icon=""
                      >
                        <template
                          slot="selection"
                          slot-scope="data"
                        >
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

                    <v-flex
                      xs12
                      sm12
                      mt-3
                    >
                      {{ $t('ui.pages.process.settings.counterReportDetail') }}
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>

            <v-expansion-panel-content
              v-if="currentPredefinedSettings"
              class="teal white--text"
            >
              <div slot="header">
                Headers ({{ $t('ui.pages.process.settings.advancedHeaders') }})
              </div>
              <v-card>
                <v-card-text>
                  <v-layout
                    row
                    wrap
                  >
                    <v-flex
                      xs12
                      sm12
                    >
                      <v-autocomplete
                        v-model="header"
                        :items="headers"
                        item-text="name"
                        item-value="name"
                        box
                        label="Headers"
                        append-icon="mdi-chevron-down"
                        @change="addHeader(header)"
                      />
                    </v-flex>

                    <v-flex
                      v-for="(header, key) in currentPredefinedSettings.headers.advancedHeaders"
                      :key="key"
                      xs12
                      sm12
                    >
                      <v-layout
                        row
                        wrap
                      >
                        <v-flex
                          xs2
                          sm2
                          pr-2
                        >
                          <v-text-field
                            v-model="header.header"
                            :value="header.header"
                            prepend-icon="mdi-information"
                            @click:prepend="informations(header.header)"
                          />
                        </v-flex>
                        <v-flex
                          xs10
                          sm10
                        >
                          <v-text-field
                            v-model="header.value"
                            :value="header.value"
                            append-outer-icon="mdi-close-circle"
                            @click:append-outer="removeHeader(key)"
                          />
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-flex>

        <v-flex
          xs12
          sm12
          class="text-xs-center"
        >
          <ButtonGroup>
            <v-btn
              color="success"
              block
              large
              :disabled="disabledButton"
              @click="modal = true"
            >
              <v-icon left>
                mdi-content-save-settings
              </v-icon>
              {{ $t('ui.pages.process.settings.savePredefinedSettings') }}
            </v-btn>
            <v-btn
              color="primary"
              block
              large
              :disabled="disabledButton"
              @click="resetSettings"
            >
              {{ $t('ui.pages.process.settings.defaultParams') }}
              <v-icon right>
                mdi-reload
              </v-icon>
            </v-btn>
          </ButtonGroup>
        </v-flex>
      </v-layout>
    </v-card-text>

    <v-dialog
      v-model="modal"
      max-width="600"
    >
      <v-card>
        <v-card-title class="headline">
          {{ $t('ui.pages.process.settings.savePredefinedSettings') }} :
          {{ currentPredefinedSettings.fullName }}
        </v-card-title>
        <v-card-text>
          <v-switch
            v-if="currentPredefinedSettings._id"
            v-model="saveAsNew"
            :label="$t('ui.pages.process.settings.saveAsNew')"
          />
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex
                xs12
                sm12
              >
                <v-text-field
                  v-model="saveFields.fullName"
                  :label="$t('ui.name')"
                  box
                  name="fullName"
                  required
                  :error="fullNameError ? true : false"
                  :error-messages="fullNameError"
                />
              </v-flex>
              <v-flex
                xs12
                sm12
              >
                <v-autocomplete
                  v-model="saveFields.country"
                  :items="countries"
                  item-value="en"
                  :item-text="$i18n.locale"
                  :label="$t('ui.country')"
                  :return-object="true"
                  box
                  name="country"
                  required
                >
                  <template
                    slot="item"
                    slot-scope="data"
                  >
                    <v-list-tile-content>
                      <v-list-tile-title v-html="data.item[$i18n.locale]" />
                    </v-list-tile-content>
                  </template>
                </v-autocomplete>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="error"
            @click="modal = false"
          >
            {{ $t('ui.close') }}
          </v-btn>
          <v-btn
            color="success"
            :disabled="disabledButtonSave"
            @click="saveCustomSettings"
          >
            {{ $t('ui.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
import ButtonGroup from '~/components/ButtonGroup';
import isEqual from 'lodash.isequal';

export default {
  components: {
    ButtonGroup
  },
  data () {
    return {
      disabledButton: true,
      disabledButtonSave: true,
      displayCustomPredefinedSettings: false,
      modal: false,
      fullNameError: null,
      saveFields: {
        fullName: '',
        country: ''
      },
      saveAsNew: false,
      logTypes: [
        { value: '', text: 'Auto recognition' },
        { value: 'ezproxy', text: 'EZproxy' },
        { value: 'apache', text: 'Apache' },
        { value: 'squid', text: 'Squid' }
      ],
      counterFormats: [
        { value: 'csv', text: 'CSV' },
        { value: 'tsv', text: 'TSV' },
        { value: 'json', text: 'JSON' }
      ],
      tracesLevel: [
        { value: 'info', text: 'General informations' },
        { value: 'error', text: 'Errors only' },
        { value: 'warn', text: 'Warnings without consequences' }
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
    };
  },
  computed: {
    currentPredefinedSettings: {
      get () { return this.$store.state.process.currentPredefinedSettings; },
      set (newVal) { this.$store.dispatch('process/SET_CURRENT_PREDEFINED_SETTINGS', JSON.parse(JSON.stringify(newVal || this.predefinedSettings[1]))); }
    },
    predefinedSettings () {
      return this.$store.state.process.predefinedSettings;
    },
    allPredefinedSettings: {
      get () { return this.$store.state.process.allPredefinedSettings; }
    },
    customPredefinedSettings: {
      get () { return this.$store.state.process.customPredefinedSettings; }
    },
    settingsIsModified: {
      get () { return this.$store.state.process.settingsIsModified; },
      set (newVal) { return this.$store.dispatch('process/SET_SETTINGS_IS_MODIFIED', newVal); }
    },
    countries () {
      return this.$store.state.process.countries;
    }
  },
  watch: {
    currentPredefinedSettings: {
      handler (newVal) {
        let changed;

        changed = this.predefinedSettings.find(p => p.fullName === newVal.fullName);
        if (!changed) {
          changed = this.customPredefinedSettings.find(p => p.fullName === newVal.fullName);
        }
        this.disabledButton = !!isEqual(changed, this.currentPredefinedSettings);
        if (!this.disabledButton) this.settingsIsModified = true;
        this.saveFields.fullName = this.currentPredefinedSettings.fullName;
        this.saveFields.country = this.countries.find(country => country.en === this.currentPredefinedSettings.country) || '';
      },
      deep: true
    },
    saveFields: {
      handler (newVal) {
        const countryTest = this.saveFields.country.en && this.saveFields.country.en.length > 0;
        if (this.saveFields.fullName.length > 0 && countryTest) {
          this.disabledButtonSave = false;
        }

        let exists = this.customPredefinedSettings.find(p => p.fullName === newVal.fullName);
        if (!exists) exists = this.predefinedSettings.find(p => p.fullName === newVal.fullName);
        if (exists && this.saveAsNew) {
          this.disabledButtonSave = true;
          this.fullNameError = this.$t('ui.pages.process.settings.nameUnavailable');
          return false;
        }

        if (exists && this.customPredefinedSettings.length > 0) {
          this.disabledButtonSave = true;
          this.fullNameError = this.$t('ui.pages.process.settings.nameUnavailable');
          return false;
        }

        this.disabledButtonSave = false;
        this.fullNameError = null;
        return true;
      },
      deep: true
    },
    saveAsNew () {
      if (this.saveAsNew) this.saveFields.fullName = '';
      if (!this.saveAsNew) this.saveFields.fullName = this.currentPredefinedSettings.fullName;
    }
  },
  methods: {
    removeOutputPlus (index) {
      this.currentPredefinedSettings.headers['Output-Fields'].plus.splice(index, 1);
    },
    removeOutputMinus (index) {
      this.currentPredefinedSettings.headers['Output-Fields'].minus.splice(index, 1);
    },
    removeCryptedField (value) {
      this.currentPredefinedSettings.headers['Crypted-Fields'].splice(value, 1);
    },
    removeEmail (index) {
      this.currentPredefinedSettings.headers['ezPAARSE-Job-Notifications'].plus.splice(index, 1);
    },
    addHeader (value) {
      if (value) {
        this.currentPredefinedSettings.headers.advancedHeaders.push({ header: value, value: null });
        this.header = null;
      }
    },
    removeHeader (header) {
      this.currentPredefinedSettings.headers.advancedHeaders.splice(header, 1);
    },
    updateCounterFormat () {
      if (this.currentPredefinedSettings.headers['COUNTER-Reports']) this.currentPredefinedSettings.headers['COUNTER-Format'] = 'tsv';
    },
    resetSettings () {
      /* eslint-disable-next-line */
      const currentSettings = this.allPredefinedSettings.find(param => param.fullName === this.currentPredefinedSettings.fullName);
      this.$store.dispatch('process/SET_CURRENT_PREDEFINED_SETTINGS', JSON.parse(JSON.stringify(currentSettings)));
    },
    informations (header) {
      const anchor = this.headers.find(h => header === h.name);
      if (anchor) window.open(`https://ezpaarse.readthedocs.io/en/master/configuration/parametres.html#${anchor.anchor}`, '_blank');
    },
    saveCustomSettings () {
      const customPs = JSON.parse(JSON.stringify(this.currentPredefinedSettings));
      customPs.fullName = this.saveFields.fullName;
      customPs.country = this.saveFields.country.en;

      let store = 'SAVE';
      if (!this.saveAsNew && customPs._id) store = 'UPDATE';
      if (!this.saveAsNew && !customPs._id) store = 'SAVE';
      if (this.saveAsNew && !customPs._id) store = 'SAVE';

      this.$store.dispatch(`process/${store}_CUSTOM_PREDEFINED_SETTINGS`, customPs).then(() => {
        this.$store.dispatch('process/GET_PREDEFINED_SETTINGS').catch(err => {
          let message = this.$t('ui.errors.error');
          if (err.response.data.message) {
            message = this.$t(`ui.errors.${err.response.data.message}`);
          }
          this.$store.dispatch('snacks/info', message);
        });

        this.currentPredefinedSettings = customPs;
        this.modal = false;
        this.disabledButton = true;
        this.disabledButtonSave = true;
        this.saveFields.fullName = '';
        this.saveFields.country = '';
        this.$store.dispatch('snacks/success', this.$t('ui.pages.process.settings.paramsSaved'));
      }).catch(() => this.$store.dispatch('snacks/error', this.$t('ui.errors.error')));
    },
    setCurrentToCustomPredefinedSettings () {
      if (this.displayCustomPredefinedSettings) {
        /* eslint-disable-next-line */
        this.currentPredefinedSettings = this.customPredefinedSettings[1];
      }
    },
    removeCustomPredefinedSettings () {
      this.$store.dispatch('process/REMOVE_CUSTOM_PREDEFINED_SETTINGS', { id: this.currentPredefinedSettings._id })
        .then(() => {
          this.$store.dispatch('snacks/success', this.$t('ui.pages.process.settings.deleted'));
          this.$store.dispatch('process/GET_PREDEFINED_SETTINGS')
            .catch(() => this.$store.dispatch('snacks/error', this.$t('ui.errors.error')));
        }).catch(() => this.$store.dispatch('snacks/error', this.$t('ui.errors.error')));
    },
    predefinedSettingsItems () {
      if (!this.displayCustomPredefinedSettings) return this.allPredefinedSettings;
      return this.customPredefinedSettings;
    },
    haveLogFormat () {
      const logFormat = this.currentPredefinedSettings.headers['Log-Format'];
      return logFormat.value || logFormat.format;
    },
    appendOuterIconCurrentProcess () {
      return (this.currentPredefinedSettings._id && this.$auth.user.group === 'admin') ? 'mdi-delete' : '';
    }
  }
};
</script>

<style>
.mTopM20 {
  margin-top: -20px;
}
</style>
