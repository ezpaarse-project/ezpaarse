import { CancelToken } from 'axios';
import Vue from 'vue';
import api from './api';

export default {
  namespaced: true,
  state: {
    inProgress: false,
    predefinedSettings: [],
    customPredefinedSettings: [],
    allPredefinedSettings: [],
    processProgress: 0,
    logsLines: '',
    logsFiles: [],
    logsFilesSize: '0 B',
    totalFileSize: 0,
    countLogsFile: 0,
    queryCancelSource: null,
    status: null,
    report: null,
    error: null,
    settingsIsModified: false,
    countries: []
  },
  mutations: {
    SET_PREDEFINED_SETTINGS (state, data) {
      Vue.set(state, 'predefinedSettings', data);
    },
    SET_CURRENT_PREDEFINED_SETTINGS (state, data) {
      Vue.set(state, 'currentPredefinedSettings', data);
    },
    SET_PROCESS_PROGRESS (state, data) {
      Vue.set(state, 'processProgress', data);
    },
    SET_IN_PROGRESS (state, data) {
      Vue.set(state, 'inProgress', data);
    },
    SET_LOGS_LINES (state, data) {
      Vue.set(state, 'logsLines', data);
    },
    SET_LOGS_FILES (state, data) {
      Vue.set(state, 'logsFiles', data);
    },
    SET_COUNT_LOGS_FILES (state, data) {
      Vue.set(state, 'countLogsFile', data);
    },
    SET_LOGS_FILES_SIZE (state, data) {
      Vue.set(state, 'logsFilesSize', data);
    },
    SET_TOTAL_FILES_SIZE (state, data) {
      Vue.set(state, 'totalFileSize', data);
    },
    REMOVE_ALL_LOGS_FILES (state) {
      Vue.set(state, 'logsFiles', []);
    },
    SET_QUERY_CANCERL_SOURCE (state, data) {
      Vue.set(state, 'queryCancelSource', data);
    },
    SET_STATUS (state, data) {
      Vue.set(state, 'status', data);
    },
    SET_REPORT (state, data) {
      Vue.set(state, 'report', data);
    },
    SET_ERROR (state, data) {
      Vue.set(state, 'error', data);
    },
    SET_CUSTOM_PREDEFINED_SETTINGS (state, data) {
      Vue.set(state, 'customPredefinedSettings', data);
    },
    SET_ALL_PREDEFINED_SETTINGS (state, data) {
      Vue.set(state, 'allPredefinedSettings', data);
    },
    SET_SETTINGS_IS_MODIFIED (state, data) {
      Vue.set(state, 'settingsIsModified', data);
    },
    SET_COUNTRIES (state, data) {
      Vue.set(state, 'countries', data);
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
            'Date-Format': '',
            'Log-Format': {
              format: '',
              value: ''
            },
            'ezPAARSE-Job-Notifications': [],
            'Trace-Level': 'info',
            'Output-Fields': {
              plus: [],
              minus: []
            },
            'Force-Parser': '',
            advancedHeaders: []
          }
        };
        commit('SET_CURRENT_PREDEFINED_SETTINGS', JSON.parse(JSON.stringify(currentSettings)));

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
        data.unshift({ header: 'Predefined Settings' });

        return api.getCustomPredefinedSettings(this.$axios).then(resCustomPredefinedSettings => {
          /* eslint-disable-next-line */
          const customPredefinedSettings = resCustomPredefinedSettings.map(setting => {
            /* eslint-disable-next-line */
            setting.settings._id = setting._id;
            return setting.settings;
          });
          commit('SET_CUSTOM_PREDEFINED_SETTINGS', customPredefinedSettings);
          customPredefinedSettings.unshift({ header: 'Custom predefined settings' });
          customPredefinedSettings.push({ divider: true });

          const cps = JSON.parse(JSON.stringify(customPredefinedSettings));
          Array.prototype.push.apply(cps, data);
          commit('SET_ALL_PREDEFINED_SETTINGS', cps);
        }).catch(() => {
          commit('SET_ALL_PREDEFINED_SETTINGS', data);
        });
      });
    },
    SET_CURRENT_PREDEFINED_SETTINGS ({ commit }, data) {
      commit('SET_CURRENT_PREDEFINED_SETTINGS', data);
    },
    SET_ALL_PREDEFINED_SETTINGS ({ commit }, data) {
      commit('SET_ALL_PREDEFINED_SETTINGS', data);
    },
    /* eslint-disable-next-line */
    SAVE_CUSTOM_PREDEFINED_SETTINGS ({ commit }, data) {
      return api.saveCustomPredefinedSettings(this.$axios, data);
    },
    /* eslint-disable-next-line */
    UPDATE_CUSTOM_PREDEFINED_SETTINGS ({ commit }, data) {
      return api.updateCustomPredefinedSettings(this.$axios, data);
    },
    GET_CUSTOM_PREDEFINED_SETTINGS ({ commit }) {
      return api.getCustomPredefinedSettings(this.$axios).then(res => {
        const customPredefinedSettings = res.map(setting => {
          /* eslint-disable-next-line */
          setting.settings.id = setting._id;
          return setting.settings;
        });
        commit('SET_CUSTOM_PREDEFINED_SETTINGS', customPredefinedSettings);
      });
    },
    GET_COUNTRIES ({ commit }) {
      return api.getCountries(this.$axios).then(res => {
        commit('SET_COUNTRIES', res);
      });
    },
    /* eslint-disable-next-line */
    REMOVE_CUSTOM_PREDEFINED_SETTINGS ({ commit }, data) {
      return api.removeCustomPredefinedSettings(this.$axios, data);
    },
    PROCESS ({ commit, state }, data) {
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
          }
          if (percent >= 100) {
            commit('SET_STATUS', 'finalisation');
          }
        },
        headers: { ...data.headers, 'content-type': 'text/plain' }
      }).then(() => {
        commit('SET_IN_PROGRESS', false);
        commit('SET_STATUS', 'end');
      }).catch(err => {
        state.queryCancelSource.cancel('Query canceled by error');
        commit('SET_QUERY_CANCERL_SOURCE', null);
        commit('SET_PROCESS_PROGRESS', 100);
        commit('SET_STATUS', 'error');
        commit('SET_IN_PROGRESS', false);
        if (err.response) {
          commit('SET_ERROR', `${err.response.headers['ezpaarse-status']} : ${err.response.headers['ezpaarse-status-message']}`);
        }
      });
    },
    STOP_PROCESS ({ commit, state }) {
      if (state.queryCancelSource) {
        state.queryCancelSource.cancel('Query canceled');
        commit('SET_QUERY_CANCERL_SOURCE', null);
      }
      commit('SET_IN_PROGRESS', false);
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
    /* eslint-disable-next-line */
    LOG_PARSER ({ commit }, data) {
      return api.getLogParser(this.$axios, data);
    },
    SET_SETTINGS_IS_MODIFIED ({ commit }, data) {
      commit('SET_SETTINGS_IS_MODIFIED', data);
    }
  }
};
