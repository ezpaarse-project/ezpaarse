<template>
  <v-container fluid grid-list-lg class="pa-2 ma-0">
    <v-layout
      row
      wrap
    >
      <v-flex xs12>
        <v-autocomplete
          v-model="selectedSetting"
          :items="allSettings"
          item-text="fullName"
          item-value="id"
          :label="$t('ui.pages.process.settings.predefinedConfiguration')"
          :append-outer-icon="settingsIcon"
          solo
          clearable
          hide-details
          @click:append-outer="removecustomSettings"
        >
          <template v-slot:item="{ item }">
            <v-list-tile-content>
              <v-list-tile-title v-text="item.fullName" />
              <v-list-tile-sub-title v-text="item.country" />
            </v-list-tile-content>
          </template>
        </v-autocomplete>
      </v-flex>

      <v-flex
        v-if="settings"
        xs12
      >
        <v-card>
          <v-toolbar color="secondary" dark card dense>
            <v-toolbar-title>{{ $t('ui.pages.process.settings.title') }}</v-toolbar-title>
            <v-spacer />
            <v-toolbar-items class="hidden-xs-only">
              <v-btn flat @click="modal = true">{{ $t('ui.save') }}</v-btn>
              <v-btn flat @click="resetSettings">{{ $t('ui.reset') }}</v-btn>
            </v-toolbar-items>

            <v-toolbar-items class="hidden-sm-and-up">
              <v-btn icon flat @click="modal = true"><v-icon>mdi-content-save</v-icon></v-btn>
              <v-btn icon flat @click="resetSettings"><v-icon>mdi-undo-variant</v-icon></v-btn>
            </v-toolbar-items>
          </v-toolbar>

          <v-expansion-panel expand>
            <v-expansion-panel-content>
              <div slot="header">
                {{ $t('ui.pages.process.settings.input') }}
              </div>
              <v-card light>
                <v-card-text>
                  <v-layout row wrap>
                    <v-flex xs4 pr-2>
                      <v-select
                        v-model="settings.logType"
                        :items="logTypes"
                        item-value="value"
                        item-text="text"
                        :label="$t('ui.pages.process.settings.typeOfLog')"
                      />
                    </v-flex>

                    <v-flex xs4>
                      <v-text-field
                        v-model="settings.dateFormat"
                        :label="$t('ui.pages.process.settings.dateFormat')"
                        placeholder="DD/MMM/YYYY:HH:mm:ss Z"
                        required
                      />
                    </v-flex>

                    <v-flex xs4 pl-2>
                      <v-text-field
                        v-model="settings.forceParser"
                        :label="$t('ui.pages.process.settings.defaultParser')"
                        placeholder="dspace"
                        required
                      />
                    </v-flex>

                    <v-flex
                      v-if="haveLogFormat"
                      xs12
                    >
                      <v-text-field
                        v-model="settings.logFormat"
                        :label="$t('ui.pages.process.settings.logFormat')"
                        :value="settings.logFormat"
                      />
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>

            <v-expansion-panel-content>
              <div slot="header">
                {{ $t('ui.pages.process.settings.output') }}
              </div>
              <v-card light>
                <v-card-text>
                  <v-layout
                    row
                    wrap
                  >
                    <v-flex
                      xs6
                      pr-2
                    >
                      <v-select
                        v-model="settings.outputFormat"
                        :items="outputFormats"
                        :label="$t('ui.pages.process.settings.outputFormat')"
                      />
                    </v-flex>

                    <v-flex xs6>
                      <v-select
                        v-model="settings.tracesLevel"
                        :items="tracesLevel"
                        :label="$t('ui.pages.process.settings.traceLevel')"
                      />
                    </v-flex>

                    <v-flex xs12>
                      <v-combobox
                        v-model="settings.notifications"
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

                    <v-flex xs12>
                      <v-checkbox
                        v-model="settings.counterReports"
                        :label="$t('ui.pages.process.settings.counterReports')"
                        @change="updateCounterFormat"
                      />
                    </v-flex>

                    <v-flex xs12>
                      <h4>{{ $t('ui.pages.process.settings.outputFields') }} :</h4>
                    </v-flex>
                    <v-flex xs6>
                      <v-combobox
                        v-model="settings.outputFields.plus"
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
                      pl-2
                    >
                      <v-combobox
                        v-model="settings.outputFields.minus"
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

                    <v-flex xs12>
                      <v-combobox
                        v-model="settings.cryptedFields"
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
                      mt-3
                    >
                      {{ $t('ui.pages.process.settings.counterReportDetail') }}
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>

            <v-expansion-panel-content>
              <div slot="header">
                {{ $t('ui.pages.process.settings.advancedHeaders') }}
              </div>
              <v-card light>
                <v-card-text>
                  <v-layout
                    v-for="(header, index) in settings.headers"
                    :key="index"
                    row
                  >
                    <v-flex xs6 md4>
                      <v-combobox
                        v-model="header.name"
                        :items="headers"
                        item-text="name"
                        item-value="name"
                        :label="$t('ui.name')"
                        hide-details
                        solo
                      >
                        <template slot="item" slot-scope="{ item }">
                          <v-list-tile-content>
                            {{ item.name }}
                          </v-list-tile-content>
                          <v-spacer />
                          <v-list-tile-action @click.stop>
                            <v-btn
                              icon
                              :href="`https://ezpaarse.readthedocs.io/en/master/configuration/parametres.html#${item.anchor}`"
                              target="_blank"
                            >
                              <v-icon color="accent">mdi-information</v-icon>
                            </v-btn>
                          </v-list-tile-action>
                        </template>
                      </v-combobox>
                    </v-flex>
                    <v-flex grow>
                      <v-text-field
                        v-model="header.value"
                        :value="header.value"
                        append-outer-icon="mdi-close-circle"
                        :label="$t('ui.value')"
                        hide-details
                        solo
                        @click:append-outer="removeHeader(index)"
                      />
                    </v-flex>
                  </v-layout>

                  <div class="text-xs-center">
                    <v-btn color="accent" @click="addHeader">
                      <v-icon left>mdi-plus</v-icon> {{ $t('ui.add') }}
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-card>
      </v-flex>
    </v-layout>

    <v-dialog
      v-model="modal"
      max-width="600"
    >
      <v-card>
        <v-card-title class="headline">
          {{ $t('ui.pages.process.settings.savePredefinedSettings') }} :
          {{ settings.fullName }}
        </v-card-title>
        <v-card-text>
          <v-switch
            v-if="settings._id"
            v-model="saveAsNew"
            :label="$t('ui.pages.process.settings.saveAsNew')"
          />
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
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
              <v-flex xs12>
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
  </v-container>
</template>

<script>
import isEqual from 'lodash.isequal';

export default {
  data () {
    return {
      disabledButton: true,
      disabledButtonSave: true,
      displaycustomSettings: false,
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
      outputFormats: [
        { value: 'text/csv', text: 'CSV' },
        { value: 'text/tab-separated-values', text: 'TSV' },
        { value: 'application/json', text: 'JSON' }
      ],
      tracesLevel: [
        { value: 'info', text: 'General informations' },
        { value: 'error', text: 'Errors only' },
        { value: 'warn', text: 'Warnings without consequences' }
      ],
      selectedHeader: null,
      headers: [
        { header: 'Encodage' },
        { name: 'Response-Encoding', anchor: 'response-encoding' },
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
    selectedSetting: {
      get () { return this.$store.state.settings.selectedSetting; },
      set (key) {
        if (key) {
          this.$store.dispatch('settings/APPLY_PREDEFINED_SETTINGS', key);
        } else {
          this.$store.dispatch('settings/RESET_SETTINGS');
        }
      }
    },
    settings () { return this.$store.state.settings.settings; },
    predefinedSettings () { return this.$store.state.settings.predefinedSettings || []; },
    customSettings () { return this.$store.state.settings.customSettings || []; },
    countries () { return this.$store.state.settings.countries; },
    settingsIsModified: {
      get () { return this.$store.state.settings.settingsIsModified; },
      set (newVal) { return this.$store.dispatch('settings/SET_SETTINGS_IS_MODIFIED', newVal); }
    },
    allSettings () {
      let items = [
        { header: this.$t('ui.pages.process.settings.customSettings') },
        ...this.customSettings
      ];

      if (!this.displaycustomSettings) {
        items = items.concat([
          { divider: true },
          { header: this.$t('ui.pages.process.settings.predefinedSettings') },
          ...this.predefinedSettings
        ]);
      }

      return items;
    },
    haveLogFormat () {
      return this.settings.logFormat || this.settings.logType;
    },
    settingsIcon () {
      if (this.settings && this.settings._id && this.$auth.user.group === 'admin') {
        return 'mdi-delete';
      }
      return null;
    }
  },
  watch: {
    // settings: {
    //   handler (newVal) {
    //     let changed;

    //     changed = this.predefinedSettings.find(p => p.fullName === newVal.fullName);
    //     if (!changed) {
    //       changed = this.customSettings.find(p => p.fullName === newVal.fullName);
    //     }
    //     this.disabledButton = !!isEqual(changed, this.settings);
    //     if (!this.disabledButton) this.settingsIsModified = true;
    //     this.saveFields.fullName = this.settings.fullName;
    //     this.saveFields.country = this.countries.find(country => country.en === this.settings.country) || '';
    //   },
    //   deep: true
    // },
    // saveFields: {
    //   handler (newVal) {
    //     const countryTest = this.saveFields.country.en && this.saveFields.country.en.length > 0;
    //     if (this.saveFields.fullName.length > 0 && countryTest) {
    //       this.disabledButtonSave = false;
    //     }

    //     let exists = this.customSettings.find(p => p.fullName === newVal.fullName);
    //     if (!exists) exists = this.predefinedSettings.find(p => p.fullName === newVal.fullName);
    //     if (exists && this.saveAsNew) {
    //       this.disabledButtonSave = true;
    //       this.fullNameError = this.$t('ui.pages.process.settings.nameUnavailable');
    //       return false;
    //     }

    //     if (exists && this.customSettings.length > 0 && !this.settings._id) {
    //       this.disabledButtonSave = true;
    //       this.fullNameError = this.$t('ui.pages.process.settings.nameUnavailable');
    //       return false;
    //     }

    //     this.disabledButtonSave = false;
    //     this.fullNameError = null;
    //     return true;
    //   },
    //   deep: true
    // },
    saveAsNew () {
      if (this.saveAsNew) this.saveFields.fullName = '';
      if (!this.saveAsNew) this.saveFields.fullName = this.settings.fullName;
    }
  },
  methods: {
    removeOutputPlus (index) {
      this.settings.outputFields.plus.splice(index, 1);
    },
    removeOutputMinus (index) {
      this.settings.outputFields.minus.splice(index, 1);
    },
    removeCryptedField (value) {
      this.settings.cryptedFields.splice(value, 1);
    },
    removeEmail (index) {
      this.settings.notifications.splice(index, 1);
    },
    addHeader (value) {
      if (value) {
        this.settings.headers.push({ header: value, value: null });
      }
      this.selectedHeader = null;
    },
    removeHeader (index) {
      this.settings.headers.splice(index, 1);
    },
    updateCounterFormat () {
      if (this.settings.counterReports) { this.settings.counterFormat = 'tsv'; }
    },
    resetSettings () {
      this.$store.dispatch('settings/RESET_SETTINGS');
    },
    informations (header) {
      let head = header.charAt(0).toUpperCase() + header.slice(1);
      const match = /^Log-Format-(ezproxy|squid|apache)$/i.exec(head);
      if (match !== null) {
        head = 'Log-Format-xxx';
      }
      const anchor = this.headers.find(h => head === h.name);
      if (anchor) window.open(`https://doc.ezpaarse.org/en/master/configuration/parametres.html#${anchor.anchor}`, '_blank');
    },

    async saveCustomSettings () {
      const customPs = JSON.parse(JSON.stringify(this.settings));
      customPs.fullName = this.saveFields.fullName;
      customPs.country = this.saveFields.country.en;

      let saveAction = (!this.saveAsNew && customPs._id) ? 'UPDATE' : 'SAVE';

      try {
        await this.$store.dispatch(`process/${saveAction}_CUSTOM_PREDEFINED_SETTINGS`, customPs);
      } catch ({ response }) {
        const status = (response && response.status) || 500;
        this.$store.dispatch('snacks/error', `E${status} - ${this.$t('ui.errors.errorSavePredefinedSettings')}`);
        return;
      }

      try {
        await this.$store.dispatch('settings/GET_PREDEFINED_SETTINGS');
      } catch ({ response }) {
        const status = (response && response.status) || 500;
        const message = (response && response.data && response.data.message) || this.$t('ui.errors.cannotLoadPredefinedSettings');
        this.$store.dispatch('snacks/error', `E${status} - ${message}`);
        return;
      }

      // this.settings = customPs;
      this.modal = false;
      this.disabledButton = true;
      this.disabledButtonSave = true;
      this.saveFields.fullName = '';
      this.saveFields.country = '';
      this.settingsIsModified = false;
      this.$store.dispatch('snacks/success', this.$t('ui.pages.process.settings.paramsSaved'));
    },
    async removecustomSettings () {
      try {
        await this.$store.dispatch('settings/REMOVE_CUSTOM_PREDEFINED_SETTINGS', { id: this.settings._id })
      } catch ({ response }) {
        const status = (response && response.status) || 500;
        this.$store.dispatch('snacks/error', `E${status} - ${this.$t('ui.errors.cannotRemovePredefinedSettings')}`);
      }

      this.$store.dispatch('snacks/success', this.$t('ui.pages.process.settings.deleted'));

      try {
        await this.$store.dispatch('settings/GET_PREDEFINED_SETTINGS');
      } catch ({ response }) {
        const status = (response && response.status) || 500;
        this.$store.dispatch('snacks/error', `E${status} - ${this.$t('ui.errors.cannotLoadPredefinedSettings')}`);
      }
    }
  }
};
</script>
