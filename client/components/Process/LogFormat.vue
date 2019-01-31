<template>
  <v-card>
    <v-card-text>
      <v-layout row wrap>
        <v-flex xs12 sm 12>
          <v-form ref="form">
            <v-layout row wrap>
              <v-flex xs12 sm12>
                <v-textarea
                  solo
                  name="input-7-4"
                  :label="$t('ui.pages.process.logFormat.copyPast')"
                  v-model="logsLines"
                  required
                  @input="parseFirstLine"
                ></v-textarea>
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>

        <v-flex xs12 sm12>
          <v-alert
            :value="true"
            color="blue"
            xs12 sm12
          >
            <h3>{{ $t('ui.pages.process.logFormat.formatAnalysis') }}</h3>
            <p>{{ $t('ui.pages.process.logFormat.firstLogLine') }}</p>
          </v-alert>
        </v-flex>

        <v-flex xs6 sm6 pl-2 v-if="result && logsLines">
          <v-card-text xs12 sm12 elevation="1">
            <h4>Format</h4>
            <p>{{ result.proxy }}</p>
            <p>{{ result.format }}</p>
          </v-card-text>
        </v-flex>

        <v-flex xs6 sm6 pl-2 v-if="result && logsLines">
          <v-card-text xs12 sm12 elevation="1">
            <h4>Expression régulière</h4>
            <p>{{ result.regexp }}</p>
          </v-card-text>
        </v-flex>

        <v-card-text xs12 sm12 v-if="result && logsLines">
          <div class="elevation-1">
            <div class="v-table__overflow">
              <table class="v-datatable v-table theme--light">
                <tbody>
                  <tr v-for="(value, index) in result.ec" :key="index">
                    <td class="text-xs-left">{{ index }}</td>
                    <td class="text-xs-left">{{ value }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </v-card-text xs12 sm12>

        <ProcessButton :logType="logType" />
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import ProcessButton from '~/components/Process/ProcessButton'

export default {
  components: {
    ProcessButton
  },
  data () {
    return {
      logType: 'text',
      result: null
    }
  },
  computed: {
    logsLines: {
      get () { return this.$store.state.process.logsLines },
      set (newVal) { this.$store.dispatch('process/SET_LOGS_LINES', newVal) }
    },
    currentPredefinedSettings () {
      return this.$store.state.process.currentPredefinedSettings
    }
  },
  methods: {
    parseFirstLine () {
      this.$store.dispatch('process/LOG_PARSER', { settings: this.currentPredefinedSettings, logsLines: this.logsLines }).then(res => {
        this.result = res
      }).catch(err => { })
    }
  }
}
</script>
