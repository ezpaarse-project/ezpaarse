<template>
  <v-card>
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

    <v-card-text v-if="!report">
      {{ $t('ui.errors.reportNotLoaded') }}
    </v-card-text>

    <v-expansion-panel v-else v-model="panel" expand>
      <v-expansion-panel-content>
        <div slot="header" class="title">
          {{ $t('ui.pages.process.job.processState') }}
        </div>
        <v-card>
          <v-container fluid>
            <v-layout row wrap>
              <v-flex
                v-for="metric in metrics"
                :key="metric.label"
                class="pa-2"
                xs12
                md6
                lg4
                xl3
              >
                <v-card>
                  <v-layout row align-center>
                    <v-flex shrink>
                      <v-card :color="metric.iconColor" class="ma-2 pa-2">
                        <v-icon size="40" dark>
                          {{ metric.icon }}
                        </v-icon>
                      </v-card>
                    </v-flex>

                    <v-flex>
                      <v-card-title class="text-xs-right">
                        <v-spacer />
                        <div class="text-xs-right">
                          <div class="headline">
                            {{ metric.value }}
                          </div>
                          <div class="subheading grey--text">
                            {{ $t(`ui.pages.process.report.${metric.label}`) }}
                          </div>
                        </div>
                      </v-card-title>
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-expansion-panel-content>

      <v-expansion-panel-content v-for="(section, category) in report" :key="category">
        <div slot="header" class="title">
          {{ $t(`ui.pages.process.report.${category}`) }}
        </div>
        <v-card>
          <v-data-table
            :items="Object.entries(section)"
            hide-headers
            hide-actions
            select-all
            item-key="name"
          >
            <template v-slot:items="{ item }">
              <tr v-if="category !== 'rejets'">
                <td>{{ item[0] }}</td>
                <td v-if="isLink(item[1])" class="text-xs-left">
                  <a :href="item[1]" target="_blank">{{ item[1] }}</a>
                </td>
                <td v-else class="text-xs-left">
                  {{ item[1] }}
                </td>
              </tr>

              <tr v-else>
                <td v-if="item[0].startsWith('nb-lines')">
                  <div>{{ $t(`ui.pages.process.report.${item[0]}`) }}</div>
                  <div class="grey--text">
                    {{ $t(`ui.pages.process.report.descriptions.${item[0]}`) }}
                  </div>
                </td>
                <td v-else>
                  {{ item[0] }}
                </td>

                <td v-if="isLink(item[1])" class="text-xs-left">
                  <a :href="item[1]" target="_blank">{{ item[1] }}</a>
                </td>
                <td v-else class="text-xs-left">
                  {{ item[1] }}
                </td>

                <td style="width: 150px">
                  <v-progress-linear
                    v-if="item[0].startsWith('nb-lines') && item[0] !== 'nb-lines-ignored'"
                    color="success"
                    height="15"
                    :value="rejectPercent(item[1])"
                  />
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-expansion-panel-content>

      <v-expansion-panel-content>
        <div slot="header" class="title">
          {{ $t('ui.pages.process.job.traces') }}
        </div>
        <Logs :logs="logging" />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-card>
</template>

<script>
import Logs from '~/components/Logs';
import get from 'lodash.get';

export default {
  components: {
    Logs
  },
  props: {
    report: {
      type: Object,
      default: () => ({})
    },
    logging: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      panel: [true, false, false, false, false, false, false, false]
    };
  },
  computed: {
    deniedPercent () {
      const nbDenied = get(this, 'report.general[\'nb-denied-ecs\']', 0);
      return Math.ceil(nbDenied / this.relevantLogLines * 100);
    },
    relevantLogLines () {
      const nbInput = get(this, 'report.general[\'nb-lines-input\']', 0);
      const nbIgnored = get(this, 'report.general[\'nb-lines-ignored\']', 0);
      return nbInput - nbIgnored;
    },
    nbSections () {
      // Add 2 for job state and traces which are not report sections
      if (!this.report || typeof this.report !== 'object') { return 2; }
      return Object.keys(this.report).length + 2;
    },
    expanded () {
      return this.panel.length >= this.nbSections && this.panel.every(p => p);
    },
    metrics () {
      const general = get(this, 'report.general', {});
      const stats = get(this, 'report.stats', {});

      return [
        {
          label: 'linesRead',
          icon: 'mdi-file-search-outline',
          iconColor: 'amber',
          value: general['nb-lines-input']
        },
        {
          label: 'ECsGenerated',
          icon: 'mdi-file-document-box-multiple-outline',
          iconColor: 'light-green',
          value: general['nb-ecs']
        },
        {
          label: 'treatmentDuration',
          icon: 'mdi-timer',
          iconColor: 'blue-grey',
          value: general['Job-Duration']
        },
        {
          label: 'logProcessingSpeed',
          icon: 'mdi-speedometer',
          iconColor: 'deep-purple lighten-1',
          value: general['process-speed']
        },
        {
          label: 'ECGenerationSpeed',
          icon: 'mdi-speedometer',
          iconColor: 'blue darken-2',
          value: general['ecs-speed']
        },
        {
          label: 'recognizedPlatforms',
          icon: 'mdi-hexagon-multiple',
          iconColor: 'orange',
          value: stats['platforms']
        },
        {
          label: 'HTMLConsultations',
          icon: 'mdi-web',
          iconColor: 'cyan',
          value: stats['mime-HTML']
        },
        {
          label: 'PDFConsultations',
          icon: 'mdi-file-pdf',
          iconColor: 'red',
          value: stats['mime-PDF']
        }
      ];
    }
  },
  methods: {
    // FIXME
    rejectPercent (nbRejets) {
      return Math.ceil(nbRejets / this.relevantLogLines * 100);
    },
    expand () {
      this.panel = (new Array(this.nbSections)).fill(true);
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
