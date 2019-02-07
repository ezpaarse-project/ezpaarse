import { CancelToken } from 'axios';
import api from './api';

export default {
  namespaced: true,
  state: {
    inProgress: false,
    predefinedSettings: [],
    currentPredefinedSettings: null,
    processProgress: 0,
    logsLines: '',
    logsFiles: [],
    logsFilesSize: '0 B',
    totalFileSize: 0,
    countLogsFile: 0,
    queryCancelSource: null,
    status: null,
    report: null,
    error: null
  },
  mutations: {
    SET_PREDEFINED_SETTINGS (state, data) {
      state.predefinedSettings = data;
    },
    SET_CURRENT_PREDEFINED_SETTINGS (state, data) {
      state.currentPredefinedSettings = data;
    },
    SET_PROCESS_PROGRESS (state, data) {
      state.processProgress = data;
    },
    SET_IN_PROGRESS (state, data) {
      state.inProgress = data;
    },
    SET_LOGS_LINES (state, data) {
      state.logsLines = data;
    },
    SET_LOGS_FILES (state, data) {
      state.logsFiles = data;
    },
    SET_COUNT_LOGS_FILES (state, data) {
      state.countLogsFile = data;
    },
    SET_LOGS_FILES_SIZE (state, data) {
      state.logsFilesSize = data;
    },
    SET_TOTAL_FILES_SIZE (state, data) {
      state.totalFileSize = data;
    },
    REMOVE_ALL_LOGS_FILES (state) {
      state.logsFiles = [];
    },
    SET_QUERY_CANCERL_SOURCE (state, data) {
      state.queryCancelSource = data;
    },
    SET_STATUS (state, data) {
      state.status = data;
    },
    SET_REPORT (state, data) {
      state.report = data;
    },
    SET_ERROR (state, data) {
      state.error = data;
    }
  },
  actions: {
    GET_PREDEFINED_SETTINGS ({ commit }) {
      return api.getPredefinedSettings(this.$axios).then(res => {
        const data = Object.values(res);

        const currentSettings = {
          fullName: 'Default',
          country: 'Worldwide',
          headers: {
            'Crypted-Fields': ['host', 'login'],
            'COUNTER-Format': 'csv',
            'Date-Format': null,
            'Log-Format': {
              format: null,
              value: null
            },
            'ezPAARSE-Job-Notifications': [],
            'Trace-Level': 'info',
            'Output-Fields': {
              plus: [],
              minus: []
            },
            'Force-Parser': null,
            advancedHeaders: []
          }
        };

        data.forEach((setting, key) => {
          if (Object.keys(res)[key]) setting.id = Object.keys(res)[key];
          if (setting.headers) {
            setting.headers['Crypted-Fields'] = (!setting.headers['Crypted-Fields'] || setting.headers['Crypted-Fields'] === 'none' ? null : setting.headers['Crypted-Fields'].toString().split(','));

            if (setting.headers['Output-Fields']) {
              const tmpOutputFields = setting.headers['Output-Fields'].toString();

              setting.headers['Output-Fields'] = {
                plus: [],
                minus: []
              };

              tmpOutputFields.split(',').map(of => {
                if (of.charAt(0) === '+') setting.headers['Output-Fields'].plus.push(of.slice(1));
                if (of.charAt(0) === '-') setting.headers['Output-Fields'].minus.push(of.slice(1));
                return of;
              });
            } else {
              setting.headers['Output-Fields'] = {
                plus: [],
                minus: []
              };
            }

            setting.headers['Trace-Level'] = 'info';
            if (!setting.headers['COUNTER-Format']) setting.headers['COUNTER-Format'] = 'csv';
            if (setting.headers['COUNTER-Reports']) setting.headers['COUNTER-Format'] = 'tsv';

            if (!setting.headers['Log-Format-ezproxy'] || !setting.headers['Log-Format-apache'] || !setting.headers['Log-Format-squid']) {
              setting.headers['Log-Format'] = {
                format: null,
                value: null
              };
            }

            const headers = ['advancedHeaders', 'COUNTER-Format', 'COUNTER-Reports', 'Output-Fields', 'Crypted-Fields', 'Trace-Level', 'Date-Format', 'Log-Format', 'ezPAARSE-Job-Notifications', 'Force-Parser'];
            setting.headers.advancedHeaders = [];
            Object.keys(setting.headers).forEach(h => {
              const match = /^Log-Format-([a-z]+)$/i.exec(h);
              if (match !== null) {
                const logFormatValue = setting.headers[`Log-Format-${match[1]}`];
                setting.headers['Log-Format'] = {
                  format: match[1],
                  value: logFormatValue
                };
              }
              if (!headers.includes(h)) {
                const tmpValue = setting.headers[h];
                setting.headers.advancedHeaders.push({
                  header: h,
                  value: tmpValue
                });
              }
            });
          }
        });
        data.unshift(currentSettings);

        commit('SET_PREDEFINED_SETTINGS', data);
        commit('SET_CURRENT_PREDEFINED_SETTINGS', JSON.parse(JSON.stringify(currentSettings)));
      });
    },
    SET_CURRENT_PREDEFINED_SETTINGS ({ commit }, data) {
      commit('SET_CURRENT_PREDEFINED_SETTINGS', data);
    },
    PROCESS ({ commit }, data) {
      const source = CancelToken.source();
      const qt = source.token;
      commit('SET_QUERY_CANCERL_SOURCE', source);

      commit('SET_IN_PROGRESS', true);

      return this.$axios({
        url: `/${data.jobID}`,
        method: 'PUT',
        data: data.formData,
        cancelToken: qt,
        onUploadProgress: progressEvent => {
          const percent = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
          if (percent <= 100) {
            commit('SET_PROCESS_PROGRESS', percent);
            commit('SET_STATUS', 'end');
          }
        },
        headers: { ...data.headers, 'content-type': 'text/plain' }
      }).catch(err => {
        source.cancel('Query canceled by error');
        commit('SET_PROCESS_PROGRESS', 100);
        commit('SET_STATUS', 'error');
        if (err.response) {
          commit('SET_ERROR', `${err.response.headers['ezpaarse-status']} : ${err.response.headers['ezpaarse-status-message']}`);
        }
      });
    },
    STOP_PROCESS ({ commit }) {
      commit('SET_IN_PROGRESS', false);
      commit('SET_QUERY_CANCERL_SOURCE', null);
      commit('SET_STATUS', 'abort');
    },
    SET_LOGS_LINES ({ commit }, data) {
      commit('SET_LOGS_LINES', data);
    },
    SET_LOGS_FILES ({ commit }, data) {
      commit('SET_LOGS_FILES', data);
    },
    SET_COUNT_LOGS_FILES ({ commit }, data) {
      commit('SET_COUNT_LOGS_FILES', data);
    },
    SET_LOGS_FILES_SIZE ({ commit }, data) {
      commit('SET_LOGS_FILES_SIZE', data);
    },
    SET_TOTAL_FILES_SIZE ({ commit }, data) {
      commit('SET_TOTAL_FILES_SIZE', data);
    },
    SET_IN_PROGRESS ({ commit }, data) {
      commit('SET_IN_PROGRESS', data);
    },
    RESET ({ commit }) {
      commit('SET_IN_PROGRESS', false);
      commit('SET_COUNT_LOGS_FILES', 0);
      commit('SET_LOGS_FILES_SIZE', 0);
      commit('SET_TOTAL_FILES_SIZE', 0);
      commit('SET_ERROR', null);
      commit('REMOVE_ALL_LOGS_FILES');
    },
    GET_REPORT ({ commit }, data) {
      return api.getReport(this.$axios, data).then(res => {
        commit('SET_REPORT', res);
      });
    },
    LOG_PARSER (data) {
      return api.getLogParser(this.$axios, data);
    }
  }
};
