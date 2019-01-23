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
      logType: 'text'
    }
  },
  computed: {
    logsLines: {
      get () { return this.$store.state.process.logsLines },
      set (newVal) { this.$store.dispatch('process/SET_LOGS_LINES', newVal) }
    }
  }
}
</script>
