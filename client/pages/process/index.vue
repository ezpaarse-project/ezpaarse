<template>
  <v-card>
    <v-toolbar
      class="secondary"
      dark
      dense
      card
    >
      <v-toolbar-title>{{ $t('ui.pages.process.title') }}</v-toolbar-title>
    </v-toolbar>

    <v-stepper v-model="formStep">
      <v-stepper-header>
        <v-stepper-step
          :edit-icon="$vuetify.icons.complete"
          :editable="!jobInProgress"
          :complete="hasLogFiles"
          step="1"
        >
          {{ $t('ui.pages.process.filesSelection') }}
        </v-stepper-step>

        <v-divider :color="hasLogFiles && formStep > 1 ? 'primary' : ''" />

        <v-stepper-step
          :edit-icon="$vuetify.icons.complete"
          :editable="!jobInProgress"
          :complete="formStep > 2"
          step="2"
        >
          {{ $t('ui.pages.process.settings.title') }}
        </v-stepper-step>

        <v-divider :color="hasJob && formStep > 2 ? 'primary' : ''" />

        <v-stepper-step :editable="hasJob" step="3">
          {{ $t('ui.pages.process.processing') }}
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-layout align-center justify-center row class="mb-3">
            <v-spacer />

            <v-menu
              v-model="fileSelectionHelp"
              :close-on-content-click="false"
              :nudge-width="200"
              max-width="500"
              offset-x
              transition="slide-x-transition"
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  v-on="on"
                >
                  <v-icon>mdi-help-circle</v-icon>
                </v-btn>
              </template>

              <v-card class="text-xs-justify">
                <v-card-text v-html="$t('ui.pages.process.explainationLogs')" />
                <v-divider />
                <v-card-text v-html="$t('ui.pages.process.explainationTestsLogs', { url: logSamplesUrl })" />

                <v-card-actions>
                  <v-spacer />
                  <v-btn flat @click="fileSelectionHelp = false">{{ $t('ui.close') }}</v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>

            <v-btn
              large
              color="primary"
              @click="setFormStep(2)"
            >
              {{ $t('ui.continue') }}
            </v-btn>
          </v-layout>

          <LogFiles class="ma-1" />
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-layout row align-center class="mb-3">
            <v-btn large @click="setFormStep(1)">
              {{ $t('ui.pages.process.filesSelection') }}
            </v-btn>

            <v-spacer />

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn fab small @click="displayCurl" v-on="on">
                  <v-icon>mdi-code-tags</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('ui.pages.process.commandLine') }}</span>
            </v-tooltip>

            <v-btn
              large
              color="primary"
              :disabled="!hasLogFiles"
              @click="process"
            >
              {{ $t('ui.pages.process.startProcessing') }}
            </v-btn>
          </v-layout>

          <Settings class="ma-1" />
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-layout row align-center class="mb-3">
            <v-btn v-if="jobIsCancelable" large color="error" @click="formStep = 1">
              <v-icon left>
                mdi-cancel
              </v-icon>
              {{ $t('ui.cancel') }}
            </v-btn>
            <v-btn v-else large @click="formStep = 1">
              <v-icon left>
                mdi-restart
              </v-icon>
              {{ $t('ui.pages.process.job.newProcess') }}
            </v-btn>

            <v-spacer />

            <v-btn
              v-if="jobId && !jobInProgress"
              large
              :href="resultUrl"
              color="primary"
            >
              <v-icon left>
                mdi-download
              </v-icon>
              {{ $t('ui.pages.process.job.downloadResult') }}
            </v-btn>
          </v-layout>

          <Treatment class="ma-1" />
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

    <v-dialog
      v-model="curlDialog"
      max-width="650"
    >
      <v-card>
        <v-card-text>
          <p v-text="$t('ui.pages.process.curl')" />
          <v-textarea box :value="curlRequest" height="200" />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn flat @click="curlDialog = false">
            {{ $t('ui.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import LogFiles from '~/components/Process/LogFiles';
import Settings from '~/components/Process/Settings';
import Treatment from '~/components/Process/Treatment';

export default {
  auth: true,
  components: {
    Treatment,
    LogFiles,
    Settings
  },
  data () {
    return {
      logSamplesUrl: 'https://github.com/ezpaarse-project/ezpaarse-dataset-samples',
      fileSelectionHelp: false,
      curlDialog: false,
      curlRequest: ''
    };
  },
  async fetch ({ store }) {
    try {
      await store.dispatch('settings/GET_PREDEFINED_SETTINGS');
    } catch (e) {
      await store.dispatch('snacks/error', 'ui.errors.cannotLoadPredefinedSettings');
    }

    try {
      await store.dispatch('settings/GET_COUNTRIES');
    } catch (e) {
      await store.dispatch('snacks/error', 'ui.errors.cannotGetCountriesList');
    }
  },
  computed: {
    formStep: {
      get () { return this.$store.state.process.step; },
      set (value) { return this.setFormStep(value); }
    },
    logFiles () {
      return this.$store.state.process.logFiles;
    },
    hasLogFiles () {
      return Array.isArray(this.logFiles) && this.logFiles.length > 0;
    },
    status () {
      return this.$store.state.process.status;
    },
    jobInProgress () {
      return this.status === 'progress' || this.status === 'finalization';
    },
    jobIsCancelable () {
      return this.$store.getters['process/cancelable'];
    },
    hasJob () {
      return this.status !== null;
    },
    modifiedSettings () {
      return this.$store.getters['settings/hasBeenModified'];
    },
    selectedSetting () {
      return this.$store.state.settings.selectedSetting;
    },
    jobId () {
      return this.$store.state.process.jobId;
    },
    resultUrl () {
      return `/${this.jobId}`;
    }
  },
  methods: {
    setFormStep (value) {
      this.$store.dispatch('process/SET_PROCESS_STEP', value);
    },
    process () {
      const formData = new FormData();
      const sortByName = (a, b) => (a.file.name.toLowerCase() > b.file.name.toLowerCase() ? 1 : -1);
      const files = this.logFiles.slice().sort(sortByName);

      files.forEach(f => {
        formData.append('files[]', f.file);
      });

      this.$store.dispatch('process/PROCESS', formData);
    },
    async displayCurl () {
      let curl = [`curl -v -X POST http://${window.location.host}`];

      if (this.selectedSetting && !this.modifiedSettings) {
        curl = [...curl, `-H "ezPAARSE-Predefined-Settings:${this.selectedSetting}"`];
      } else {
        const headers = await this.$store.dispatch('settings/GET_HEADERS');
        curl = [
          ...curl,
          ...Object.entries(headers).map(([name, value]) => `-H "${name}: ${value}"`)
        ];
      }

      const sortByName = (a, b) => (a.file.name.toLowerCase() > b.file.name.toLowerCase() ? 1 : -1);
      const files = this.logFiles.slice().sort(sortByName);

      files.forEach(({ file }) => {
        curl.push(`-F "files[]=@${file.name};type=${file.type}"`);
      });

      this.curlRequest = curl.join(' \\\n ');
      this.curlDialog = true;
    }
  }
};
</script>
