<template>
  <v-card-text>
    <v-layout row wrap>
      <v-flex xs6 sm6 class="text-xs-left">
        <v-btn
          depressed
          color="green darken-4"
          class="white--text"
          @click="allPage"
        >
          <v-icon left>mdi-file</v-icon>Voir le rapport complet
        </v-btn>
      </v-flex>

      <v-flex xs6 sm6 class="text-xs-right" v-if="report && report.general">
        <v-btn-toggle>
          <a :href="`/${report.general['Job-ID']}`" target="_blank">
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

      <v-flex xs12 sm12>
        <v-expansion-panel v-model="panel" expand>
          <v-expansion-panel-content
            class="teal lighten-3 white--text"
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
                            <td class="text-xs-left">{{ r }}</td>
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
</template>

<script>
export default {
  props: [ 'report' ],
  data() {
    return {
      panel: [true, false, false, false, false, false, false],
      expended: false
    }
  },
  methods: {
    allPage() {
      if (!this.expended) this.panel = [true, true, true, true, true, true, true]
      if (this.expended) this.panel = [false, false, false, false, false, false, false]
      this.expended = !this.expended
    }
  }
}
</script>

<style scoped>
.tr280p {
  width: 280px;
}
</style>