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
              <td><v-icon @click="removeLogsFile(props.index)">mdi-delete</v-icon> {{ props.item.name }}</td>
              <td class="text-xs-right">{{ props.item.size }}.0 Ko</td>
            </template>
          </v-data-table>
        </v-flex>

        <v-flex xs6 sm6 v-if="logsFiles.length > 0" mt-3>
          <v-btn color="error" @click="removeList"><v-icon>mdi-delete-forever</v-icon> {{ $t('ui.pages.process.logFiles.removeList') }}</v-btn>
        </v-flex>

        <v-flex xs6 sm6 class="text-sm-right" v-if="logsFiles.length > 0" mt-3>
          {{ logsFiles.length }} {{ $t('ui.pages.process.logFiles.selectedFiles') }} ({{ logsFilesSize }}.0 Ko {{ $t('ui.pages.process.logFiles.total') }})
        </v-flex>

        <v-flex xs12 sm12 class="text-xs-center" mt-3>
          <v-btn-toggle v-model="toggle_exclusive">
              <v-btn color="success" large :disabled="logsFiles <= 0" id="logsFiles">{{ $t('ui.pages.process.processLog') }}</v-btn>
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

export default {
  components: {
    Tour
  },
  data () {
    return {
      saveParams: false,
      logsFiles: [],
      logsFilesSize: 0,
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

        const size = Math.ceil(file.size / 1024, 2)

        this.logsFiles.push({
          name: file.name,
          size: size
        })
        this.logsFilesSize = (this.logsFilesSize + size)
      }
    },
    removeLogsFile (logFiles) {
      this.logsFilesSize = (this.logsFilesSize - this.logsFiles[logFiles].size)
      this.logsFiles.splice(logFiles, 1)
    },
    removeList () {
      this.logsFiles = []
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
