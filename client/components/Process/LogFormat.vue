<template>
  <v-card>
    <v-card-text>
      <v-layout
        row
        wrap
      >
        <v-flex
          xs12
          sm
          12
        >
          <v-form>
            <v-layout
              row
              wrap
            >
              <v-flex
                xs12
                sm12
              >
                <v-textarea
                  v-model="logLines"
                  solo
                  name="loglines"
                  :label="$t('ui.pages.process.logFormat.copyPast')"
                  required
                  @input="onChange"
                />
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>

        <v-flex
          xs12
          sm12
        >
          <v-card>
            <v-toolbar
              card
              height="8px"
              :color="cardColor"
            >
            </v-toolbar>

            <v-card-title>
              <div>
                <div class="headline">
                  {{ $t('ui.pages.process.logFormat.formatAnalysis') }}
                  <v-progress-circular v-if="loading" :size="18" :width="2" indeterminate color="primary"></v-progress-circular>
                </div>
                <div class="subheading">{{ $t('ui.pages.process.logFormat.firstLogLine') }}</div>
              </div>
            </v-card-title>

            <template v-if="result">
              <v-card-text v-if="result.autoDetect && !result.strictMatch" class="red--text">
                {{ $t('ui.pages.process.logFormat.detectionFailed') }}
              </v-card-text>

              <v-expansion-panel v-else expand v-model="expandedPanels">
                <v-expansion-panel-content>
                  <div slot="header">
                    {{ $t('ui.pages.process.logFormat.format') }} ({{ result.proxy }})
                  </div>
                  <template slot="actions">
                    <v-icon color="success" v-if="result.strictMatch">mdi-check</v-icon>
                    <v-icon color="error" v-else>mdi-alert-circle</v-icon>
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
                    <v-icon color="success" v-if="result.strictMatch">mdi-check</v-icon>
                    <v-icon color="error" v-else>mdi-alert-circle</v-icon>
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
                    <v-icon color="success" v-if="result.ec && !hasMissingField">mdi-check</v-icon>
                    <v-icon color="error" v-else>mdi-alert-circle</v-icon>
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
        </v-flex>

        <ProcessButton :log-type="logType" />
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
/* eslint-disable import/no-unresolved */
import ProcessButton from '~/components/Process/ProcessButton';
import debounce from 'lodash.debounce';

export default {
  components: {
    ProcessButton
  },
  data () {
    return {
      logType: 'text',
      result: null,
      loading: false,
      activeTab: 'tab-format',
      expandedPanels: [true, false, false],
      ecHeaders: [
        { text: 'property', value: 'property' },
        { text: 'value', value: 'value' }
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
      set (newVal) { this.$store.dispatch('process/SET_LOGS_LINES', newVal); }
    },
    settings () {
      return this.$store.state.process.currentPredefinedSettings;
    },
    headers () {
      return this.settings && this.settings.headers;
    },
    format () {
      return this.headers && this.headers['Log-Format'] && this.headers['Log-Format'].value;
    },
    proxy () {
      return this.headers && this.headers['Log-Format'] && this.headers['Log-Format'].format;
    },
    dateFormat () {
      return this.headers && this.headers['Date-Format'];
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
    parseFirstLine: debounce(async function () {
      if (!this.logLines) {
        this.loading = false;
        return this.result = null;
      }

      this.loading = true;
      const { headers } = this.settings;

      try {
        this.result = await this.$store.dispatch('process/LOG_PARSER', {
           proxy: headers['Log-Format'].format,
           format: headers['Log-Format'].value,
           dateFormat: headers['Date-Format'],
           logLines: this.logLines
        });
      } catch (err) {
        this.$store.dispatch('snacks/error', `E${err.response.status} - ${this.$t('ui.errors.cannotGetlogFormat')}`);
      }

      this.loading = false;
    }, 1000)
  }
};
</script>
