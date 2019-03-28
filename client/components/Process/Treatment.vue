<template>
  <v-card-text>
    <v-alert
      :value="true"
      color="teal"
      xs12
      sm12
      outline
    >
      <p
        class="text-xs-center subheading"
        v-html="$t('ui.pages.process.job.infos', {
          excelUrl: 'https://github.com/ezpaarse-project/ezpaarse/raw/master/misc/windows/ezPAARSE-Render.xltm',
          libreOfficeUrl: 'https://github.com/ezpaarse-project/ezpaarse/raw/master/misc/windows/ezPAARSE-Render.ots'
        })"
      />
    </v-alert>

    <v-layout
      row
      wrap
      mt-3
    >
      <v-flex
        v-if="status && status === 'error' && status !== 'abort' && status !== 'end'"
        xs12
        sm12
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
                v-for="(log, key) in loggingError()"
                :key="key"
                class="ml-4"
              >
                {{ log.level }} : {{ log.message }}
              </li>
            </ul>
          </span>
        </v-alert>
      </v-flex>

      <v-flex
        xs12
        sm12
      >
        <v-progress-linear
          background-color="grey"
          :color="status === 'error' ? 'error' : 'success'"
          height="20"
          :value="processProgress"
        />
      </v-flex>

      <v-flex
        xs12
        sm12
        text-xs-right
      >
        <p>{{ processProgress }} %</p>
      </v-flex>

      <v-flex
        xs6
        sm6
        class="text-xs-left"
      >
        <v-btn
          v-if="report && report.general && processProgress >= 100 && status === 'end'"
          depressed
          color="green"
          class="white--text"
          router
          :to="{ path: `/report/${report.general['Job-ID']}` }"
        >
          <v-icon left>
            mdi-file
          </v-icon>
          {{ $t('ui.pages.process.job.consultReport') }}
        </v-btn>
      </v-flex>

      <v-flex
        xs6
        sm6
        class="text-xs-right"
      >
        <v-btn
          v-if="status === 'end' || status === 'error'"
          depressed
          color="teal darken-2"
          class="white--text"
          @click="newTreatment"
        >
          {{ $t('ui.pages.process.job.newProcess') }}
          <v-icon right>
            mdi-reload
          </v-icon>
        </v-btn>

        <v-btn
          v-if="status !== 'end' && queryCancelSource"
          depressed
          color="error"
          @click="stopProcess"
        >
          {{ $t('ui.pages.process.job.stopProcess') }}
          <v-icon right>
            mdi-close-circle
          </v-icon>
        </v-btn>
      </v-flex>

      <v-flex v-if="report" xs12 sm12 mt-3>
        <Report :report="report" :logging="logging" :download="report && report.general && status === 'end'" />
      </v-flex>
    </v-layout>
  </v-card-text>
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
    processProgress () {
      return this.$store.state.process.processProgress;
    },
    queryCancelSource () {
      return this.$store.state.process.queryCancelSource;
    },
    logsFiles () {
      return this.$store.state.process.logsFiles;
    },
    error () {
      return this.$store.state.process.error;
    },
    status () {
      return this.$store.state.process.status;
    }
  },
  watch: {
    logging: {
      handler () {
        const errors = this.logging.find(log => log.level === 'error');
        if (errors) {
          this.$store.dispatch('process/STOP_PROCESS');
        }
      },
      deep: true
    }
  },
  methods: {
    newTreatment () {
      this.$store.dispatch('process/SET_IN_PROGRESS', false);
      this.$router.push('/process');
    },
    stopProcess () {
      this.$store.dispatch('process/STOP_PROCESS');
      this.$router.push('/process');
    },
    loggingError () {
      let errors = [];
      this.logging.forEach(log => {
        if (log.level === 'error') {
          errors.push(log);
        }
      });
      return errors;
    }
  }
};
</script>
