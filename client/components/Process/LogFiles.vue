<template>
  <v-layout column>
    <v-layout
      ref="dropZone"
      class="dropzone"
      align-center
      justify-center
      fill-height
      @dragover="dragAndDrop('over')"
      @dragleave="dragAndDrop('leave')"
    >
      <input
        ref="logFiles"
        type="file"
        multiple
        @change="handleFilesUpload"
      >
      <v-flex class="headline grey--text text-xs-center">
        {{ $t('ui.pages.process.logFiles.clickToAdd') }}
      </v-flex>
    </v-layout>

    <v-data-table
      v-if="logFiles.length > 0"
      :headers="headers"
      :items="logFiles"
      hide-actions
      class="elevation-1 my-3"
    >
      <template
        slot="items"
        slot-scope="props"
      >
        <td class="justify-center layout px-0">
          <v-icon
            small
            @click="removeLogsFile(props.item.id)"
          >
            mdi-delete
          </v-icon>
        </td>
        <td>
          {{ props.item.file.name }}
        </td>
        <td class="text-xs-right">
          {{ props.item.file.size | prettyBytes }}
        </td>
      </template>

      <template slot="footer">
        <td :colspan="headers.length" class="text-xs-right">
          {{ logFiles.length }} {{ $t('ui.pages.process.logFiles.selectedFiles') }}
          ({{ totalFileSize }} {{ $t('ui.pages.process.logFiles.total') }})
        </td>
      </template>
    </v-data-table>

    <p v-if="logFiles.length > 0" class="text-xs-right">
      <v-btn
        color="error"
        @click="clearList"
      >
        <v-icon left>
          mdi-delete-forever
        </v-icon>
        {{ $t('ui.pages.process.logFiles.removeList') }}
      </v-btn>
    </p>
  </v-layout>
</template>

<script>
import prettyBytes from 'pretty-bytes';

export default {
  filters: {
    prettyBytes (val) {
      let size = parseInt(val, 10);
      if (Number.isNaN(size)) { size = 0; }
      return prettyBytes(size);
    }
  },
  data () {
    return {
      headers: [
        {
          sortable: false,
          width: 10
        },
        {
          text: this.$t('ui.nameFile'),
          align: 'left',
          sortable: false,
          value: 'name'
        },
        {
          text: this.$t('ui.size'),
          align: 'right',
          sortable: false,
          value: 'size'
        }
      ],
      steps: [
        {
          target: '#addFiles',
          content: 'Cliquez ou déposez les fichiers a traiter.',
          params: {
            placement: 'top'
          }
        },
        {
          target: '#logFiles',
          content: 'Traiter le ou les fichiers de logs.',
          params: {
            placement: 'top'
          }
        }
      ]
    };
  },
  computed: {
    logFiles () {
      return this.$store.state.process.logFiles;
    },
    totalFileSize () {
      const size = this.logFiles.reduce((prev, { file }) => prev + file.size, 0);
      return prettyBytes(size);
    }
  },
  methods: {
    handleFilesUpload () {
      Array.from(this.$refs.logFiles.files).forEach(file => {
        this.$store.dispatch('process/ADD_LOG_FILE', file);
      });
      this.$refs.logFiles.value = '';
    },
    removeLogsFile (id) {
      this.$store.dispatch('process/REMOVE_LOG_FILE', id);
    },
    clearList () {
      this.$store.dispatch('process/CLEAR_LOG_FILES');
    },
    dragAndDrop (event) {
      if (this.$refs && this.$refs.dropZone) {
        if (event && event === 'over') {
          this.$refs.dropZone.classList.add('overlay');
        }
        if (event && event === 'leave') {
          this.$refs.dropZone.classList.remove('overlay');
        }
      }
    }
  }
};
</script>

<style scoped>
.dropzone {
  position: relative;
  border: 5px dashed #9e9e9e;
  background-color: transparent;
  border-radius: 3px;
  height: 100px;
}
.dropzone input[type='file'] {
  cursor: pointer;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
.overlay {
  background-color: rgba(62, 62, 62, 0.3);
  border-color: #787878;
}
</style>
