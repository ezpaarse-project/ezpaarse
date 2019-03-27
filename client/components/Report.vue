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
            <v-card>
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
          </v-expansion-panel-content>

          <v-expansion-panel-content class="teal white--text" v-if="socketLogging.length > 0">
            <div slot="header">
              {{ $t('ui.pages.process.job.traces') }}
            </div>
            <v-card>
              <v-card-text>
                <v-alert
                  :value="true"
                  color="black"
                >
                  <div
                    v-for="(log, index) in socketLogging"
                    :key="index"
                  >
                    <span
                      v-if="log.level === 'info'"
                      class="green--text"
                    >
                      {{ log.level }}
                    </span>
                    <span
                      v-if="log.level === 'warn'"
                      class="orange--text"
                    >
                      {{ log.level }}
                    </span>
                    <span
                      v-if="log.level === 'error'"
                      class="red--text"
                    >
                      {{ log.level }}
                    </span>
                    : {{ log.message }}
                  </div>
                </v-alert>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>

          <v-expansion-panel-content class="teal white--text" v-if="logging && logging.length > 0 && !socketLogging">
            
            <div slot="header">
              {{ $t('ui.pages.process.job.traces') }}
            </div>
            <v-card>
              <v-card-text>
                <v-alert :value="true" color="black">
                  <div v-for="(line, index) in parseLogging(logging)" :key="index">
                    <span v-html="line"></span>
                  </div>
                </v-alert>
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
  props: ['report', 'download'],
  data () {
    return {
      panel: [true, false, false, false, false, false, false, false, false],
      expended: false
    };
  },
  computed: {
    socketLogging () {
      return this.$store.state.socket.logging;
    },
    logging () {
      return this.$store.state.process.logging;
    }
  },
  methods: {
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
    },
    parseLogging (logging) {
      const lines = logging.split('\n');
      const loggingLine = [];
      lines.forEach(line => {
        let match = null;
        if ((match = /(info|error|warn)/i.exec(line)) !== null) {
          let color = 'green';
          switch (match[1]) {
            case 'info':
            default:
              color = 'green';
              break;

            case 'error':
              color = 'red';
              break;

            case 'warn':
              color = 'orange';
              break;
          }
          line = line.replace(match[1], `<span class="${color}--text">${match[1]}</span>`);
          loggingLine.push(line);
        }
      });
      return loggingLine;
    }
  }
}
</script>

<style scoped>
.tr280p {
  width: 280px;
}
</style>
