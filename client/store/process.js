// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue';
import { v1 as uuidv1 } from 'uuid';
import get from 'lodash.get';
import api from './api';

let fileId = 1;

export default {
  state: () => ({
    step: 1,
    progress: 0,
    logLines: '',
    logFiles: [],
    abortController: null,
    jobId: null,
    status: null,
    report: null,
    error: null,
    logging: [],
    treatments: []
  }),
  getters: {
    cancelable (state) {
      return state.abortController !== null;
    }
  },
  mutations: {
    SET_JOB_ID (state, value) {
      Vue.set(state, 'jobId', value);
    },
    SET_PROCESS_STEP (state, step) {
      Vue.set(state, 'step', step);
    },
    SET_PROGRESS (state, data) {
      Vue.set(state, 'progress', data);
    },
    SET_LOG_LINES (state, data) {
      Vue.set(state, 'logLines', data);
    },
    ADD_LOG_FILE (state, file) {
      state.logFiles.push({ id: fileId, file });
      fileId += 1;
    },
    REMOVE_LOG_FILE (state, id) {
      Vue.set(state, 'logFiles', state.logFiles.filter(file => file.id !== id));
    },
    CLEAR_LOG_FILES (state) {
      Vue.set(state, 'logFiles', []);
    },
    SET_ABORT_CONTROLLER (state, data) {
      Vue.set(state, 'abortController', data);
    },
    SET_STATUS (state, data) {
      Vue.set(state, 'status', data);
    },
    SET_REPORT (state, data) {
      Vue.set(state, 'report', data);
    },
    SET_LOGGING (state, data) {
      Vue.set(state, 'logging', data);
    },
    SET_ERROR (state, data) {
      Vue.set(state, 'error', data);
    },
    SET_TREATMENTS (state, data) {
      Vue.set(state, 'treatments', data);
    }
  },
  actions: {
    async PROCESS ({ commit, rootState, dispatch }, formData) {
      const headers = await dispatch('settings/GET_HEADERS', null, { root: true });
      const abortController = new AbortController();
      const jobID = uuidv1();

      commit('SET_PROCESS_STEP', 3);
      commit('SET_ERROR', null);
      commit('SET_ABORT_CONTROLLER', abortController);
      commit('SET_PROGRESS', 0);
      commit('SET_JOB_ID', jobID);
      commit('SET_STATUS', 'progress');
      commit('SET_REPORT', null);
      commit('SET_LOGGING', []);

      await dispatch('socket/RESET', null, { root: true });

      try {
        const response = await this.$axios({
          url: `/${jobID}`,
          method: 'PUT',
          data: formData,
          signal: abortController.signal,
          headers: {
            ...headers,
            'Socket-ID': rootState.socket.socketid,
            'content-type': 'text/plain'
          },
          onUploadProgress: progressEvent => {
            const percent = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
            if (percent <= 100) {
              commit('SET_PROGRESS', percent);
            }
            if (percent >= 100) {
              commit('SET_STATUS', 'finalization');
            }
          }
        });

        await dispatch('GET_REPORT', jobID);

        const jobDone = get(rootState, 'process.report.general[Job-Done]');
        const errorMessage = get(rootState, 'process.report.general[status-message]');

        if (errorMessage || !jobDone) {
          if (errorMessage) { commit('SET_ERROR', errorMessage); }
          commit('SET_STATUS', 'error');
        } else if (response && response.status === 200) {
          commit('SET_STATUS', 'end');
        } else {
          commit('SET_STATUS', 'error');
        }
      } catch (e) {
        if (e?.code !== 'ERR_CANCELED') {
          commit('SET_STATUS', 'error');
          commit('SET_ERROR', get(e, 'response.data.message'));
        }
      } finally {
        commit('SET_PROGRESS', 100);
        commit('SET_ABORT_CONTROLLER', null);
      }
    },
    UPLOAD_TO_EZMESURE (ctx, { jobId, data }) {
      return api.uploadToEzMesure(jobId, data);
    },
    CANCEL_PROCESS ({ commit, state }) {
      if (state.abortController) {
        state.abortController.abort();
        commit('SET_ABORT_CONTROLLER', null);
      }
      commit('SET_STATUS', 'abort');
    },
    SET_PROCESS_STEP ({ commit, state }, value) {
      const { status } = state;
      let newStep = parseInt(value, 10);

      if (newStep >= 3 && !status) {
        newStep = state.step;
      } else if (status === 'progress' || status === 'finalization') {
        newStep = 3;
      } else if (newStep < 0) {
        newStep = 1;
      } else if (newStep > 3) {
        newStep = 3;
      }

      commit('SET_PROCESS_STEP', newStep);
    },
    SET_LOG_LINES ({ commit }, data) {
      commit('SET_LOG_LINES', data);
    },
    ADD_LOG_FILE ({ commit }, file) {
      commit('ADD_LOG_FILE', file);
    },
    REMOVE_LOG_FILE ({ commit }, id) {
      commit('REMOVE_LOG_FILE', id);
    },
    CLEAR_LOG_FILES ({ commit }) {
      commit('CLEAR_LOG_FILES');
    },
    GET_REPORT ({ commit }, id) {
      return api.getReport(id).then(res => {
        commit('SET_REPORT', res);
      });
    },
    async GET_LOGGING ({ commit }, jobId) {
      const logging = await api.getLogging(jobId);

      if (typeof logging !== 'string') { return; }

      const lines = logging.split('\n').map(e => {
        const match = /^([a-z0-9:.-]+)\s+([a-z]+):(.*)$/i.exec(e);

        if (!match) { return null; }

        return {
          date: match[1],
          level: match[2],
          message: match[3]
        };
      });

      commit('SET_LOGGING', lines.filter(l => l));
    },
    LOG_PARSER (ctx, data) {
      return api.getLogParser(data);
    },
    GET_TREATMENTS_BY_USER ({ commit }, userId) {
      return api.getTreatmentsByUser(userId).then(res => commit('SET_TREATMENTS', res));
    },
    GET_TREATMENTS ({ commit }) {
      return api.getTreatments().then(res => commit('SET_TREATMENTS', res));
    }
  }
};
