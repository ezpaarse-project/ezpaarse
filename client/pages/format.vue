<template>
  <v-card>
    <v-toolbar
      class="secondary"
      dark
      dense
      card
    >
      <v-toolbar-title>{{ $t('ui.pages.process.settings.designLogFormat') }}</v-toolbar-title>
    </v-toolbar>

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
            <v-flex xs6>
              <v-select
                v-model="settings.logType"
                :items="logTypes"
                item-value="value"
                item-text="text"
                :label="$t('ui.pages.process.settings.typeOfLog')"
              />
            </v-flex>

            <v-flex xs6>
              <v-text-field
                v-model="settings.dateFormat"
                :label="$t('ui.pages.process.settings.dateFormat')"
                placeholder="DD/MMM/YYYY:HH:mm:ss Z"
                required
              />
            </v-flex>

            <v-flex
              v-if="settings.logType"
              xs12
            >
              <v-text-field
                v-model="settings.logFormat"
                :label="$t('ui.pages.process.settings.logFormat')"
                :value="settings.logFormat"
              />
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>

      <v-card>
        <v-toolbar
          card
          height="8px"
          :color="cardColor"
        />

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
            <div class="subheading">
              {{ $t('ui.pages.process.logFormat.firstLogLine') }}
            </div>
          </div>
        </v-card-title>

        <template v-if="result">
          <v-card-text v-if="result.autoDetect && !result.strictMatch" class="red--text">
            {{ $t('ui.pages.process.logFormat.detectionFailed') }}
          </v-card-text>

          <v-expansion-panel v-else v-model="expandedPanels" expand>
            <v-expansion-panel-content>
              <div slot="header">
                {{ $t('ui.pages.process.logFormat.format') }} ({{ result.proxy }})
              </div>
              <template slot="actions">
                <v-icon v-if="result.strictMatch" color="success">
                  mdi-check
                </v-icon>
                <v-icon v-else color="error">
                  mdi-alert-circle
                </v-icon>
              </template>
              <v-card>
                <v-card-text>
                  <div v-if="result.format">
                    <span class="green--text">{{ result.format.substr(0, result.formatBreak) }}</span><span class="red--text">{{ result.format.substr(result.formatBreak) }}</span>
                  </div>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>

            <v-expansion-panel-content>
              <div slot="header">
                {{ $t('ui.pages.process.logFormat.regex') }}
              </div>
              <template slot="actions">
                <v-icon v-if="result.strictMatch" color="success">
                  mdi-check
                </v-icon>
                <v-icon v-else color="error">
                  mdi-alert-circle
                </v-icon>
              </template>
              <v-card>
                <v-card-text>
                  <div v-if="result.regexp">
                    <span class="green--text">{{ result.regexp.substr(0, result.regexpBreak) }}</span><span class="red--text">{{ result.regexp.substr(result.regexpBreak) }}</span>
                  </div>

                  <div v-else>
                    {{ $t('ui.pages.process.logFormat.regexFailed') }}
                  </div>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>

            <v-expansion-panel-content>
              <div slot="header">
                {{ $t('ui.pages.process.logFormat.ecGenerated') }}
              </div>
              <template slot="actions">
                <v-icon v-if="result.ec && !hasMissingField" color="success">
                  mdi-check
                </v-icon>
                <v-icon v-else color="error">
                  mdi-alert-circle
                </v-icon>
              </template>
              <v-card>
                <v-card-text v-if="hasMissingField">
                  <v-alert
                    v-for="missing in result.missing" :key="missing"
                    :value="true"
                    color="warning"
                    icon="mdi-alert-outline"
                    outline
                  >
                    {{ $t(`ui.pages.process.logFormat.missing.${missing}`) }}
                  </v-alert>
                </v-card-text>

                <v-card-text>
                  <v-data-table
                    :headers="ecHeaders"
                    hide-actions
                    :pagination="{ rowsPerPage: -1 }"
                    item-key="name"
                    :items="ecProps"
                    class="elevation-1"
                  >
                    <template slot="headers" slot-scope="props">
                      <tr>
                        <th
                          v-for="header in props.headers"
                          :key="header.text"
                        >
                          {{ $t(`ui.pages.process.logFormat.${header.text}`) }}
                        </th>
                      </tr>
                    </template>

                    <template slot="items" slot-scope="props">
                      <td>{{ props.item.name }}</td>
                      <td>{{ props.item.value }}</td>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </template>
      </v-card>
    </v-card-text>

    <v-card-text class="text-xs-center">
      <v-btn
        large
        color="primary"
        :disabled="!logLines"
        @click="process"
      >
        {{ $t('ui.pages.process.processlogLines') }}
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import debounce from 'lodash.debounce';

export default {
  auth: true,
  data () {
    return {
      result: null,
      loading: false,
      expandedPanels: [true, false, false],
      ecHeaders: [
        { text: 'property', value: 'property' },
        { text: 'value', value: 'value' }
      ],
      logTypes: [
        { value: '', text: 'Auto recognition' },
        { value: 'ezproxy', text: 'EZproxy' },
        { value: 'apache', text: 'Apache' },
        { value: 'squid', text: 'Squid' }
      ]
    };
  },
  computed: {
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
      return this.$store.state.settings.settings;
    },
    format () {
      return this.settings && this.settings.logFormat;
    },
    proxy () {
      return this.settings && this.settings.logType;
    },
    dateFormat () {
      return this.settings && this.settings.dateFormat;
    }
  },
  watch: {
    format () { this.onChange(); },
    proxy () { this.onChange(); },
    dateFormat () { this.onChange(); }
  },
  methods: {
    onChange () {
      this.loading = true;
      this.parseFirstLine();
    },

    parseFirstLine: debounce(async function parseFirstLine () {
      if (!this.logLines) {
        this.loading = false;
        this.result = null;
        return;
      }

      this.loading = true;

      try {
        this.result = await this.$store.dispatch('process/LOG_PARSER', {
          proxy: this.settings.logType,
          format: this.settings.logFormat,
          dateFormat: this.settings.dateFormat,
          logLines: this.logLines
        });
      } catch (e) {
        const status = (e && e.response && e.response.status) || 500;
        this.$store.dispatch('snacks/error', `E${status} - ${this.$t('ui.errors.cannotGetlogFormat')}`);
      }

      this.loading = false;
    }, 1000),

    process () {
      this.$store.dispatch('process/PROCESS', this.logLines);
      this.$router.push('/process');
    }
  }
};
</script>
