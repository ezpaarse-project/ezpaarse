<template>
   <v-card>
    <v-toolbar class="secondary" dense dark card>
      <v-toolbar-title>
        {{ $t('ui.pages.process.report.title') }}
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <v-layout row wrap>
        <v-flex xs6 sm6 class="text-xs-left">
          <v-btn
            depressed
            color="green"
            class="white--text"
            @click="allPage"
          >
            <v-icon left>mdi-file</v-icon>
            <span v-if="!expended">{{ $t('ui.pages.process.report.seeFull') }}</span>
            <span v-else>{{ $t('ui.pages.process.report.minimizeReport') }}</span>
          </v-btn>
        </v-flex>

        <v-flex xs6 sm6 class="text-xs-right" v-if="report && report.general">
          <v-btn depressed color="teal darken-2" class="white--text" router :to="{ path: `/${report.general['Job-ID']}` }" target="_blank">
            {{ $t('ui.pages.process.job.downloadResult') }}
            <v-icon right>mdi-home</v-icon>
          </v-btn>
        </v-flex>

        <v-flex xs12 sm12>
          <v-expansion-panel v-model="panel" expand>
            <v-expansion-panel-content
              class="teal white--text"
              v-for="(rep, index) in report"
              :key="index"
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
                              <td class="text-xs-left" v-html="html(r)"></td>
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
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      panel: [true, false, false, false, false, false, false],
      expended: false
    }
  },
  async fetch ({ store, params }) {
    try {
      if (params.uuid) await store.dispatch('process/GET_REPORT', params.uuid)
    } catch (e) { }
  },
  computed: {
    report () {
      return this.$store.state.process.report
    }
  },
  methods: {
    allPage() {
      if (!this.expended) this.panel = [true, true, true, true, true, true, true]
      if (this.expended) this.panel = [false, false, false, false, false, false, false]
      this.expended = !this.expended
    },
    html (report) {
      let match
      if ((match = /^(http|https)/i.exec(report)) !== null) {
        return `<a href="${report}" target="_blank">${report}</a>`
      }
      return report
    }
  }
}
</script>

<style scoped>
.tr280p {
  width: 280px;
}
</style>