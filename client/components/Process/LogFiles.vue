<template>
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
          <div class="dragDrop">
            <input
              ref="logsFiles"
              type="file"
              multiple
              @change="handleFilesUpload"
            >
            <p>
              <v-icon id="addFiles">
                mdi-plus-box
              </v-icon> {{ $t('ui.pages.process.logFiles.clickToAdd') }}
            </p>
          </div>
        </v-flex>

        <v-flex
          v-if="logsFiles.length > 0"
          xs12
          sm12
          mt-3
        >
          <v-data-table
            :headers="headers"
            :items="logsFiles"
            hide-actions
            sort-icon="mdi-menu-down"
            class="elevation-1"
          >
            <template
              slot="items"
              slot-scope="props"
            >
              <td>
                <v-icon @click="removeLogsFile(props.item.index)">
                  mdi-delete
                </v-icon> {{ props.item.file.name }}
              </td>
              <td class="text-xs-right">
                {{ props.item.sizeText }}
              </td>
            </template>
          </v-data-table>
        </v-flex>

        <v-flex
          v-if="logsFiles.length > 0"
          xs6
          sm6
          mt-3
        >
          <v-btn
            color="error"
            @click="removeList"
          >
            <v-icon>mdi-delete-forever</v-icon> {{ $t('ui.pages.process.logFiles.removeList') }}
          </v-btn>
        </v-flex>

        <v-flex
          v-if="logsFiles.length > 0"
          xs6
          sm6
          class="text-sm-right"
          mt-3
        >
          {{ logsFiles.length }} {{ $t('ui.pages.process.logFiles.selectedFiles') }}
          ({{ logsFilesSize }} {{ $t('ui.pages.process.logFiles.total') }})
        </v-flex>

        <ProcessButton :log-type="logType" />
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
/* eslint-disable import/no-unresolved */
/* eslint no-restricted-properties: "off" */
import ProcessButton from '~/components/Process/ProcessButton';

export default {
  components: {
    ProcessButton
  },
  data () {
    return {
      logType: 'files',
      saveParams: false,
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
    };
  },
  computed: {
    countLogsFile: {
      get () { return this.$store.state.process.countLogsFile; },
      set (newVal) { this.$store.dispatch('process/SET_COUNT_LOGS_FILES', newVal); }
    },
    logsFilesSize: {
      get () { return this.$store.state.process.logsFilesSize; },
      set (newVal) { this.$store.dispatch('process/SET_LOGS_FILES_SIZE', newVal); }
    },
    totalFileSize: {
      get () { return this.$store.state.process.totalFileSize; },
      set (newVal) { this.$store.dispatch('process/SET_TOTAL_FILES_SIZE', newVal); }
    },
    logsFiles: {
      get () { return this.$store.state.process.logsFiles; },
      set (newVal) { this.$store.dispatch('process/SET_LOGS_FILES', newVal); }
    },
    currentPredefinedSettings () {
      return this.$store.state.process.currentPredefinedSettings;
    }
  },
  methods: {
    handleFilesUpload () {
      /* eslint-disable-next-line */
      for (let i = 0; i < this.$refs.logsFiles.files.length; i++) {
        const file = this.$refs.logsFiles.files[i];

        const tmpFile = this.logsFiles.find(f => file.name === f.name);
        if (tmpFile) return;

        const index = parseInt(Math.floor(Math.log(file.size) / Math.log(1024)), 10);

        const size = parseFloat(file.size / Math.pow(1024, index)).toFixed(1);

        this.countLogsFile = (this.countLogsFile + 1);
        this.logsFiles.push({
          file,
          sizeText: `${size} ${this.sizes[index]}`,
          index: this.countLogsFile
        });

        this.totalFileSize = (this.totalFileSize + file.size);
      }

      const totalIndex = parseInt(Math.floor(Math.log(this.totalFileSize) / Math.log(1024)), 10);
      const totalSize = parseFloat(this.totalFileSize / Math.pow(1024, totalIndex)).toFixed(1);
      this.logsFilesSize = `${totalSize} ${this.sizes[totalIndex]}`;
    },
    removeLogsFile (index) {
      const currentLogFile = this.logsFiles.find(e => e.index === index);
      if (currentLogFile) {
        this.totalFileSize = (this.totalFileSize - currentLogFile.file.size);
        this.logsFiles = this.logsFiles.filter(e => e.index !== index);

        const totalIndex = parseInt(Math.floor(Math.log(this.totalFileSize) / Math.log(1024)), 10);
        const totalSize = parseFloat(this.totalFileSize / Math.pow(1024, totalIndex)).toFixed(1);
        this.logsFilesSize = `${totalSize} ${this.sizes[totalIndex]}`;
      }
    },
    removeList () {
      this.$store.dispatch('process/RESET');
    }
  }
};
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
