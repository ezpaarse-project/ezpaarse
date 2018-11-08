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
                <v-flex xs6 sm6 pr-3>
                  <v-select
                    :items="logsType"
                    :label="$t('ui.pages.process.logFormat.logType')"
                    required
                    append-icon="mdi-menu-down"
                    v-model="logType"
                  ></v-select>
                </v-flex> 
                <v-flex xs6 sm6 pl-3>
                  <v-text-field
                    :label="$t('ui.pages.process.logFormat.defaultParser')"
                    :placeholder="$t('ui.pages.process.logFormat.defaultParserExample')"
                    required
                  ></v-text-field>
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

          <v-flex xs12 sm12 class="text-xs-center">
            <v-btn color="success" large :disabled="logsLines.length <= 0"><v-icon>mdi-file-multiple</v-icon> {{ $t('ui.pages.process.processLog') }}</v-btn>
          </v-flex>
        </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data () {
    return {
      logsType: [this.$t('ui.pages.process.logFormat.autoRecognition'), 'EZproxy', 'Apache', 'Squid'],
      logType: this.$t('ui.pages.process.logFormat.autoRecognition'),
      logsLines: ''
    }
  }
}
</script>
