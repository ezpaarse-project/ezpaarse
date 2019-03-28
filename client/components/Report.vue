<template>
  <v-card-text>
    <v-layout row wrap>
      <v-flex xs6 sm6 class="text-xs-left">
        <v-btn v-if="report" depressed color="green" class="white--text" @click="allPage">
          <v-icon left>mdi-file</v-icon>
          <span v-if="!expended">{{ $t('ui.pages.process.report.seeFull') }}</span>
          <span v-else>{{ $t('ui.pages.process.report.minimizeReport') }}</span>
        </v-btn>
      </v-flex>

      <v-flex v-if="report && report.general && download" xs6 sm6 class="text-xs-right">
        <v-btn
          depressed
          color="teal darken-2"
          class="white--text"
          router
          :to="{ path: `/${report.general['Job-ID']}` }"
          target="_blank"
        >
          {{ $t('ui.pages.process.job.downloadResult') }}
          <v-icon right>mdi-download</v-icon>
        </v-btn>
      </v-flex>

      <v-flex xs12 sm12>
        <v-expansion-panel v-if="report" v-model="panel" expand>
          <v-expansion-panel-content class="teal white--text">
            <div slot="header">
              {{ $t('ui.pages.process.job.processState') }}
            </div>
            <v-card>
              <v-card-text>
                <v-layout
                  row
                  wrap
                >
                  <v-flex
                    v-if="report.length <= 0"
                    xs12
                    sm12
                    pl-2
                  >
                    <v-progress-linear :indeterminate="true" />
                    <p
                      class="text-xs-left"
                      v-html="$t('ui.loading')"
                    />
                  </v-flex>
                  <v-flex
                    v-else
                    xs6
                    sm6
                    pl-2
                  >
                    <div class="elevation-1">
                      <div class="v-table__overflow">
                        <table class="v-datatable v-table theme--light">
                          <tbody v-if="report.general">
                            <tr>
                              <td class="text-xs-left">
                                {{ $t('ui.pages.process.report.linesRead') }}
                              </td>
                              <td class="text-xs-right">
                                {{ report.general['nb-lines-input'] }}
                              </td>
                            </tr>
                            <tr>
                              <td
                                class="text-xs-left"
                              >
                                {{ $t('ui.pages.process.report.ECsGenerated') }}
                              </td>
                              <td class="text-xs-right">
                                {{ report.general['nb-ecs'] }}
                              </td>
                            </tr>
                            <tr>
                              <td
                                class="text-xs-left"
                              >
                                {{ $t('ui.pages.process.report.treatmentDuration') }}
                              </td>
                              <td class="text-xs-right">
                                {{ report.general['Job-Duration'] }}
                              </td>
                            </tr>
                            <tr>
                              <td
                                class="text-xs-left"
                              >
                                {{ $t('ui.pages.process.report.logProcessingSpeed') }}
                              </td>
                              <td class="text-xs-right">
                                {{ report.general['process-speed'] }}
                              </td>
                            </tr>
                            <tr>
                              <td
                                class="text-xs-left"
                              >
                                {{ $t('ui.pages.process.report.ECGenerationSpeed') }}
                              </td>
                              <td class="text-xs-right">
                                {{ report.general['ecs-speed'] }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </v-flex>

                  <v-flex
                    xs6
                    sm6
                    pl-2
                  >
                    <div class="elevation-1">
                      <div class="v-table__overflow">
                        <table class="v-datatable v-table theme--light">
                          <tbody v-if="report.stats">
                            <tr>
                              <td
                                class="text-xs-left"
                              >
                                {{ $t('ui.pages.process.report.recognizedPlatforms') }}
                              </td>
                              <td class="text-xs-right">
                                {{ report.stats['platforms'] }}
                              </td>
                            </tr>
                            <tr>
                              <td
                                class="text-xs-left"
                              >
                                {{ $t('ui.pages.process.report.HTMLConsultations') }}
                              </td>
                              <td class="text-xs-right">
                                {{ report.stats['mime-HTML'] }}
                              </td>
                            </tr>
                            <tr>
                              <td
                                class="text-xs-left"
                              >
                                {{ $t('ui.pages.process.report.PDFConsultations') }}
                              </td>
                              <td class="text-xs-right">
                                {{ report.stats['mime-PDF'] }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>

          <v-expansion-panel-content
            v-for="(rep, index) in report"
            :key="index"
            class="teal white--text"
          >
            <div slot="header">{{ $t(`ui.pages.process.report.${index}`) }}</div>
            <v-card v-if="index !== 'rejets'">
              <v-card-text>
                <v-layout row wrap>
                  <v-flex xs12 sm12>
                    <div class="v-table__overflow">
                      <table class="v-datatable v-table theme--light">
                        <tbody>
                          <tr v-for="(r, i) in rep" :key="i">
                            <td class="text-xs-left tr280p">{{ i }}</td>
                            <td class="text-xs-left" v-html="html(r)"/>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>

            <v-card v-if="index === 'rejets'">
              <v-card-text>
                <v-layout
                  row
                  wrap
                >
                  <v-flex
                    xs9
                    sm9
                    pr-2
                  >
                    <div class="elevation-1">
                      <div class="v-table__overflow">
                        <table class="v-datatable v-table theme--light">
                          <tbody v-if="report.rejets">
                            <tr
                              v-for="(rej, index) in report.rejets"
                              :key="index"
                              @mouseover="setCurrentReject(index)"
                            >
                              <td v-if="index !== 'nb-lines-unknown-errors'">
                                {{ $t(`ui.pages.process.report.${index}`) }}
                              </td>
                              <td v-else>{{ $t(`ui.pages.process.report.nb-denied-ecs`) }}</td>

                              <td v-if="index !== 'nb-lines-unknown-errors'">
                                {{ rej }}
                              </td>
                              <td v-else>{{ report.general['nb-denied-ecs'] }}</td>

                              <td v-if="index !== 'nb-lines-unknown-errors'">
                                <v-progress-linear
                                  v-if="index !== 'nb-lines-ignored'"
                                  background-color="teal white--text"
                                  color="success"
                                  height="15"
                                  :value="rejectPercent(rej)"
                                />
                              </td>
                              <td v-else>
                                <v-progress-linear
                                  background-color="teal white--text"
                                  color="success"
                                  height="15"
                                  :value="nbDeniedEcs()"
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <br>
                    <!-- eslint-disable -->
                    <p
                      v-if="report.general"
                      v-html="$t('ui.pages.process.job.relevantLogLinesRead', { relevantLogLines: relevantLogLines() })"
                    />
                  </v-flex>

                  <v-flex
                    v-if="currentReject"
                    xs3
                    sm3
                    pl-2
                  >
                    <h3 class="headline">
                      {{ $t(`ui.pages.process.report.${currentReject}`) }}
                    </h3>
                    <br>
                    <p
                      class="text-xs-justify"
                      v-html="$t(`ui.pages.process.report.descriptions.${currentReject}`)"
                    />
                    <p v-if="currentReject === 'nb-lines-unknown-domains'">
                      <a
                        href="/api/info/domains/unknown"
                        target="_blank"
                      >
                        <v-btn color="teal white--text">
                          <v-icon
                            left
                            dark
                          >
                            mdi-download
                          </v-icon>
                          {{ $t(`ui.pages.process.report.${currentReject}`) }}
                        </v-btn>
                      </a>
                    </p>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>

          <v-expansion-panel-content class="teal white--text">
            <div slot="header">
              {{ $t('ui.pages.process.job.traces') }}
            </div>
            <v-card color="black">
              <v-card-text>
                <div
                  v-for="(log, index) in logging"
                  :key="index"
                  class="white--text"
                >
                  <span v-if="log && log.date">{{ log.date }}</span>
                  <span
                    v-if="log && (log.level === 'info' || log.level === 'verbose')"
                    class="green--text"
                  >
                    {{ log.level }}
                  </span>
                  <span
                    v-if="log && log.level === 'warn'"
                    class="orange--text"
                  >
                    {{ log.level }}
                  </span>
                  <span
                    v-if="log && log.level === 'error'"
                    class="red--text"
                  >
                    {{ log.level }}
                  </span>
                  <span v-if="log && log.message">: {{ log.message }}</span>
                </div>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-alert
          v-if="!report"
          :value="true"
          color="error"
          icon="mdi-alert"
          outline
        >{{ $t('ui.errors.reportNotLoaded') }}</v-alert>
      </v-flex>
    </v-layout>
  </v-card-text>
</template>

<script>
export default {
  props: ['report', 'download', 'logging'],
  data () {
    return {
      panel: [true, false, false, false, false, false, false, false, false],
      expended: false,
      currentReject: null
    };
  },
  methods: {
    setCurrentReject (index) {
      this.currentReject = index;
    },
    rejectPercent (rej) {
      const a = (rej * 100);
      const b = (this.report.general['nb-lines-input'] - this.report.rejets['nb-lines-ignored']);
      return Math.ceil(a / b);
    },
    nbDeniedEcs () {
      const a = (this.report.general['nb-denied-ecs'] * 100);
      const b = (this.report.general['nb-lines-input'] - this.report.rejets['nb-lines-ignored']);
      return Math.ceil(a / b);
    },
    relevantLogLines () {
      return this.report.general['nb-lines-input'] - this.report.rejets['nb-lines-ignored'];
    },
    allPage () {
      if (!this.expended) this.panel = [true, true, true, true, true, true, true, true, true];
      if (this.expended) this.panel = [false, false, false, false, false, false, false, false, false];
      this.expended = !this.expended;
    },
    html (report) {
      const match = /^(http|https)/i.exec(report);
      if (match !== null) {
        return `<a href="${report}" target="_blank">${report}</a>`;
      }
      return report;
    }
  }
}
</script>

<style scoped>
.tr280p {
  width: 280px;
}
</style>
