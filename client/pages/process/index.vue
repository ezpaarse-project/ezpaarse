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
          :editable="!inProgress"
          :complete="hasLogFiles"
          step="1"
        >
          {{ $t('ui.pages.process.filesSelection') }}
        </v-stepper-step>

        <v-divider :color="hasLogFiles && formStep > 1 ? 'primary' : ''" />

        <v-stepper-step
          :edit-icon="$vuetify.icons.complete"
          :editable="!inProgress"
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
          <v-layout justify-center row>
            <v-spacer />
            <v-btn
              large
              color="primary"
              @click="formStep = 2"
            >
              {{ $t('ui.continue') }}
            </v-btn>
          </v-layout>

          <LogFiles class="ma-1" />
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-layout row align-center>
            <v-btn large @click="formStep = 1">{{ $t('ui.pages.process.filesSelection') }}</v-btn>

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
          <v-layout justify-space-between row>
            <v-btn large @click="formStep = 1">{{ $t('ui.cancel') }}</v-btn>
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
          <p v-html="$t('ui.pages.process.curl')" />
          <v-textarea box :value="curlRequest" height="200"/>
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
  asyncData ({ store, query }) {
    const { status } = store.state.process;

    let formStep = 1;

    if (query.step === 'config') { formStep = 2; }
    if (query.step === 'job' && status) { formStep = 3; }
    if (status === 'progress' || status === 'finalisation') { formStep = 3; }

    return {
      formStep,
      curlDialog: false,
      curlRequest: '',
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
    logFiles () {
      return this.$store.state.process.logFiles;
    },
    hasLogFiles () {
      return Array.isArray(this.logFiles) && this.logFiles.length > 0;
    },
    inProgress () {
      const { status } = this.$store.state.process;
      return status === 'progress' || status === 'finalisation';
    },
    hasJob () {
      return this.$store.state.process.status !== null;
    },
    modifiedSettings () {
      return this.$store.getters['settings/hasBeenModified'];
    },
    selectedSetting () {
      return this.$store.state.settings.selectedSetting;
    },
  },
  methods: {
    process () {
      this.formStep = 3;
      const formData = new FormData();
      const sortByName = (a, b) => (a.file.name.toLowerCase() > b.file.name.toLowerCase() ? 1 : -1);
      const files = this.logFiles.sort(sortByName);

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

      const files = this.logFiles.sort((a, b) => (a.file.name.toLowerCase() > b.file.name.toLowerCase() ? 1 : -1));

      files.forEach(({ file }) => {
        curl.push(`-F "files[]=@${file.name};type=${file.type}"`);
      });

      this.curlRequest = curl.join(' \\\n ');
      this.curlDialog = true;
    }
  }
};
</script>
