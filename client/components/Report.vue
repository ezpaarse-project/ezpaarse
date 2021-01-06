<template>
  <v-card>
    <v-toolbar flat dark dense color="secondary">
      <v-toolbar-title v-text="$t('ui.pages.process.report.title')" />

      <v-spacer />

      <v-btn
        v-if="urlReport && jobDone"
        color="primary"
        :href="urlReport"
        v-text="$t('ui.pages.process.report.downloadReport')"
      />

      <v-toolbar-items>
        <v-btn v-if="expanded" icon text @click="collapse">
          <v-icon>mdi-arrow-collapse</v-icon>
        </v-btn>

        <v-btn v-else icon text @click="expand">
          <v-icon>mdi-arrow-expand</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-card-text v-if="!report" v-text="$t('ui.errors.reportNotLoaded')" />

    <v-expansion-panels v-else v-model="panels" multiple accordion>
      <v-expansion-panel>
        <v-expansion-panel-header
          class="subtitle-1"
          v-text="$t('ui.pages.process.job.processState')"
        />
        <v-expansion-panel-content>
          <v-card flat>
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
                  <Metric
                    :label="$t(`ui.pages.process.report.${metric.label}`)"
                    :value="metric.value"
                    :icon="metric.icon"
                    :color="metric.iconColor"
                  />
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel v-for="(section, category) in report" :key="category">
        <v-expansion-panel-header
          class="subtitle-1"
          v-text="$t(`ui.pages.process.report.${category}`)"
        />
        <v-expansion-panel-content>
          <v-data-table
            :items="Object.entries(section)"
            hide-default-headers
            hide-default-footer
            item-key="name"
            disable-pagination
          >
            <template v-slot:item="{ item }">
              <tr v-if="category !== 'rejets'">
                <td>{{ item[0] }}</td>
                <td v-if="isLink(item[1])" class="text-xs-left">
                  <a :href="item[1]" target="_blank" v-text="item[1]" />
                </td>
                <td v-else class="text-left" v-text="item[1]" />
              </tr>

              <tr v-else>
                <td v-if="item[0].startsWith('nb-lines')">
                  <div>{{ $t(`ui.pages.process.report.${item[0]}`) }}</div>
                  <div class="grey--text">
                    {{ $t(`ui.pages.process.report.descriptions.${item[0]}`) }}
                  </div>
                </td>
                <td v-else v-text="item[0]" />

                <td v-if="isLink(item[1])" class="text-left">
                  <a :href="item[1]" target="_blank" v-text="item[1]" />
                </td>
                <td v-else class="text-left" v-text="item[1]" />

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
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="subtitle-1" v-text="$t('ui.pages.process.job.traces')" />
        <v-expansion-panel-content>
          <Logs :logs="logging" />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script>
import get from 'lodash.get';
import Metric from '~/components/Metric.vue';
import Logs from '~/components/Logs.vue';

export default {
  components: {
    Metric,
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
    },
    status: {
      type: String,
      default: () => null
    }
  },
  data () {
    return {
      panels: [0]
    };
  },
  computed: {
    urlReport () {
      return get(this, 'report.general[\'URL-Report\']');
    },
    jobDone () {
      return get(this, 'report.general[\'Job-Done\']');
    },
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
      return this.panels.length === this.nbSections;
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
          icon: 'mdi-text-box-multiple-outline',
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
    // FIXME : must be a computed property
    rejectPercent (nbRejets) {
      return Math.ceil(nbRejets / this.relevantLogLines * 100);
    },
    expand () {
      for (let i = 0; i < this.nbSections; i += 1) {
        if (this.panels[i] !== i) {
          this.panels.push(i);
        }
      }
    },
    collapse () {
      this.panels = [];
    },
    isLink (value) {
      return /^https?:\/\//i.test(value);
    }
  }
};
</script>
