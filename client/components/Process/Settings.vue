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
    >
      <template v-slot:item="{ item }">
        <v-list-item-content>
          <v-list-item-title v-text="item.fullName" />
          <v-list-item-subtitle v-if="item.country">
            {{ item.country | alphaToName($i18n.locale) }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-list-item-action-text v-text="item.id" />
        </v-list-item-action>
      </template>
      <template v-if="settings.id" v-slot:append-outer>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on">
              mdi-dots-vertical
            </v-icon>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-dialog v-model="removeSetting" max-width="600">
                  <template v-slot:activator="{ on }">
                    <v-list-item-title
                      style="cursor: pointer;"
                      v-on="on"
                      v-text="$t('ui.remove')"
                    />
                  </template>
                  <v-card>
                    <v-card-title
                      class="title primary white--text"
                      v-text="$t('ui.pages.process.settings.removeSettingTitle')"
                    />
                    <v-card-text
                      class="text-center py-3"
                      v-text="$t('ui.pages.process.settings.removeSetting')"
                    />
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        text
                        @click="removeSetting = false"
                        v-text="$t('ui.close')"
                      />
                      <v-btn
                        color="red"
                        dark
                        @click="removecustomSettings"
                        v-text="$t('ui.remove')"
                      />
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="downloadPredefinedSettings">
              <v-list-item-content>
                <v-list-item-title style="cursor: pointer;">
                  {{ $t('ui.export') }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-autocomplete>

    <v-card v-if="settings">
      <v-toolbar color="secondary" dark flat dense>
        <v-toolbar-title v-text="$t('ui.pages.process.settings.title')" />
        <v-spacer />
        <v-toolbar-items class="hidden-xs-only">
          <v-btn text @click="openSaveDialog(false)" v-text="$t('ui.save')" />
          <v-btn text @click="resetSettings" v-text="$t('ui.reset')" />
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" @click="openSaveDialog(true)">
                <v-icon>mdi-download</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('ui.pages.process.settings.importPredefinedSettings') }}</span>
          </v-tooltip>
        </v-toolbar-items>

        <v-toolbar-items class="hidden-sm-and-up">
          <v-btn icon text @click="openSaveDialog(false)">
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
          <v-btn icon text @click="resetSettings">
            <v-icon>mdi-undo-variant</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-expansion-panels accordion multiple>
        <v-expansion-panel expand>
          <v-expansion-panel-header v-text="$t('ui.pages.process.settings.input')" />
          <v-expansion-panel-content>
            <v-card flat>
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
                    <v-autocomplete
                      v-model="forceParser"
                      :label="$t('ui.pages.process.settings.defaultParser')"
                      :items="platforms"
                      item-text="longname"
                      item-value="name"
                      placeholder="dspace"
                      clearable
                      required
                    />
                  </v-flex>

                  <v-flex v-if="haveLogFormat" xs12>
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
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header v-text="$t('ui.pages.process.settings.output')" />
          <v-expansion-panel-content>
            <v-card flat>
              <v-card-text>
                <v-layout row wrap>
                  <v-flex xs6 pr-2>
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
                      <template v-slot:selection="{ item, parent }">
                        <v-chip label small>
                          <span class="pr-2" v-text="item" />
                          <v-icon small @click="parent.selectItem(item)">
                            mdi-close
                          </v-icon>
                        </v-chip>
                      </template>
                    </v-combobox>
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
                      <template v-slot:selection="{ item, parent }">
                        <v-chip label small>
                          <span class="pr-2" v-text="item" />
                          <v-icon small @click="parent.selectItem(item)">
                            mdi-close
                          </v-icon>
                        </v-chip>
                      </template>
                    </v-combobox>
                  </v-flex>

                  <v-flex xs6 pl-2>
                    <v-combobox
                      v-model="removedFields"
                      chips
                      clearable
                      :label="$t('ui.pages.process.settings.remove')"
                      multiple
                      append-icon=""
                    >
                      <template v-slot:selection="{ item, parent }">
                        <v-chip label small>
                          <span class="pr-2">{{ item }}</span>
                          <v-icon small @click="parent.selectItem(item)">
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
                      <template v-slot:selection="{ item, parent }">
                        <v-chip label small>
                          <span class="pr-2" v-text="item" />
                          <v-icon small @click="parent.selectItem(item)">
                            mdi-close
                          </v-icon>
                        </v-chip>
                      </template>
                    </v-combobox>
                  </v-flex>

                  <v-flex xs12>
                    <v-autocomplete
                      v-model="filterPlatforms"
                      :label="$t('ui.pages.process.settings.filterPlatforms')"
                      :items="platforms"
                      item-text="longname"
                      item-value="name"
                      append-icon=""
                      multiple
                      chips
                      deletable-chips
                      small-chips
                      clearable
                    >
                      <template v-slot:selection="{ item, parent }">
                        <v-chip label small>
                          <span class="pr-2" v-text="item.longname" />
                          <v-icon small @click="parent.selectItem(item)">
                            mdi-close
                          </v-icon>
                        </v-chip>
                      </template>
                    </v-autocomplete>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header v-text="$t('ui.pages.process.settings.advancedHeaders')" />
          <v-expansion-panel-content>
            <v-card flat>
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
                      name="headers"
                      item-text="name"
                      item-value="name"
                      :label="$t('ui.name')"
                      hide-details
                      solo
                      @input="value => updateHeaderName(index, value)"
                    >
                      <template v-slot:item="{ item }">
                        <v-list-item-content v-text="item.name" />
                        <v-spacer />
                        <v-list-item-action v-if="item.anchor" @click.stop>
                          <v-btn
                            icon
                            :href="`https://ezpaarse-project.github.io/ezpaarse/configuration/parametres.html#${item.anchor}`"
                            target="_blank"
                          >
                            <v-icon color="accent">
                              mdi-information
                            </v-icon>
                          </v-btn>
                        </v-list-item-action>

                        <v-list-item-action v-if="item.middleware" @click.stop>
                          <v-btn
                            icon
                            :href="`https://ezpaarse-project.github.io/ezpaarse/middlewares/${item.middleware}/README.html`"
                            target="_blank"
                          >
                            <v-icon color="accent">
                              mdi-information
                            </v-icon>
                          </v-btn>
                        </v-list-item-action>
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
                      clearable
                      @click:append-outer="removeHeader(index)"
                      @input="value => updateHeaderValue(index, value)"
                    />
                  </v-flex>
                </v-layout>

                <div class="text-center mt-3">
                  <v-btn color="accent" @click="addHeader">
                    <v-icon left>
                      mdi-plus
                    </v-icon>
                    <span v-text="$t('ui.add')" />
                  </v-btn>
                </div>
              </v-container>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header v-text="$t('ui.pages.process.settings.middlewares')" />
          <v-expansion-panel-content>
            <v-card flat>
              <Middlewares
                v-model="additionalsMiddlewares"
                :available="middlewares.available"
                hide-reset-button
              />
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>

    <SettingsSaver ref="settingsSaver" />
  </v-layout>
</template>

<script>
import i18nIsoCode from 'i18n-iso-countries';
import { saveAs } from 'file-saver';
import SettingsSaver from '~/components/SettingsSaver.vue';
import Middlewares from '~/components/Middlewares.vue';

export default {
  props: {
    middlewares: {
      type: Object,
      default: () => ({})
    },
    middlewaresHeaders: {
      type: Array,
      default: () => ([])
    },
    platforms: {
      type: Array,
      default: () => ([])
    }
  },
  components: {
    SettingsSaver,
    Middlewares
  },
  filters: {
    alphaToName (alpha, locale) {
      return i18nIsoCode.getName(alpha, locale) || alpha;
    }
  },
  data () {
    return {
      removeSetting: false,
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
    filterPlatforms: {
      get () { return this.settings.filterPlatforms; },
      set (value) { this.$store.dispatch('settings/SET_FIELD', { name: 'filterPlatforms', value }); }
    },
    additionalsMiddlewares: {
      get () { return this.settings.additionalsMiddlewares; },
      set (value) { this.$store.dispatch('settings/SET_FIELD', { name: 'additionalsMiddlewares', value }); }
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
    dark () { return this.$vuetify.theme.dark; },
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
      const headers = [
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
        { header: this.$t('ui.pages.process.settings.headers.other') },
        { name: 'Traces-Level', anchor: 'traces-level' },
        { name: 'Reject-Files', anchor: 'reject-files' },
        { name: 'Clean-Only', anchor: 'clean-only' },
        { name: 'Force-Parser', anchor: 'force-parser' },
        { name: 'Geoip', anchor: 'geoip' },
        { name: 'ezPAARSE-Job-Notifications', anchor: 'ezpaarse-job-notifications' },
        { name: 'ezPAARSE-Predefined-Settings', anchor: 'ezpaarse-predefined-settings' },
        { name: 'ezPAARSE-Filter-Redirects', anchor: 'ezpaarse-filter-redirects' },
        { name: 'ezPAARSE-Filter-Status', anchor: 'ezpaarse-filter-status' },
        { name: 'Disable-Filters', anchor: 'disable-filters' },
        { name: 'Force-ECField-Publisher', anchor: 'force-ecfield-publisher' },
        { name: 'Extract', anchor: 'extract' },
        { name: 'ezPAARSE-Middlewares', anchor: 'ezpaarse-middlewares' }
      ];

      this.middlewaresHeaders.filter((middleware) => {
        if (this.middlewares.enabled.includes(middleware.name)) { return true; }
        if (this.additionalsMiddlewares.includes(middleware.name)) { return true; }
        return false;
      }).forEach((middleware) => {
        if (middleware.headers.length) {
          headers.push({ divider: true });
          headers.push({ header: middleware.name });

          middleware.headers.forEach((header) => {
            headers.push({
              name: header.name,
              middleware: middleware.name
            });
          });
        }
      });

      return headers;
    }
  },
  methods: {
    openSaveDialog (allowImport) {
      this.$refs.settingsSaver.open({ allowImport });
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
      this.removeSetting = false;
    },
    downloadPredefinedSettings () {
      const setting = this.allSettings.find(s => s.id === this.selectedSetting);
      if (setting) {
        const selectedSetting = JSON.parse(JSON.stringify(setting));
        delete selectedSetting['_id'];
        saveAs(new Blob([JSON.stringify(selectedSetting, null, 2)], { type: 'application/json;charset=utf-8' }), `${this.selectedSetting}.json`);
      }
      this.selectedSetting = '';
    }
  }
};
</script>
