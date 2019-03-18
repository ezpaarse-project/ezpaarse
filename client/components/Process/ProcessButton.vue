<template>
  <v-flex
    xs12
    sm12
    class="text-xs-center"
    mt-3
  >
    <ButtonGroup>
      <v-btn
        v-if="logType === 'files'"
        color="success"
        large
        :disabled="logsFiles.length <= 0 || inProgress"
        @click="process"
      >
        {{ $t('ui.pages.process.processLogsFiles') }}
      </v-btn>
      <v-btn
        v-if="logType === 'text'"
        color="success"
        large
        :disabled="logsLines.length <= 0 || inProgress"
        @click="process"
      >
        {{ $t('ui.pages.process.processLogsLines') }}
      </v-btn>
      <v-btn
        v-if="logType === 'files'"
        color="success"
        large
        @click="cURL(); dialog = true"
      >
        <v-icon>mdi-file-multiple</v-icon>
      </v-btn>
    </ButtonGroup>

    <v-dialog
      v-model="dialog"
      max-width="650"
    >
      <v-card>
        <v-card-text>
          <p v-html="$t('ui.pages.process.curl')" />
          <v-textarea
            box
            name="input-7-4"
            :value="curlRequest"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red darken-1"
            flat="flat"
            @click="dialog = false"
          >
            {{ $t('ui.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-flex>
</template>

<script>
/* eslint-disable import/no-unresolved */
/* eslint no-case-declarations: "off" */
import ButtonGroup from '~/components/ButtonGroup';
import { uuid } from 'vue-uuid';
import isEqual from 'lodash.isequal';

export default {
  components: {
    ButtonGroup
  },
  props: ['logType'],
  data () {
    return {
      dialog: false,
      curlRequest: null
    };
  },
  computed: {
    inProgress () {
      return this.$store.state.process.inProgress;
    },
    logsFiles: {
      get () { return this.$store.state.process.logsFiles; },
      set (newVal) { this.$store.dispatch('process/SET_LOGS_FILES', newVal); }
    },
    logsLines () {
      return this.$store.state.process.logsLines;
    },
    predefinedSettings () {
      return this.$store.state.process.predefinedSettings;
    },
    currentPredefinedSettings () {
      return this.$store.state.process.currentPredefinedSettings;
    },
    customPredefinedSettings: {
      get () { return this.$store.state.process.customPredefinedSettings; },
      set (newVal) { this.$store.dispatch('process/SET_CUSTOM_PREDEFINED_SETTINGS', newVal); }
    }
  },
  methods: {
    process () {
      const jobID = uuid.v1();

      let formData;
      if (this.logType === 'files') {
        formData = new FormData();
        this.logsFiles.forEach(f => {
          formData.append('files[]', f.file);
        });
      } else if (this.logType === 'text') {
        formData = this.logsLines;
      } else {
        return false;
      }

      const headers = {};

      switch (this.currentPredefinedSettings.headers['COUNTER-Format']) {
        default:
        case 'csv':
          headers.Accept = 'text/csv';
          break;

        case 'json':
          headers.Accept = 'application/json';
          break;

        case 'tsv':
          headers.Accept = 'text/tab-separated-values';
          break;
      }

      Object.keys(this.currentPredefinedSettings.headers).forEach(header => {
        switch (header) {
          case 'advancedHeaders':
            Object.keys(this.currentPredefinedSettings.headers.advancedHeaders).forEach(ah => {
              const advancedHeader = this.currentPredefinedSettings.headers.advancedHeaders[ah];
              headers[advancedHeader.header] = advancedHeader.value;
            });
            break;

          case 'Log-Format':
            const tmpLogFormat = this.currentPredefinedSettings.headers['Log-Format'];
            if (tmpLogFormat.format) headers[`Log-Format-${tmpLogFormat.format}`] = tmpLogFormat.value;
            break;

          case 'Force-Parser':
            const fp = this.currentPredefinedSettings.headers['Force-Parser'];
            headers['Force-Parser'] = (!fp || fp === null) ? '' : this.currentPredefinedSettings.headers['Force-Parser'];
            break;

          case 'Output-Fields':
            const of = this.currentPredefinedSettings.headers['Output-Fields'];
            if (of) {
              const plus = of.plus.map(p => `+${p}`);
              const minus = of.minus.map(m => `-${m}`);
              headers['Output-Fields'] = `${plus.join('')}${minus.join('')}`;
            }
            break;

          case 'Date-Format':
            headers['Date-Format'] = '';
            break;

          case 'Crypted-Fields':
            const cf = this.currentPredefinedSettings.headers['Crypted-Fields'];
            if (cf && cf.length > 0) {
              headers['Crypted-Fields'] = cf.join(',');
            } else {
              headers['Crypted-Fields'] = 'none';
            }
            break;

          case 'ezPAARSE-Job-Notifications':
            let notif = this.currentPredefinedSettings.headers['ezPAARSE-Job-Notifications'];
            notif = notif.map(mail => `mail <${mail}>`);
            if (notif.length > 0) {
              notif = notif.join(',');
            }
            break;

          case 'COUNTER-Format':
            break;

          case 'COUNTER-Reports':
            this.currentPredefinedSettings.headers['COUNTER-Format'] = 'tsv';
            break;

          default:
            headers[header] = this.currentPredefinedSettings.headers[header];
            break;
        }
      });

      headers['Socket-ID'] = this.$socket.id;

      this.$store.dispatch('process/PROCESS', { jobID, formData, headers });

      return this.$router.push('/process/job');
    },
    cURL () {
      let curl = [`curl -v -X POST http://${window.location.host}`];

      const cps = this.currentPredefinedSettings;
      const ps = this.predefinedSettings.find(s => s.fullName === cps.fullName);

      const equal = isEqual(ps, this.currentPredefinedSettings);

      if (equal) {
        if (this.currentPredefinedSettings.fullName === 'Default') {
          curl = [...curl, '-H "Accept:text/csv"', '-H "Traces-Level:info"', '-H "Crypted-Fields:host,login"'];
        } else {
          curl = [...curl, `-H "ezPAARSE-Predefined-Settings:${this.currentPredefinedSettings.id}"`];
        }
      } else {
        switch (this.currentPredefinedSettings.headers['COUNTER-Format']) {
          default:
          case 'csv':
            curl.push('-H "Accept:text/csv"');
            break;

          case 'json':
            curl.push('-H "Accept:application/json"');
            break;

          case 'tsv':
            curl.push('-H "Accept:text/tab-separated-values"');
            break;
        }

        Object.keys(this.currentPredefinedSettings.headers).forEach(header => {
          switch (header) {
            case 'advancedHeaders':
              Object.keys(this.currentPredefinedSettings.headers.advancedHeaders).forEach(ah => {
                const advancedHeader = this.currentPredefinedSettings.headers.advancedHeaders[ah];
                const advancedHeaderKey = advancedHeader.header;
                const advancedHeaderValue = advancedHeader.value;
                curl.push(`-H "${advancedHeaderKey}:${advancedHeaderValue}"`);
              });
              break;

            case 'Log-Format':
              const tmpLogFormat = this.currentPredefinedSettings.headers['Log-Format'];
              if (tmpLogFormat.format) {
                const logFormatKey = this.currentPredefinedSettings.headers['Log-Format'].format;
                const logFormatValue = this.currentPredefinedSettings.headers['Log-Format'].value;
                curl.push(`-H "${logFormatKey}:${logFormatValue}"`);
              }
              break;

            case 'Force-Parser':
              if (this.currentPredefinedSettings.headers['Force-Parser']) {
                curl.push(`-H "Force-Parser:${this.currentPredefinedSettings.headers['Force-Parser']}"`);
              }
              break;

            case 'Output-Fields':
              if (this.currentPredefinedSettings.headers['Output-Fields']) {
                const plus = this.currentPredefinedSettings.headers['Output-Fields'].plus.map(p => `+${p}`);
                const minus = this.currentPredefinedSettings.headers['Output-Fields'].minus.map(m => `-${m}`);
                curl.push(`-H "Output-Fields:${(`${plus.join('')}${minus.join('')}`)}"`);
              }
              break;

            case 'Date-Format':
              if (this.currentPredefinedSettings.headers['Date-Format']) {
                curl.push(`-H "Date-Format:${this.currentPredefinedSettings.headers['Date-Format']}"`);
              }
              break;

            case 'Crypted-Fields':
              const cf = this.currentPredefinedSettings.headers['Crypted-Fields'];
              if (cf && cf.length > 0) {
                const cryptedFields = this.currentPredefinedSettings.headers['Crypted-Fields'].join(',');
                curl.push(`-H "Crypted-Fields:${cryptedFields}"`);
              } else {
                 curl.push(`-H "Crypted-Fields:none"`);
              }
              break;

            case 'ezPAARSE-Job-Notifications':
              let notif = this.currentPredefinedSettings.headers['ezPAARSE-Job-Notifications'];
              if (notif.length > 0) {
                notif = notif.map(mail => `mail <${mail}>`);
                const mails = notif.join(',');
                curl.push(`-H "ezPAARSE-Job-Notifications:${mails}"`);
              }
              break;

            case 'COUNTER-Format':
              break;

            case 'COUNTER-Reports':
              curl.push('-H "COUNTER-Reports:jr1"');
              curl.push('-H "COUNTER-Format:tsv"');
              break;

            default:
              curl.push(`-H "${header}:${this.currentPredefinedSettings.headers[header]}"`);
              break;
          }
        });
      }

      this.logsFiles.forEach(file => {
        curl.push(`-F "files[]=@${file.file.name};type=${file.file.type}"`);
      });

      this.curlRequest = curl.join(' \\\n ');
    }
  }
};
</script>
