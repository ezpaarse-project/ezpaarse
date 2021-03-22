<template>
  <v-card>
    <v-toolbar class="secondary" dark dense flat>
      <v-toolbar-title v-text="$t('ui.pages.process.settings.designLogFormat')" />

      <v-spacer />

      <v-toolbar-items>
        <v-btn text @click="openSaveDialog" v-text="$t('ui.save')" />
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              :disabled="!logLines"
              :loading="tryingSettings"
              @click="discoverModal = true"
              v-on="on"
            >
              <v-icon>mdi-auto-fix</v-icon>
            </v-btn>
          </template>
          <span v-text="$t('ui.pages.process.logFormat.findForMe')" />
        </v-tooltip>
      </v-toolbar-items>
    </v-toolbar>

    <SettingsSaver ref="settingsSaver" />

    <v-dialog
      v-model="discoverModal"
      :persistent="tryingSettings"
      width="600"
    >
      <v-card>
        <v-toolbar flat dense dark color="primary">
          <v-toolbar-title v-text="$t('ui.pages.process.logFormat.formatDiscovering')" />
        </v-toolbar>

        <v-card-text
          v-if="tryingSettings"
          div
          class="text-center mt-2"
          v-text="$t('ui.pages.process.logFormat.tryingSettings')"
        />

        <v-card-text
          v-else-if="!matchingSettings"
          class="text-center mt-2"
          v-text="$t('ui.pages.process.logFormat.clickToFindOut')"
        />

        <v-card-text
          v-else-if="matchingSettings.length > 0"
          div
          class="text-center mt-2"
          v-text="$t('ui.pages.process.logFormat.foundSettings')"
        />

        <v-card-text
          v-else
          div
          class="text-center mt-2"
          v-text="$t('ui.pages.process.logFormat.noSettingsFound')"
        />

        <v-list v-if="matchingSettings && matchingSettings.length > 0">
          <v-list-item
            v-for="s in matchingSettings"
            :key="s.id"
            :disabled="tryingSettings"
            @click="selectedSetting = s.id; discoverModal = false"
          >
            <v-list-item-content>
              <v-list-item-title v-text="s.fullName" />
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            class="body-2"
            :disabled="tryingSettings"
            @click="discoverModal = false"
            v-text="$t('ui.close')"
          />
          <v-btn
            color="primary"
            class="body-2"
            :disabled="!logLines || tryingSettings"
            :loading="tryingSettings"
            @click="tryPredefinedSettings"
          >
            <v-icon left>
              mdi-auto-fix
            </v-icon>
            {{ $t('ui.pages.process.logFormat.findMyFormat') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card-text>
      <v-form class="mb-3">
        <v-textarea
          v-model="logLines"
          solo
          name="loglines"
          :label="$t('ui.pages.process.logFormat.copyPast')"
          hide-details
          required
          @input="onChange"
        />
      </v-form>

      <v-card class="mb-3">
        <v-container fluid grid-list-lg>
          <v-layout row wrap>
            <v-flex xs12>
              <v-autocomplete
                v-model="selectedSetting"
                :items="allSettings"
                item-text="fullName"
                item-value="id"
                :label="$t('ui.pages.process.settings.predefinedConfiguration')"
                solo
                clearable
                hide-details
              >
                <template v-slot:item="{ item }">
                  <v-list-item-content>
                    <v-list-item-title v-text="item.fullName" />
                    <v-list-item-subtitle>
                      {{ item.country | alphaToName($i18n.locale) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-action-text v-text="item.id" />
                  </v-list-item-action>
                </template>
              </v-autocomplete>
            </v-flex>

            <v-flex xs12 sm6>
              <v-select
                v-model="logType"
                :items="logTypes"
                item-value="value"
                item-text="text"
                :label="$t('ui.pages.process.settings.typeOfLog')"
              />
            </v-flex>

            <v-flex xs12 sm6>
              <v-text-field
                v-model="dateFormat"
                :label="$t('ui.pages.process.settings.dateFormat')"
                placeholder="DD/MMM/YYYY:HH:mm:ss Z"
                required
              />
            </v-flex>

            <v-flex v-if="logType" xs12>
              <v-text-field
                v-model="logFormat"
                :label="$t('ui.pages.process.settings.logFormat')"
                :value="logFormat"
              />
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>

      <v-card>
        <v-toolbar height="8px" :color="cardColor" flat />

        <v-card-title>
          <div>
            <div class="headline">
              {{ $t('ui.pages.process.logFormat.formatAnalysis') }}
              <v-progress-circular
                v-if="loading"
                :size="18"
                :width="2"
                indeterminate
                color="primary"
              />
            </div>
            <div class="subtitle-1">
              {{ $t('ui.pages.process.logFormat.firstLogLine') }}
            </div>
          </div>
        </v-card-title>

        <template v-if="result">
          <v-card-text
            v-if="result.autoDetect && !result.strictMatch"
            class="red--text"
            v-text="$t('ui.pages.process.logFormat.detectionFailed')"
          />

          <v-expansion-panels v-else v-model="expandedPanels" multiple accordion>
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                <div>{{ $t('ui.pages.process.logFormat.format') }} ({{ result.proxy }})</div>
                <template v-slot:actions>
                  <v-icon v-if="result.strictMatch" color="success">
                    mdi-check
                  </v-icon>
                  <v-icon v-else color="error">
                    mdi-alert-circle
                  </v-icon>
                </template>
              </v-expansion-panel-header>

              <v-expansion-panel-content>
                <div v-if="result.format">
                  <span
                    class="green--text"
                    v-text="result.format.substr(0, result.formatBreak)"
                  />
                  <span
                    class="red--text"
                    v-text="result.format.substr(result.formatBreak)"
                  />
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                <div>{{ $t('ui.pages.process.logFormat.regex') }}</div>
                <template v-slot:actions>
                  <v-icon v-if="result.strictMatch" color="success">
                    mdi-check
                  </v-icon>
                  <v-icon v-else color="error">
                    mdi-alert-circle
                  </v-icon>
                </template>
              </v-expansion-panel-header>

              <v-expansion-panel-content>
                <div v-if="result.regexp">
                  <span
                    class="green--text"
                    v-text="result.regexp.substr(0, result.regexpBreak)"
                  />
                  <span
                    class="red--text"
                    v-text="result.regexp.substr(result.regexpBreak)"
                  />
                </div>

                <div v-else v-text="$t('ui.pages.process.logFormat.regexFailed')" />
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                <div>{{ $t('ui.pages.process.logFormat.ecGenerated') }}</div>
                <template v-slot:actions>
                  <v-icon v-if="result.ec && !hasMissingField" color="success">
                    mdi-check
                  </v-icon>
                  <v-icon v-else color="error">
                    mdi-alert-circle
                  </v-icon>
                </template>
              </v-expansion-panel-header>

              <v-expansion-panel-content>
                <v-alert
                  v-for="missing in result.missing"
                  :key="missing"
                  :value="hasMissingField"
                  color="warning"
                  icon="mdi-alert-outline"
                  outlined
                >
                  {{ $t(`ui.pages.process.logFormat.missing.${missing}`) }}
                </v-alert>

                <v-data-table
                  :headers="ecHeaders"
                  hide-default-footer
                  disable-pagination
                  item-key="name"
                  :items="ecProps"
                  class="elevation-1"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </template>
      </v-card>
    </v-card-text>

    <v-card-text class="text-center">
      <v-btn
        large
        color="primary"
        :disabled="!logLines"
        @click="process"
        v-text="$t('ui.pages.process.processlogLines')"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import debounce from 'lodash.debounce';
import i18nIsoCode from 'i18n-iso-countries';
import SettingsSaver from '~/components/SettingsSaver.vue';

export default {
  auth: true,
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
      result: null,
      loading: false,
      expandedPanels: [0],
      matchingSettings: null,
      tryingSettings: false,
      discoverModal: false,
      logTypes: [
        { value: '', text: 'Auto recognition' },
        { value: 'ezproxy', text: 'EZproxy' },
        { value: 'apache', text: 'Apache' },
        { value: 'squid', text: 'Squid' }
      ],
      importSetting: false
    };
  },
  async fetch ({ store }) {
    try {
      await store.dispatch('settings/GET_PREDEFINED_SETTINGS');
    } catch (e) {
      await store.dispatch('snacks/error', 'ui.errors.cannotLoadPredefinedSettings');
    }

    try {
      await store.dispatch('settings/GET_COUNTRIES');
    } catch (e) {
      await store.dispatch('snacks/error', 'ui.errors.cannotGetCountriesList');
    }
  },
  computed: {
    ecHeaders () {
      return [
        { text: this.$t('ui.pages.process.logFormat.property'), value: 'name' },
        { text: this.$t('ui.pages.process.logFormat.value'), value: 'value' }
      ];
    },
    cardColor () {
      if (!this.result) { return 'info'; }
      if (this.result.strictMatch) { return this.hasMissingField ? 'warning' : 'success'; }
      return 'error';
    },
    hasMissingField () {
      return (this.result && Array.isArray(this.result.missing) && this.result.missing.length > 0);
    },
    ecProps () {
      if (!this.result.ec) { return []; }
      return Object.entries(this.result.ec).map(entry => ({ name: entry[0], value: entry[1] }));
    },
    logLines: {
      get () { return this.$store.state.process.logLines; },
      set (newVal) { this.$store.dispatch('process/SET_LOG_LINES', newVal); }
    },
    settings () {
      return this.$store.state.settings.settings || {};
    },
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
    logFormat: {
      get () { return this.settings && this.settings.logFormat; },
      set (value) { this.$store.dispatch('settings/SET_FIELD', { name: 'logFormat', value }); }
    },
    logType: {
      get () { return this.settings && this.settings.logType; },
      set (value) { this.$store.dispatch('settings/SET_FIELD', { name: 'logType', value }); }
    },
    dateFormat: {
      get () { return this.settings && this.settings.dateFormat; },
      set (value) { this.$store.dispatch('settings/SET_FIELD', { name: 'dateFormat', value }); }
    }
  },
  watch: {
    logFormat () { this.onChange(); },
    logType () { this.onChange(); },
    dateFormat () { this.onChange(); }
  },
  methods: {
    openSaveDialog () {
      this.$refs.settingsSaver.open();
    },

    onChange () {
      this.loading = true;
      this.debouncedParsing();
    },

    debouncedParsing: debounce(function debouncedParsing () {
      this.parseFirstLine();
    }, 1000),

    async parseFirstLine () {
      if (!this.logLines) {
        this.loading = false;
        this.result = null;
        return;
      }

      this.loading = true;

      try {
        this.result = await this.$store.dispatch('process/LOG_PARSER', {
          proxy: this.logType,
          format: this.logFormat,
          dateFormat: this.dateFormat,
          logLines: this.logLines
        });
      } catch (e) {
        this.$store.dispatch('snacks/error', 'ui.errors.cannotGetlogFormat');
      }

      this.loading = false;
    },

    async tryPredefinedSettings () {
      if (!this.logLines) { return; }

      this.matchingSettings = [];
      this.discoverModal = true;
      this.tryingSettings = true;

      for (let i = 0; i < this.allSettings.length; i += 1) {
        const setting = this.allSettings[i];
        if (setting && setting.id) {
          // eslint-disable-next-line no-await-in-loop
          await this.$store.dispatch('settings/APPLY_PREDEFINED_SETTINGS', setting.id);
          // eslint-disable-next-line no-await-in-loop
          await this.parseFirstLine();
          if (this.result && this.result.strictMatch) {
            this.matchingSettings.push(setting);
          }
        }
      }

      this.tryingSettings = false;
    },

    process () {
      this.$store.dispatch('process/PROCESS', this.logLines);
      this.$router.push('/process');
    }
  }
};
</script>
