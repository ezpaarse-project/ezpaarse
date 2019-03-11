<template>
  <v-flex xs12 sm12 class="text-xs-center" mt-3>
    <ButtonGroup>
      <v-btn color="success" large @click="process" :disabled="logsFiles.length <= 0 || inProgress" v-if="logType === 'files'">{{ $t('ui.pages.process.processLogsFiles') }}</v-btn>
      <v-btn color="success" large @click="process" :disabled="logsLines.length <= 0 || inProgress" v-if="logType === 'text'">{{ $t('ui.pages.process.processLogsLines') }}</v-btn>
      <v-btn color="success" large @click="cURL(); dialog = true" v-if="logType === 'files'">
        <v-icon>mdi-file-multiple</v-icon>
      </v-btn>
    </ButtonGroup>
    <v-btn fab flat small @click="$tours['ezTour'].start()">
      <v-icon>mdi-help-circle</v-icon>
    </v-btn>

    <v-dialog
      v-model="dialog"
      max-width="650"
    >
      <v-card>
        <v-card-text>
          <p v-html="$t('ui.pages.process.curl')"></p>
          <v-textarea
            box
            name="input-7-4"
            :value="curlRequest"
          ></v-textarea>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
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
import ButtonGroup from '~/components/ButtonGroup';
import Tour from '~/components/Tour';
import { uuid } from 'vue-uuid';
import isEqual from 'lodash.isequal';

export default {
  props: [ 'logType' ],
  components: {
    Tour,
    ButtonGroup
  },
  data () {
    return {
      dialog: false,
      curlRequest: null
    }
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
        })
      } else if (this.logType === 'text') {
        formData = this.logsLines;
      } else {
        return false;
      }

      let headers = {};

      switch (this.currentPredefinedSettings.headers['COUNTER-Format']) {
        default:
        case 'csv':
          headers['Accept'] = 'text/csv';
          break

        case 'json':
          headers['Accept'] = 'application/json';
          break

        case 'tsv':
          headers['Accept'] = 'text/tab-separated-values';
          break
      }

      Object.keys(this.currentPredefinedSettings.headers).forEach(header => {
        switch (header) {
          case 'advancedHeaders':
            Object.keys(this.currentPredefinedSettings.headers.advancedHeaders).forEach(ah => {
              headers[this.currentPredefinedSettings.headers.advancedHeaders[ah].header] = this.currentPredefinedSettings.headers.advancedHeaders[ah].value
            });
            break;

          case 'Log-Format':
            let tmpLogFormat = this.currentPredefinedSettings.headers['Log-Format'];
            if (tmpLogFormat.format) headers[`Log-Format-${tmpLogFormat.format}`] = tmpLogFormat.value;
            break;

          case 'Force-Parser':
            headers['Force-Parser'] = (!this.currentPredefinedSettings.headers['Force-Parser'] || this.currentPredefinedSettings.headers['Force-Parser'] === null) ? '' : this.currentPredefinedSettings.headers['Force-Parser'];
            break;

          case 'Output-Fields':
            if (this.currentPredefinedSettings.headers['Output-Fields']) {
              let plus = this.currentPredefinedSettings.headers['Output-Fields'].plus.map(p => {
                return `+${p}`;
              });
              let minus = this.currentPredefinedSettings.headers['Output-Fields'].minus.map(m => {
                return `-${m}`;
              });
              headers['Output-Fields'] = plus.join('') + '' + minus.join('');
            }
            break;

          case 'Date-Format':
            headers['Date-Format'] = '';
            break;

          case 'Crypted-Fields':
            if (this.currentPredefinedSettings.headers['Crypted-Fields'] && this.currentPredefinedSettings.headers['Crypted-Fields'].length > 0) {
              headers['Crypted-Fields'] = this.currentPredefinedSettings.headers['Crypted-Fields'].join(',');
            }
            break;

          case 'ezPAARSE-Job-Notifications':
            this.currentPredefinedSettings.headers['ezPAARSE-Job-Notifications'] = this.currentPredefinedSettings.headers['ezPAARSE-Job-Notifications'].map(mail => {
              return `mail <${mail}>`;
            });
            if (this.currentPredefinedSettings.headers['ezPAARSE-Job-Notifications'].length > 0) {
              this.currentPredefinedSettings.headers['ezPAARSE-Job-Notifications'] = this.currentPredefinedSettings.headers['ezPAARSE-Job-Notifications'].join(',');
            };
            break;

          case 'COUNTER-Format':
            break;

          case 'COUNTER-Reports':
            this.currentPredefinedSettings.headers['COUNTER-Format'] = 'tsv';
            break;

          default:
            headers[header] =  this.currentPredefinedSettings.headers[header];
            break;
        }
      })

      headers['Socket-ID'] = this.$socket.id;

      this.$store.dispatch('process/PROCESS', { jobID, formData, headers });

      this.$router.push('/process/job');
    },
    cURL () {
      let curl = [`curl -v -X POST http://${window.location.host}`];
      
      const ps = this.predefinedSettings.find(s => {
        return s.fullName === this.currentPredefinedSettings.fullName;
      });
      
      let equal = isEqual(ps, this.currentPredefinedSettings);

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
            curl.push(`-H "Accept:text/csv"`);
            break;

          case 'json': 
            curl.push(`-H "Accept:application/json"`);
            break;

          case 'tsv':
            curl.push(`-H "Accept:text/tab-separated-values"`);
            break;
        }

        Object.keys(this.currentPredefinedSettings.headers).forEach(header => {
          switch (header) {
            case 'advancedHeaders':
              Object.keys(this.currentPredefinedSettings.headers.advancedHeaders).forEach(ah => {
                curl.push(`-H "${this.currentPredefinedSettings.headers.advancedHeaders[ah].header}:${this.currentPredefinedSettings.headers.advancedHeaders[ah].value}"`);
              });
              break;

            case 'Log-Format':
              let tmpLogFormat = this.currentPredefinedSettings.headers['Log-Format'];
              if (tmpLogFormat.format) curl.push(`-H "${this.currentPredefinedSettings.headers['Log-Format'].format}:${this.currentPredefinedSettings.headers['Log-Format'].value}"`);
              break;

            case 'Force-Parser':
              if (this.currentPredefinedSettings.headers['Force-Parser']) {
                curl.push(`-H "Force-Parser:${this.currentPredefinedSettings.headers['Force-Parser']}"`);
              }
              break;

            case 'Output-Fields':
              if (this.currentPredefinedSettings.headers['Output-Fields']) {
                let plus = this.currentPredefinedSettings.headers['Output-Fields'].plus.map(p => {
                  return `+${p}`;
                });
                let minus = this.currentPredefinedSettings.headers['Output-Fields'].minus.map(m => {
                  return `-${m}`;
                });
                curl.push(`-H "Output-Fields:${(plus.join('') + '' + minus.join(''))}"`);
              }
              break;

            case 'Date-Format':
              if (this.currentPredefinedSettings.headers['Date-Format']) curl.push(`-H "Date-Format:${this.currentPredefinedSettings.headers['Date-Format']}"`);
              break;

            case 'Crypted-Fields':
              if (this.currentPredefinedSettings.headers['Crypted-Fields'] && this.currentPredefinedSettings.headers['Crypted-Fields'].length > 0) {
                let cryptedFields = this.currentPredefinedSettings.headers['Crypted-Fields'].join(',');
                curl.push(`-H "Crypted-Fields:${cryptedFields}"`) ;
              }
              break;

            case 'ezPAARSE-Job-Notifications':
              if (this.currentPredefinedSettings.headers['ezPAARSE-Job-Notifications'].length > 0) {
                this.currentPredefinedSettings.headers['ezPAARSE-Job-Notifications'] = this.currentPredefinedSettings.headers['ezPAARSE-Job-Notifications'].map(mail => {
                  return `mail <${mail}>`;
                });
                let mails = this.currentPredefinedSettings.headers['ezPAARSE-Job-Notifications'].join(',');
                curl.push(`-H "ezPAARSE-Job-Notifications:${mails}"`);
              }
              break

            case 'COUNTER-Format':
              break;

            case 'COUNTER-Reports':
              curl.push(`-H "COUNTER-Reports:jr1"`);
              curl.push(`-H "COUNTER-Format:tsv"`);
              break;

            default:
              curl.push(`-H "${header}:${this.currentPredefinedSettings.headers[header]}"`);
              break;
          }
        })

      }

      this.logsFiles.forEach(file => {
        curl.push(`-F "files[]=@${file.file.name};type=${file.file.type}"`);
      });

      this.curlRequest = curl.join(' \\\n ');
    }
  }
}
</script>
