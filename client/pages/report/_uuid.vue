<template>
  <v-card>
    <v-toolbar
      class="secondary"
      dense
      dark
      card
    >
      <v-toolbar-title>
        {{ $t('ui.pages.process.report.title') }}
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <v-layout
        row
        wrap
      >
        <v-flex
          xs6
          sm6
          class="text-xs-left"
        >
          <v-btn
            v-if="report"
            depressed
            color="green"
            class="white--text"
            @click="allPage"
          >
            <v-icon left>
              mdi-file
            </v-icon>
            <span v-if="!expended">
              {{ $t('ui.pages.process.report.seeFull') }}
            </span>
            <span v-else>
              {{ $t('ui.pages.process.report.minimizeReport') }}
            </span>
          </v-btn>
        </v-flex>

        <v-flex
          v-if="report && report.general"
          xs6
          sm6
          class="text-xs-right"
        >
          <v-btn
            depressed
            color="teal darken-2"
            class="white--text"
            router
            :to="{ path: `/${report.general['Job-ID']}` }"
            target="_blank"
          >
            {{ $t('ui.pages.process.job.downloadResult') }}
            <v-icon right>
              mdi-home
            </v-icon>
          </v-btn>
        </v-flex>

        <v-flex
          xs12
          sm12
        >
          <v-expansion-panel
            v-if="report"
            v-model="panel"
            expand
          >
            <v-expansion-panel-content
              v-for="(rep, index) in report"
              :key="index"
              class="teal white--text"
            >
              <div slot="header">
                {{ $t(`ui.pages.process.report.${index}`) }}
              </div>
              <v-card>
                <v-card-text>
                  <v-layout
                    row
                    wrap
                  >
                    <v-flex
                      xs12
                      sm12
                    >
                      <div class="v-table__overflow">
                        <table class="v-datatable v-table theme--light">
                          <tbody>
                            <tr
                              v-for="(r, i) in rep"
                              :key="i"
                            >
                              <td class="text-xs-left tr280p">
                                {{ i }}
                              </td>
                              <td
                                class="text-xs-left"
                                v-html="html(r)"
                              />
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </v-flex>
                  </v-layout>
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
          >
            {{ $t('ui.errors.reportNotLoaded') }}
          </v-alert>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data () {
    return {
      panel: [true, false, false, false, false, false, false],
      expended: false
    };
  },
  async fetch ({ store, params, app }) {
    try {
      if (params.uuid) await store.dispatch('process/GET_REPORT', params.uuid);
    } catch (e) {
      await store.dispatch('snacks/error', app.i18n.t('ui.errors.error'));
    }
  },
  computed: {
    report () {
      return this.$store.state.process.report;
    }
  },
  methods: {
    allPage () {
      if (!this.expended) this.panel = [true, true, true, true, true, true, true];
      if (this.expended) this.panel = [false, false, false, false, false, false, false];
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
};
</script>

<style scoped>
.tr280p {
  width: 280px;
}
</style>
