<template>
  <v-card v-if="report">
    <v-toolbar card dark dense color="secondary">
      <v-toolbar-title>{{ $t('ui.pages.process.report.title') }}</v-toolbar-title>

      <v-spacer />

      <v-toolbar-items>
        <v-btn v-if="!expanded" icon flat @click="expand">
          <v-icon>mdi-arrow-expand</v-icon>
        </v-btn>

        <v-btn v-else icon flat @click="collapse">
          <v-icon>mdi-arrow-collapse</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-expansion-panel v-if="report" v-model="panel" expand>
      <v-expansion-panel-content>
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
                pl-2
              >
                <v-progress-linear indeterminate />
                <p
                  class="text-xs-left"
                  v-text="$t('ui.loading')"
                />
              </v-flex>
              <v-flex
                v-else
                xs6
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
      >
        <div slot="header">
          {{ $t(`ui.pages.process.report.${index}`) }}
        </div>
        <v-card v-if="index !== 'rejets'">
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12>
                <div class="v-table__overflow">
                  <table class="v-datatable v-table theme--light">
                    <tbody>
                      <tr v-for="(r, i) in rep" :key="i">
                        <td class="text-xs-left tr280p">
                          {{ i }}
                        </td>
                        <td v-if="isLink(r)" class="text-xs-left">
                          <a :href="r" target="_blank">{{ r }}</a>
                        </td>
                        <td v-else class="text-xs-left">
                          {{ r }}
                        </td>
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
                pr-2
              >
                <div class="elevation-1">
                  <div class="v-table__overflow">
                    <table class="v-datatable v-table theme--light">
                      <tbody v-if="report.rejets">
                        <tr
                          v-for="(rej, rejectIndex) in report.rejets"
                          :key="rejectIndex"
                          @mouseover="setCurrentReject(rejectIndex)"
                        >
                          <td v-if="rejectIndex !== 'nb-lines-unknown-errors'">
                            {{ $t(`ui.pages.process.report.${rejectIndex}`) }}
                          </td>
                          <td v-else>
                            {{ $t(`ui.pages.process.report.nb-denied-ecs`) }}
                          </td>

                          <td v-if="rejectIndex !== 'nb-lines-unknown-errors'">
                            {{ rej }}
                          </td>
                          <td v-else>
                            {{ report.general['nb-denied-ecs'] }}
                          </td>

                          <td v-if="rejectIndex !== 'nb-lines-unknown-errors'">
                            <v-progress-linear
                              v-if="rejectIndex !== 'nb-lines-ignored'"
                              color="success"
                              height="15"
                              :value="rejectPercent(rej)"
                            />
                          </td>
                          <td v-else>
                            <v-progress-linear
                              color="success"
                              height="15"
                              :value="deniedPercent"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <br>
                <p
                  v-if="report.general"
                  v-text="$t('ui.pages.process.job.relevantLogLinesRead', { relevantLogLines })"
                />
              </v-flex>

              <v-flex
                v-if="currentReject"
                xs3
                pl-2
              >
                <h3 class="headline">
                  {{ $t(`ui.pages.process.report.${currentReject}`) }}
                </h3>
                <br>
                <p
                  class="text-xs-justify"
                  v-text="$t(`ui.pages.process.report.descriptions.${currentReject}`)"
                />
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>

      <v-expansion-panel-content>
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
  </v-card>
</template>

<script>
export default {
  props: {
    report: {
      type: Object,
      default: () => ({})
    },
    download: {
      type: Boolean,
      default: false
    },
    logging: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      panel: [true, false, false, false, false, false, false, false],
      expended: false,
      currentReject: null
    };
  },
  computed: {
    deniedPercent () {
      const a = (this.report.general['nb-denied-ecs'] * 100);
      const b = (this.report.general['nb-lines-input'] - this.report.rejets['nb-lines-ignored']);
      return Math.ceil(a / b);
    },
    relevantLogLines () {
      return this.report.general['nb-lines-input'] - this.report.rejets['nb-lines-ignored'];
    },
    expanded () {
      return this.panel.every(p => p);
    }
  },
  methods: {
    // FIXME
    rejectPercent (rej) {
      const a = (rej * 100);
      const b = (this.report.general['nb-lines-input'] - this.report.rejets['nb-lines-ignored']);
      return Math.ceil(a / b);
    },
    setCurrentReject (index) {
      this.currentReject = index;
    },
    expand () {
      this.panel = this.panel.map(() => true);
    },
    collapse () {
      this.panel = this.panel.map(() => false);
    },
    isLink (value) {
      return /^https?:\/\//i.test(value);
    }
  }
};
</script>

<style scoped>
.tr280p {
  width: 280px;
}
</style>
