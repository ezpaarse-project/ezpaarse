<template>
  <v-layout column>
    <!-- <v-flex xs12>
      <v-alert
        :value="status === 'end'"
        color="teal"
        xs12
        outline
      >
        <div
          class="text-xs-center"
          v-html="$t('ui.pages.process.job.infos', {
            excelUrl: 'https://github.com/ezpaarse-project/ezpaarse/raw/master/misc/windows/ezPAARSE-Render.xltm',
            libreOfficeUrl: 'https://github.com/ezpaarse-project/ezpaarse/raw/master/misc/windows/ezPAARSE-Render.ots'
          })"
        />
      </v-alert>
    </v-flex> -->

    <!-- <v-flex
      v-if="status === 'error'"
      xs12
    >
      <v-alert
        :value="true"
        type="error"
      >
        <span v-if="error">
          {{ error }}
        </span>
        <span v-else>
          <ul>
            {{ $t('ui.errors.error') }}
            <li
              v-for="(log, key) in loggingErrors"
              :key="key"
              class="ml-4"
            >
              {{ log.level }} : {{ log.message }}
            </li>
          </ul>
        </span>
      </v-alert>
    </v-flex> -->

    <v-progress-linear
      :color="progressColor"
      height="15"
      :value="progress"
    />

    <div class="text-xs-center headline">
      <p v-if="status === 'finalization'">
        {{ $t('ui.pages.process.finalization') }}
      </p>
      <p v-else-if="status === 'end'" class="success--text">
        {{ $t('ui.pages.process.finished') }}
      </p>
      <p v-else-if="status === 'error'" class="error--text">
        <span v-if="error">
          {{ error }}
        </span>
        <span v-else>
          {{ $t('ui.errors.error') }}
        </span>
      </p>
      <p v-else>
        {{ progress }} %
      </p>
    </div>

    <Report
      v-if="report"
      class="mt-3"
      :report="report"
      :logging="logging"
      :download="report && report.general && status === 'end'"
    />
  </v-layout>
</template>

<script>
import Report from '~/components/Report';

export default {
  components: {
    Report
  },
  data () {
    return {
      panel: [true, false, false, false]
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
    cancelSource () {
      return this.$store.state.process.cancelSource;
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
      return this.logging.filter(log => log.level === 'error');
    },
    progressColor () {
      if (this.status === 'end') { return 'success'; }
      if (this.status === 'error') { return 'error'; }
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
