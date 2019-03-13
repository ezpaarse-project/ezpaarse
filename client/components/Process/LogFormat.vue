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
          <v-form ref="form">
            <v-layout
              row
              wrap
            >
              <v-flex
                xs12
                sm12
              >
                <v-textarea
                  v-model="logsLines"
                  solo
                  name="input-7-4"
                  :label="$t('ui.pages.process.logFormat.copyPast')"
                  required
                  @input="parseFirstLine"
                />
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>

        <v-flex
          xs12
          sm12
        >
          <v-alert
            :value="true"
            :color="alertColor"
            outline
            xs12
            sm12
          >
            <h3 class="black--text">
              {{ $t('ui.pages.process.logFormat.formatAnalysis') }}
            </h3>
            <p class="black--text">
              {{ $t('ui.pages.process.logFormat.firstLogLine') }}
            </p>

            <span v-if="result && logsLines">
              <v-tabs
                v-if="result.formatBreak !== 0"
                v-model="activeTab"
                dark
                xs12
                sm12
                pl-2
                class="black--text"
              >
                <v-tab to="#tab-format">
                  {{ $t('ui.pages.process.logFormat.format') }}
                </v-tab>
                <v-tab to="#tab-regexp">
                  {{ $t('ui.pages.process.logFormat.regex') }}
                </v-tab>
              </v-tabs>

              <v-tabs-items
                v-if="result.formatBreak !== 0"
                v-model="activeTab"
              >
                <v-tab-item value="tab-format">
                  <v-card>
                    <v-card-text
                      xs12
                      sm12
                      class="h100"
                    >
                      <p class="black--text">
                        {{ result.proxy }}
                      </p>
                      <p class="green--text">
                        {{ result.format }}
                      </p>
                    </v-card-text>
                  </v-card>
                </v-tab-item>

                <v-tab-item value="tab-regexp">
                  <v-card>
                    <v-card-text
                      xs12
                      sm12
                      class="h100"
                    >
                      <p class="green--text">
                        {{ result.regexp }}
                      </p>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>

              <v-card-text
                v-if="result.formatBreak !== 0"
                xs12
                sm12
              >
                <h3 class="headline black--text mb-0">
                  {{ $t('ui.pages.process.logFormat.ecGenerated') }}
                </h3>
                <div class="elevation-1">
                  <div class="v-table__overflow">
                    <table class="v-datatable v-table theme--light">
                      <thead>
                        <tr>
                          <th
                            class="column text-xs-left"
                            role="columnheader"
                            scope="col"
                            :aria-label="`${$t('ui.pages.process.logFormat.field')} : No Sorted`"
                            aria-sort="none"
                          >
                            {{ $t('ui.pages.process.logFormat.field') }}
                          </th>
                          <th
                            class="column text-xs-left"
                            role="columnheader"
                            scope="col"
                            :aria-label="`${$t('ui.pages.process.logFormat.value')} : No Sorted`"
                            aria-sort="none"
                          >
                            {{ $t('ui.pages.process.logFormat.value') }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(value, index) in result.ec"
                          :key="index"
                        >
                          <td class="text-xs-left">
                            {{ index }}
                          </td>
                          <td class="text-xs-left">
                            {{ value }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </v-card-text>
            </span>

            <span v-if="result && result.formatBreak === 0">
              <h3 class="red--text">
                {{ $t('ui.pages.process.logFormat.detectionFailed') }}
              </h3>
            </span>
          </v-alert>
        </v-flex>

        <ProcessButton :log-type="logType" />
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
/* eslint-disable import/no-unresolved */
import ProcessButton from '~/components/Process/ProcessButton';

export default {
  components: {
    ProcessButton
  },
  data () {
    return {
      logType: 'text',
      result: null,
      alertColor: 'info',
      activeTab: 'tab-format'
    };
  },
  computed: {
    logsLines: {
      get () { return this.$store.state.process.logsLines; },
      set (newVal) { this.$store.dispatch('process/SET_LOGS_LINES', newVal); }
    },
    currentPredefinedSettings () {
      return this.$store.state.process.currentPredefinedSettings;
    }
  },
  methods: {
    parseFirstLine () {
      if (!this.logsLines) this.alertColor = 'info';
      this.$store.dispatch('process/LOG_PARSER', { settings: this.currentPredefinedSettings, logsLines: this.logsLines }).then(res => {
        this.result = res;
        this.alertColor = (this.result.formatBreak === 0) ? 'error' : 'success';
      }).catch(() => this.$store.dispatch('snacks/info', this.$t('ui.errors.500')));
    }
  }
};
</script>

<style scoped>
.h100 {
  height: 100px;
}
</style>
