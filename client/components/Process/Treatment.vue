<template>
  <v-card-text>
    <v-alert :value="true" color="teal" xs12 sm12 outline>
      <p
        class="text-xs-center subheading"
        v-html="$t('ui.pages.process.job.infos', {
          excelUrl: 'https://github.com/ezpaarse-project/ezpaarse/raw/master/misc/windows/ezPAARSE-Render.xltm',
          libreOfficeUrl: 'https://github.com/ezpaarse-project/ezpaarse/raw/master/misc/windows/ezPAARSE-Render.ots'
        })"
      ></p>
    </v-alert>

    <v-layout row wrap mt-3>
      <v-flex xs12 sm12>
        <v-progress-linear
          background-color="teal lighten-3 white--text"
          color="success"
          height="20"
          :value="processProgress"
        ></v-progress-linear>
      </v-flex>

      <v-flex xs12 sm12 text-xs-right>
        <p>{{ processProgress }} %</p>
      </v-flex>


      <v-flex xs6 sm6 class="text-xs-left" v-if="processProgress >= 100">
        <v-btn-toggle>
          <v-btn
            depressed
            color="green darken-4"
            class="white--text"
            router
            @click="fullReport"
          >
            <v-icon left>mdi-file</v-icon>
            {{ $t('ui.pages.process.job.consultReport') }}
          </v-btn>
        </v-btn-toggle>
      </v-flex>

      <v-flex xs6 sm6 class="text-xs-right" v-if="processProgress >= 100">
        <v-btn-toggle>
          <a :href="`/${report.general['Job-ID']}`" target="_blank" v-if="report && report.general">
            <v-btn
              depressed
              color="green darken-4"
              class="white--text"
            >
              {{ $t('ui.pages.process.job.downloadResult') }}
              <v-icon right>mdi-home</v-icon>
            </v-btn>
          </a>

          <v-btn depressed color="teal darken-2" class="white--text" router :to="{ path: '/process' }">
            {{ $t('ui.pages.process.job.newProcess') }}
            <v-icon right>mdi-reload</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-flex>

      <v-flex xs12 sm12 mt-3 v-if="report">
        <v-expansion-panel v-model="panel" expand>
          <v-expansion-panel-content class="teal lighten-3 white--text">
            <div slot="header">{{ $t('ui.pages.process.job.processState') }}</div>
            <v-card>
              <v-card-text>
                <v-layout row wrap>
                  <v-flex xs6 sm6 pl-2>
                    <div class="elevation-1">
                      <div class="v-table__overflow">
                        <table class="v-datatable v-table theme--light">
                          <tbody v-if="report.general">
                            <tr>
                              <td class="text-xs-left">{{ $t('ui.pages.process.report.linesRead') }}</td>
                              <td class="text-xs-right">{{ report.general['nb-lines-input'] }}</td>
                            </tr>
                            <tr>
                              <td
                                class="text-xs-left"
                              >{{ $t('ui.pages.process.report.ECsGenerated') }}</td>
                              <td class="text-xs-right">{{ report.general['nb-ecs'] }}</td>
                            </tr>
                            <tr>
                              <td
                                class="text-xs-left"
                              >{{ $t('ui.pages.process.report.treatmentDuration') }}</td>
                              <td class="text-xs-right">{{ report.general['Job-Duration'] }}</td>
                            </tr>
                            <tr>
                              <td
                                class="text-xs-left"
                              >{{ $t('ui.pages.process.report.logProcessingSpeed') }}</td>
                              <td class="text-xs-right">{{ report.general['process-speed'] }}</td>
                            </tr>
                            <tr>
                              <td
                                class="text-xs-left"
                              >{{ $t('ui.pages.process.report.ECGenerationSpeed') }}</td>
                              <td class="text-xs-right">{{ report.general['ecs-speed'] }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </v-flex>

                  <v-flex xs6 sm6 pl-2>
                    <div class="elevation-1">
                      <div class="v-table__overflow">
                        <table class="v-datatable v-table theme--light">
                          <tbody v-if="report.stats">
                            <tr>
                              <td
                                class="text-xs-left"
                              >{{ $t('ui.pages.process.report.recognizedPlatforms') }}</td>
                              <td class="text-xs-right">{{ report.stats['platforms'] }}</td>
                            </tr>
                            <tr>
                              <td
                                class="text-xs-left"
                              >{{ $t('ui.pages.process.report.HTMLConsultations') }}</td>
                              <td class="text-xs-right">{{ report.stats['mime-HTML'] }}</td>
                            </tr>
                            <tr>
                              <td
                                class="text-xs-left"
                              >{{ $t('ui.pages.process.report.PDFConsultations') }}</td>
                              <td class="text-xs-right">{{ report.stats['mime-PDF'] }}</td>
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

          <v-expansion-panel-content class="teal lighten-3 white--text">
            <div slot="header">{{ $t('ui.files') }}</div>
            <v-card>
              <v-card-text>
                <v-layout row wrap>
                  <v-flex xs12 sm12>
                    <div class="elevation-1">
                      <div class="v-table__overflow">
                        <table class="v-datatable v-table theme--light">
                          <tbody v-if="report.files">
                            <tr>
                              <td>TODO : Mettre dans le store les fichiers et paramètres</td>
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

          <v-expansion-panel-content class="teal lighten-3 white--text">
            <div slot="header">{{ $t('ui.pages.process.job.rejects') }}</div>
            <v-card>
              <v-card-text>
                <v-layout row wrap>
                  <v-flex xs9 sm9 pr-2>
                    <div class="elevation-1">
                      <div class="v-table__overflow">
                        <table class="v-datatable v-table theme--light">
                          <tbody v-if="report.rejets">
                            <tr
                              v-for="(reject, index) in report.rejets"
                              :key="index"
                              @mouseover="setCurrentReject(index)"
                            >
                              <td>{{ $t(`ui.pages.process.report.${index}`) }}</td>
                              <td>{{ reject }}</td>
                              <td>
                                <v-progress-linear
                                  v-if="index !== 'nb-lines-ignored'"
                                  background-color="teal lighten-3 white--text"
                                  color="success"
                                  height="15"
                                  :value="Math.ceil((reject * 100) / (report.general['nb-lines-input'] - report.rejets['nb-lines-ignored']))"
                                ></v-progress-linear>
                              </td>
                            </tr>
                            <tr @mouseover="setCurrentReject('nb-denied-ecs')">
                              <td>{{ $t(`ui.pages.process.report.nb-denied-ecs`) }}</td>
                              <td>{{ report.general['nb-denied-ecs'] }}</td>
                              <td>
                                <v-progress-linear
                                  background-color="teal lighten-3 white--text"
                                  color="success"
                                  height="15"
                                  :value="Math.ceil((report.general['nb-denied-ecs'] * 100) / (report.general['nb-lines-input'] - report.rejets['nb-lines-ignored']))"
                                ></v-progress-linear>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <br>
                    <p
                      v-if="report.general"
                      v-html="$t('ui.pages.process.job.relevantLogLinesRead', { relevantLogLines: (report.general['nb-lines-input'] - report.rejets['nb-lines-ignored']) })"
                    ></p>
                  </v-flex>

                  <v-flex xs3 sm3 pl-2 v-if="currentReject">
                    <h3 class="headline">{{ $t(`ui.pages.process.job.${currentReject}`) }}</h3>
                    <br>
                    <p
                      v-html="$t(`ui.pages.process.report.descriptions.${currentReject}`)"
                      class="text-xs-justify"
                    ></p>
                    <p v-if="currentReject === 'nb-lines-unknown-domains'">
                      <a href="/api/info/domains/unknown" target="_blank">
                        <v-btn color="teal white--text">
                          <v-icon left dark>mdi-download</v-icon>
                          {{ $t(`ui.pages.process.report.${currentReject}`) }}
                        </v-btn>
                      </a>
                    </p>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>

          <v-expansion-panel-content class="teal lighten-3 white--text">
            <div slot="header">{{ $t('ui.pages.process.job.traces') }}</div>
            <v-card>
              <v-card-text>
                <v-alert :value="true" type="black">
                  <div
                    v-for="(log, index) in logging"
                    :key="index"
                  >
                    {{ log.level }}: {{ log.message }}
                  </div>
                </v-alert>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
  </v-card-text>
</template>

<script>
export default {
  props: [ 'logging', 'report', 'processProgress' ],
  data () {
    return {
      panel: [true, false, false, false],
      currentReject: null
    }
  },
  methods: {
    setCurrentReject (index) {
      this.currentReject = index
    },
    fullReport () {
      this.$emit('consultReport')
    }
  }
}
</script>