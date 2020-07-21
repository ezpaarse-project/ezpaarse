<template>
  <v-layout column>
    <v-layout
      ref="dropZone"
      class="dropzone"
      align-center
      justify-center
      @dragover="dragAndDrop('over')"
      @dragleave="dragAndDrop('leave')"
    >
      <input
        ref="logFiles"
        type="file"
        multiple
        @change="handleFilesUpload"
      >
      <v-flex
        class="headline grey--text text-center"
        v-text="$t('ui.pages.process.logFiles.clickToAdd')"
      />
    </v-layout>

    <v-data-table
      v-if="logFiles.length > 0"
      :headers="headers"
      :items="logFiles"
      hide-default-footer
      class="elevation-1 my-3"
    >
      <template v-slot:body="{ items }">
        <tr v-for="(item, index) in items" :key="index">
          <td class="text-center pl-4">
            <v-icon small @click="removeLogsFile(item.id)">
              mdi-delete
            </v-icon>
          </td>
          <td v-text="item.file.name" />
          <td class="text-right pr-5">
            {{ item.file.size | prettyBytes }}
          </td>
        </tr>
      </template>

      <template v-slot:footer>
        <v-toolbar dense flat class="my-2">
          <v-btn color="error" outlined small @click="clearList">
            <v-icon left>
              mdi-delete-forever
            </v-icon>
            <span v-text="$t('ui.pages.process.logFiles.removeList')" />
          </v-btn>

          <v-spacer />

          <span>
            {{ logFiles.length }} {{ $t('ui.pages.process.logFiles.selectedFiles') }}
            ({{ totalFileSize }} {{ $t('ui.pages.process.logFiles.total') }})
          </span>
        </v-toolbar>
      </template>
    </v-data-table>
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
  computed: {
    headers () {
      return [
        {
          text: '',
          value: 'action',
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
      ];
    },
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
