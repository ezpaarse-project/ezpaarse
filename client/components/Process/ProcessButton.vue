<template>
  <v-flex xs12 sm12 class="text-xs-center" mt-3>
    <v-btn-toggle>
      <v-btn color="teal white--text" large @click="process" :disabled="logsFiles.length <= 0 || inProgress">{{ $t('ui.pages.process.processLog') }}</v-btn>
      <v-btn color="teal white--text" large>
        <v-icon>mdi-file-multiple</v-icon>
      </v-btn>
    </v-btn-toggle>

    <v-btn fab flat small @click="$tours['myTour'].start()">
      <v-icon>mdi-help-circle</v-icon>
    </v-btn>

  </v-flex>
</template>

<script>
import Tour from '~/components/Tour'
import { uuid } from 'vue-uuid'

export default {
  props: [ 'logType' ],
  components: {
    Tour
  },
  computed: {
    inProgress () {
      return this.$store.state.process.inProgress
    },
    logsFiles: {
      get () { return this.$store.state.process.logsFiles },
      set (newVal) { this.$store.dispatch('process/SET_LOGS_FILES', newVal) }
    },
    predefinedSettings () {
      return this.$store.state.process.predefinedSettings
    },
    currentPredefinedSettings () {
      return this.$store.state.process.currentPredefinedSettings
    }
  },
  methods: {
    process () {
      const jobID = uuid.v1()

      const formData = new FormData()
      this.logsFiles.forEach(f => {
        formData.append('files[]', f.file)
      })

      let headers = {}

      Object.keys(this.currentPredefinedSettings.headers).forEach(header => {
        switch (header) {
          case 'advancedHeaders':
            Object.keys(this.currentPredefinedSettings.headers.advancedHeaders).forEach(ah => {
              headers[this.currentPredefinedSettings.headers.advancedHeaders[ah].header] = this.currentPredefinedSettings.headers.advancedHeaders[ah].value
            })
            break

          case 'Log-Format':
            let tmpLogFormat = this.currentPredefinedSettings.headers['Log-Format']
            if (tmpLogFormat.format) headers[`Log-Format-${tmpLogFormat.format}`] = tmpLogFormat.value
            break

          case 'Force-Parser':
            headers['Force-Parser'] = (!this.currentPredefinedSettings.headers['Force-Parser'] || this.currentPredefinedSettings.headers['Force-Parser'] === null) ? '' : this.currentPredefinedSettings.headers['Force-Parser']
            break

          case 'Output-Fields':
            if (this.currentPredefinedSettings.headers['Output-Fields']) {
              let plus = this.currentPredefinedSettings.headers['Output-Fields'].plus.map(p => {
                return `+${p}`
              })
              let minus = this.currentPredefinedSettings.headers['Output-Fields'].minus.map(m => {
                return `-${m}`
              })
              headers['Output-Fields'] = plus.join('') + '' + minus.join('')
            }
            break

          case 'Date-Format':
            headers['Date-Format'] = ''
            break

          case 'Crypted-Fields':
            if (this.currentPredefinedSettings.headers['Crypted-Fields'] && this.currentPredefinedSettings.headers['Crypted-Fields'].length > 0) {
              headers['Crypted-Fields'] = this.currentPredefinedSettings.headers['Crypted-Fields'].join(',')
            }
            break

          case 'ezPAARSE-Job-Notifications':
            this.currentPredefinedSettings.headers['ezPAARSE-Job-Notifications'] = this.currentPredefinedSettings.headers['ezPAARSE-Job-Notifications'].map(mail => {
              return `mail <${mail}>`
            })
            if (this.currentPredefinedSettings.headers['ezPAARSE-Job-Notifications'].length > 0) {
              this.currentPredefinedSettings.headers['ezPAARSE-Job-Notifications'] = this.currentPredefinedSettings.headers['ezPAARSE-Job-Notifications'].join(',')
            }
            break

          case 'COUNTER-Reports':
          case 'COUNTER-Format':
            this.currentPredefinedSettings.headers['COUNTER-Format'] = 'tsv'
            break

          default:
            headers[header] =  this.currentPredefinedSettings.headers[header]
            break
        }
      })

      switch (this.currentPredefinedSettings.headers['COUNTER-Format']) {
        default:
        case 'csv':
          headers['Accept'] = 'text/csv'
          break

        case 'json':
          headers['Accept'] = 'application/json'
          break

        case 'tsv':
          headers['Accept'] = 'text/tab-separated-values'
          break
      }

      headers['Socket-ID'] = this.$socket.id

      this.$router.push('/process/job')

      if (this.logType === 'files') this.$store.dispatch('process/PROCESS_WITH_FILES', { jobID, formData, headers })
      // if (this.logType === 'text') this.$store.dispatch('process/PROCESS', { jobID, formData, headers })
    }
  }
}
</script>
