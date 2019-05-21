<template>
  <v-layout column>
    <v-autocomplete
      v-model="selectedSetting"
      :items="allSettings"
      item-text="fullName"
      item-value="id"
      :label="$t('ui.pages.process.settings.predefinedConfiguration')"
      :append-outer-icon="settingsIcon"
      class="mb-3"
      solo
      clearable
      hide-details
      @click:append-outer="removecustomSettings"
    >
      <template v-slot:item="{ item }">
        <v-list-tile-content>
          <v-list-tile-title v-text="item.fullName" />
          <v-list-tile-sub-title v-if="item.country">
            {{ item.country | alphaToName($i18n.locale) }}
          </v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-list-tile-action-text>{{ item.id }}</v-list-tile-action-text>
        </v-list-tile-action>
      </template>
    </v-autocomplete>

    <v-card v-if="settings">
      <v-toolbar color="secondary" dark card dense>
        <v-toolbar-title>{{ $t('ui.pages.process.settings.title') }}</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items class="hidden-xs-only">
          <v-btn flat @click="openSaveDialog">
            {{ $t('ui.save') }}
          </v-btn>
          <v-btn flat @click="resetSettings">
            {{ $t('ui.reset') }}
          </v-btn>
        </v-toolbar-items>

        <v-toolbar-items class="hidden-sm-and-up">
          <v-btn icon flat @click="openSaveDialog">
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
          <v-btn icon flat @click="resetSettings">
            <v-icon>mdi-undo-variant</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-expansion-panel expand>
        <v-expansion-panel-content>
          <template v-slot:header>
            <div>{{ $t('ui.pages.process.settings.input') }}</div>
          </template>
          <v-card light>
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs4 pr-2>
                  <v-select
                    v-model="logType"
                    :items="logTypes"
                    item-value="value"
                    item-text="text"
                    :label="$t('ui.pages.process.settings.typeOfLog')"
                  />
                </v-flex>

                <v-flex xs4>
                  <v-text-field
                    v-model="dateFormat"
                    :label="$t('ui.pages.process.settings.dateFormat')"
                    placeholder="DD/MMM/YYYY:HH:mm:ss Z"
                    required
                  />
                </v-flex>

                <v-flex xs4 pl-2>
                  <v-text-field
                    v-model="forceParser"
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
                    v-model="logFormat"
                    :label="$t('ui.pages.process.settings.logFormat')"
                    :value="logFormat"
                  />
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>

        <v-expansion-panel-content>
          <template v-slot:header>
            <div>{{ $t('ui.pages.process.settings.output') }}</div>
          </template>
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
                    v-model="outputFormat"
                    :items="outputFormats"
                    :label="$t('ui.pages.process.settings.outputFormat')"
                  />
                </v-flex>

                <v-flex xs6>
                  <v-select
                    v-model="tracesLevel"
                    :items="tracesLevels"
                    :label="$t('ui.pages.process.settings.traceLevel')"
                  />
                </v-flex>

                <v-flex xs12>
                  <v-combobox
                    v-model="notificationMails"
                    :label="$t('ui.pages.process.settings.notificationsEmails')"
                    chips
                    clearable
                    multiple
                  >
                    <template v-slot:selection="{ item, parent, selected }">
                      <v-chip
                        :selected="selected"
                        label
                        small
                      >
                        <span class="pr-2">{{ item }}</span>
                        <v-icon
                          small
                          @click="parent.selectItem(item)"
                        >
                          mdi-close
                        </v-icon>
                      </v-chip>
                    </template>
                  </v-combobox>
                </v-flex>

                <v-flex xs12>
                  <v-checkbox
                    v-model="counterReports"
                    value="jr1"
                    :label="$t('ui.pages.process.settings.counterReports')"
                  />
                </v-flex>

                <v-flex xs12>
                  <h4>{{ $t('ui.pages.process.settings.outputFields') }} :</h4>
                </v-flex>
                <v-flex xs6>
                  <v-combobox
                    v-model="addedFields"
                    :label="$t('ui.pages.process.settings.add')"
                    chips
                    clearable
                    multiple
                    append-icon=""
                  >
                    <template v-slot:selection="{ item, parent, selected }">
                      <v-chip
                        :selected="selected"
                        label
                        small
                      >
                        <span class="pr-2">{{ item }}</span>
                        <v-icon
                          small
                          @click="parent.selectItem(item)"
                        >
                          mdi-close
                        </v-icon>
                      </v-chip>
                    </template>
                  </v-combobox>
                </v-flex>

                <v-flex
                  xs6
                  pl-2
                >
                  <v-combobox
                    v-model="removedFields"
                    chips
                    clearable
                    :label="$t('ui.pages.process.settings.remove')"
                    multiple
                    append-icon=""
                  >
                    <template v-slot:selection="{ item, parent, selected }">
                      <v-chip
                        :selected="selected"
                        label
                        small
                      >
                        <span class="pr-2">{{ item }}</span>
                        <v-icon
                          small
                          @click="parent.selectItem(item)"
                        >
                          mdi-close
                        </v-icon>
                      </v-chip>
                    </template>
                  </v-combobox>
                </v-flex>

                <v-flex xs12>
                  <v-combobox
                    v-model="cryptedFields"
                    chips
                    clearable
                    :label="$t('ui.pages.process.settings.cryptedFields')"
                    multiple
                    append-icon=""
                  >
                    <template v-slot:selection="{ item, parent, selected }">
                      <v-chip
                        :selected="selected"
                        label
                        small
                      >
                        <span class="pr-2">{{ item }}</span>
                        <v-icon
                          small
                          @click="parent.selectItem(item)"
                        >
                          mdi-close
                        </v-icon>
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
          <template v-slot:header>
            <div>{{ $t('ui.pages.process.settings.advancedHeaders') }}</div>
          </template>
          <v-card light>
            <v-container fluid grid-list-md>
              <v-layout
                v-for="(header, index) in settings.headers"
                :key="index"
                row
              >
                <v-flex xs6 md4>
                  <v-combobox
                    :value="header.name"
                    :return-object="false"
                    :items="headers"
                    item-text="name"
                    item-value="name"
                    :label="$t('ui.name')"
                    hide-details
                    solo
                    @input="value => updateHeaderName(index, value)"
                  >
                    <template v-slot:item="{ item }">
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
                          <v-icon color="accent">
                            mdi-information
                          </v-icon>
                        </v-btn>
                      </v-list-tile-action>
                    </template>
                  </v-combobox>
                </v-flex>
                <v-flex grow>
                  <v-text-field
                    :value="header.value"
                    append-outer-icon="mdi-close-circle"
                    :label="$t('ui.value')"
                    hide-details
                    solo
                    @click:append-outer="removeHeader(index)"
                    @input="value => updateHeaderValue(index, value)"
                  />
                </v-flex>
              </v-layout>

              <div class="text-xs-center">
                <v-btn color="accent" @click="addHeader">
                  <v-icon left>
                    mdi-plus
                  </v-icon>
                  {{ $t('ui.add') }}
                </v-btn>
              </div>
            </v-container>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-card>

    <SettingsSaver :visible.sync="saveDialog" />
  </v-layout>
</template>

<script>
import i18nIsoCode from 'i18n-iso-countries';
import SettingsSaver from '~/components/SettingsSaver';

export default {
  components: {
    SettingsSaver
  },
  filters: {
    alphaToName (alpha, locale) {
      return i18nIsoCode.getName(alpha, locale) || alpha;
    }
  },
  data () {
    return {
      saveDialog: false,
      outputFormats: [
        { value: 'text/csv', text: 'CSV' },
        { value: 'text/tab-separated-values', text: 'TSV' },
        { value: 'application/json', text: 'JSON' }
      ]
    };
  },
  computed: {
    logType: {
      get () { return this.settings.logType; },
      set (value) { this.$store.dispatch('settings/SET_FIELD', { name: 'logType', value }); }
    },
    dateFormat: {
      get () { return this.settings.dateFormat; },
      set (value) { this.$store.dispatch('settings/SET_FIELD', { name: 'dateFormat', value }); }
    },
    forceParser: {
      get () { return this.settings.forceParser; },
      set (value) { this.$store.dispatch('settings/SET_FIELD', { name: 'forceParser', value }); }
    },
    logFormat: {
      get () { return this.settings.logFormat; },
      set (value) { this.$store.dispatch('settings/SET_FIELD', { name: 'logFormat', value }); }
    },
    outputFormat: {
      get () { return this.settings.outputFormat; },
      set (value) { this.$store.dispatch('settings/SET_FIELD', { name: 'outputFormat', value }); }
    },
    tracesLevel: {
      get () { return this.settings.tracesLevel; },
      set (value) { this.$store.dispatch('settings/SET_FIELD', { name: 'tracesLevel', value }); }
    },
    notificationMails: {
      get () { return this.settings.notificationMails; },
      set (value) { this.$store.dispatch('settings/SET_FIELD', { name: 'notificationMails', value }); }
    },
    counterReports: {
      get () { return this.settings.counterReports; },
      set (value) { this.$store.dispatch('settings/SET_FIELD', { name: 'counterReports', value }); }
    },
    addedFields: {
      get () { return this.settings.addedFields; },
      set (value) { this.$store.dispatch('settings/SET_FIELD', { name: 'addedFields', value }); }
    },
    removedFields: {
      get () { return this.settings.removedFields; },
      set (value) { this.$store.dispatch('settings/SET_FIELD', { name: 'removedFields', value }); }
    },
    cryptedFields: {
      get () { return this.settings.cryptedFields; },
      set (value) { this.$store.dispatch('settings/SET_FIELD', { name: 'cryptedFields', value }); }
    },
    selectedSetting: {
      get () { return this.settings.id; },
      set (key) {
        if (key) {
          this.$store.dispatch('settings/APPLY_PREDEFINED_SETTINGS', key);
        } else {
          this.$store.dispatch('settings/RESET_SETTINGS');
        }
      }
    },
    settings () { return this.$store.state.settings.settings || {}; },
    predefinedSettings () { return this.$store.state.settings.predefinedSettings || []; },
    customSettings () { return this.$store.state.settings.customSettings || []; },
    allSettings () {
      return [
        { header: this.$t('ui.pages.process.settings.customSettings') },
        ...this.customSettings,
        { divider: true },
        { header: this.$t('ui.pages.process.settings.predefinedSettings') },
        ...this.predefinedSettings
      ];
    },
    haveLogFormat () {
      return this.logFormat || this.logType;
    },
    settingsIcon () {
      if (this.selectedSetting && !this.settings.predefined && this.$auth.user.group === 'admin') {
        return 'mdi-delete';
      }
      return null;
    },
    logTypes () {
      return [
        { value: '', text: this.$t('ui.pages.process.settings.autoRecognition') },
        { value: 'ezproxy', text: 'EZproxy' },
        { value: 'apache', text: 'Apache' },
        { value: 'squid', text: 'Squid' }
      ];
    },
    tracesLevels () {
      return [
        { value: 'info', text: this.$t('ui.pages.process.settings.tracesLevel.generalInformations') },
        { value: 'error', text: this.$t('ui.pages.process.settings.tracesLevel.errorsOnly') },
        { value: 'warn', text: this.$t('ui.pages.process.settings.tracesLevel.warning') }
      ];
    },
    headers () {
      return [
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
        { header: this.$t('ui.pages.process.settings.headers.deduplication') },
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
        { header: this.$t('ui.pages.process.settings.headers.anonymization') },
        { name: 'Crypted-Fields', anchor: 'crypted-fields' },
        { divider: true },
        { header: this.$t('ui.pages.process.settings.headers.other') },
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
        { header: this.$t('ui.pages.process.settings.headers.metadataEnrichment') },
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
      ];
    }
  },
  methods: {
    openSaveDialog () {
      this.saveDialog = true;
    },
    addHeader () {
      this.$store.dispatch('settings/ADD_HEADER');
    },
    removeHeader (index) {
      this.$store.dispatch('settings/REMOVE_HEADER', index);
    },
    updateHeaderName (index, value) {
      this.$store.dispatch('settings/SET_HEADER_NAME', { index, value });
    },
    updateHeaderValue (index, value) {
      this.$store.dispatch('settings/SET_HEADER_VALUE', { index, value });
    },
    resetSettings () {
      this.$store.dispatch('settings/RESET_SETTINGS');
    },
    async removecustomSettings () {
      try {
        await this.$store.dispatch('settings/REMOVE_CUSTOM_PREDEFINED_SETTINGS', this.settings.id);
        this.$store.dispatch('snacks/success', 'ui.pages.process.settings.deleted');
      } catch (err) {
        this.$store.dispatch('snacks/error', 'ui.errors.cannotRemovePredefinedSettings');
      }
    }
  }
};
</script>
