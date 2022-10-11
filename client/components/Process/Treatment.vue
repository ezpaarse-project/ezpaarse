<template>
  <v-layout column>
    <v-card>
      <v-card-text>
        <v-progress-linear
          :color="progressColor"
          height="15"
          :value="progress"
        />

        <div class="text-center headline">
          <p v-if="status === 'finalization'" v-text="$t('ui.pages.process.finalization')" />
          <p
            v-else-if="status === 'end'"
            class="success--text"
            v-text="$t('ui.pages.process.finished')"
          />
          <p v-else-if="status === 'error'" class="error--text">
            <span v-if="error" v-text="error" />
            <span v-else v-text="$t('ui.errors.error')" />
          </p>
          <p
            v-else-if="status === 'abort'"
            class="error--text"
            v-text="$t('ui.pages.process.canceled')"
          />
          <p v-else>
            {{ progress }} %
          </p>
        </div>

        <template v-if="status === 'error' && !error && loggingErrors.length > 0">
          <p v-text="$t('ui.pages.process.hasLoggingErrors')" />
          <Logs :logs="loggingErrors" />
        </template>

        <v-alert :value="status === 'end'" color="info" outlined>
          <div class="text-center" v-html="$t('ui.pages.process.job.infos', macroLinks)" />
        </v-alert>
      </v-card-text>
    </v-card>

    <Report
      v-if="report"
      class="mt-3"
      :report="report"
      :logging="logging"
      :download="report && report.general && status === 'end'"
      :status="status"
    />
  </v-layout>
</template>

<script>
import Report from '~/components/Report.vue';
import Logs from '~/components/Logs.vue';

export default {
  components: {
    Report,
    Logs
  },
  data () {
    return {
      panel: [true, false, false, false],
      macroLinks: {
        excelUrl: 'https://github.com/ezpaarse-project/ezpaarse/raw/master/misc/windows/ezPAARSE-Render.xltm',
        libreOfficeUrl: 'https://github.com/ezpaarse-project/ezpaarse/raw/master/misc/windows/ezPAARSE-Render.ots'
      }
    };
  },
  computed: {
    report () {
      return this.$store.state.socket.report;
    },
    logging () {
      return this.$store.state.socket.logging;
    },
    progress () {
      return this.$store.state.process.progress;
    },
    logFiles () {
      return this.$store.state.process.logFiles;
    },
    error () {
      return this.$store.state.process.error;
    },
    status () {
      return this.$store.state.process.status;
    },
    loggingErrors () {
      return this.logging.filter(log => log.level === 'error').slice(0, 10);
    },
    progressColor () {
      if (this.status === 'end') { return 'success'; }
      if (this.status === 'error') { return 'error'; }
      if (this.status === 'abort') { return 'error'; }
      return 'accent';
    }
  },
  methods: {
    newTreatment () {
      this.$store.dispatch('process/SET_IN_PROGRESS', false);
      this.$router.push('/process');
    },
    cancelProcess () {
      this.$store.dispatch('process/CANCEL_PROCESS');
      this.$router.push('/process');
    }
  }
};
</script>
