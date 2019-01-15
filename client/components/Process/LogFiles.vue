<template>
  <v-card>
    <v-card-text>
      <v-layout row wrap>
        <v-flex xs12 sm12>
          <div class="dragDrop">
            <input type="file" ref="logsFiles" @change="handleFilesUpload" multiple>
            <p><v-icon id="addFiles">mdi-plus-box</v-icon> {{ $t('ui.pages.process.logFiles.clickToAdd') }}</p>
          </div>
        </v-flex>

        <v-flex xs12 sm12 v-if="logsFiles.length > 0" mt-3>
          <v-data-table
            :headers="headers"
            :items="logsFiles"
            hide-actions
            sort-icon="mdi-menu-down"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td><v-icon @click="removeLogsFile(props.item.index)">mdi-delete</v-icon> {{ props.item.name }}</td>
              <td class="text-xs-right">{{ props.item.sizeText }}</td>
            </template>
          </v-data-table>
        </v-flex>

        <v-flex xs6 sm6 v-if="logsFiles.length > 0" mt-3>
          <v-btn color="error" @click="removeList"><v-icon>mdi-delete-forever</v-icon> {{ $t('ui.pages.process.logFiles.removeList') }}</v-btn>
        </v-flex>

        <v-flex xs6 sm6 class="text-sm-right" v-if="logsFiles.length > 0" mt-3>
          {{ logsFiles.length }} {{ $t('ui.pages.process.logFiles.selectedFiles') }} ({{ logsFilesSize }} {{ $t('ui.pages.process.logFiles.total') }})
        </v-flex>

        <v-flex xs12 sm12 class="text-xs-center" mt-3>
          <v-btn-toggle v-model="logsFiles">
            <v-btn color="teal white--text" large @click="process" :disabled="logsFiles <= 0" id="logsFiles">{{ $t('ui.pages.process.processLog') }}</v-btn>
            <v-btn color="teal white--text" large>
              <v-icon>mdi-file-multiple</v-icon>
            </v-btn>
          </v-btn-toggle>
          <v-btn fab flat small @click="$tours['myTour'].start()">
            <v-icon>mdi-help-circle</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-card-text>

    <Tour :steps="steps" />
  </v-card>
</template>

<script>
import Tour from '~/components/Tour'
import { uuid } from 'vue-uuid'

export default {
  props: ['currentPredefinedSettings'],
  components: {
    Tour
  },
  data () {
    return {
      saveParams: false,
      logsFiles: [],
      logsFilesSize: '0 B',
      totalFileSize: 0,
      countLogsFile: 0,
      sizes: ['B', 'KB', 'MB', 'GB', 'TB'],
      headers: [
        {
          text: this.$t('ui.nameFile'),
          align: 'left',
          sortable: true,
          value: 'name'
        },
        {
          text: this.$t('ui.size'),
          align: 'right',
          sortable: true,
          value: 'size'
        }
      ],
      steps: [
        {
          target: '#logsFiles',
          content: 'Traitez les fichiers de logs',
          params: {
            placement: 'top'
          }
        }, {
          target: '#addFiles',
          content: 'Déposez vos fichiers',
          params: {
            placement: 'left'
          }
        }
      ]
    }
  },
  methods: {
    handleFilesUpload () {
      for (let i = 0; i < this.$refs.logsFiles.files.length; i++) {
        const file = this.$refs.logsFiles.files[i]
        const index = parseInt(Math.floor(Math.log(file.size) / Math.log(1024)), 10)

        const size = parseFloat(file.size / Math.pow(1024, index)).toFixed(1)

        this.logsFiles.push({
          file: file,
          name: file.name,
          size: file.size,
          sizeText: size + ' ' + this.sizes[index],
          index: this.countLogsFile++
        })

        this.totalFileSize = (this.totalFileSize + file.size)
      }

      const totalIndex = parseInt(Math.floor(Math.log(this.totalFileSize) / Math.log(1024)), 10)
      const totalSize = parseFloat(this.totalFileSize / Math.pow(1024, totalIndex)).toFixed(1)
      this.logsFilesSize = totalSize + ' ' + this.sizes[totalIndex]
    },
    removeLogsFile (index) {
      const currentLogFile = this.logsFiles.find(e => {
        return e.index === index
      })
      if (currentLogFile) {
        this.totalFileSize = (this.totalFileSize - currentLogFile.size)
        this.logsFiles = this.logsFiles.filter(e => {
          return e.index !== index
        })

        const totalIndex = parseInt(Math.floor(Math.log(this.totalFileSize) / Math.log(1024)), 10)
        const totalSize = parseFloat(this.totalFileSize / Math.pow(1024, totalIndex)).toFixed(1)
        this.logsFilesSize = totalSize + ' ' + this.sizes[totalIndex]
      }
    },
    removeList () {
      this.logsFiles = []
      this.logsFilesSize = '0 B'
      this.countLogsFile = 0
      this.totalFileSize = 0
    },
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

      this.$store.dispatch('process/PROCESS_WITH_FILE', { jobID, formData, headers })

      this.$router.push('/process/job')
    }
  }
}
</script>

<style scoped>
div.dragDrop {
  width: 100%;
  height: 200px;
  border-radius: 5px;
  border: 5px dashed teal;
  transition: opacity 0.2s ease-in-out;
}
div.dragDrop:hover {
  opacity: 0.8;
}
div.dragDrop input[type='file'] {
  width: 100%;
  height: 190px;
  position: absolute;
  opacity: 0;
}
div.dragDrop p {
  text-align: center;
  line-height: 200px;
  font-size: 24px;
  color: teal;
}
</style>
