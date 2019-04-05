<template>
  <div>
    <v-layout class="dropzone" align-center justify-center fill-height>
      <input
        ref="logFiles"
        type="file"
        multiple
        @change="handleFilesUpload"
      >
      <v-flex class="headline grey--text text-xs-center">{{ $t('ui.pages.process.logFiles.clickToAdd') }}</v-flex>
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
        <v-icon left>mdi-delete-forever</v-icon> {{ $t('ui.pages.process.logFiles.removeList') }}
      </v-btn>
    </p>
  </div>
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
    }
  }
};
</script>

<style scoped>
.dropzone {
  position: relative;
  border: 5px dashed #9e9e9e;
  border-radius: 3px;
  height: 100px;
  transition: opacity 0.1s linear;
}
.dropzone:hover {
  opacity: 0.8;
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
</style>
