import { CancelToken } from 'axios';
import Vue from 'vue';
import uuid from 'uuid';
import api from './api';

let fileId = 1;

export default {
  namespaced: true,
  state: {
    processProgress: 0,
    logLines: '',
    logFiles: [],
    queryCancelSource: null,
    status: null,
    report: null,
    logging: null,
    error: null,
    treatments: []
  },
  mutations: {
    SET_PROCESS_PROGRESS (state, data) {
      Vue.set(state, 'processProgress', data);
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
    SET_QUERY_CANCEL_SOURCE (state, data) {
      Vue.set(state, 'queryCancelSource', data);
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
      const headers = await dispatch('settings/GET_HEADERS');
      const source = CancelToken.source();
      const qt = source.token;

      commit('SET_QUERY_CANCEL_SOURCE', source);
      commit('SET_STATUS', 'progress');

      try {
        const response = await this.$axios({
          url: `/${uuid.v1()}`,
          method: 'PUT',
          data: formData,
          cancelToken: qt,
          headers: {
            ...headers,
            'Socket-ID': rootState.socket.socketid,
            'content-type': 'text/plain'
          },
          onUploadProgress: progressEvent => {
            const percent = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
            if (percent <= 100) {
              commit('SET_PROCESS_PROGRESS', percent);
            }
            if (percent >= 100) {
              commit('SET_STATUS', 'finalisation');
            }
          }
        });

        if (response && response.statusCode === 200) {
          commit('SET_STATUS', 'end');
        } else {
          commit('SET_STATUS', 'error');
        }
      } catch ({ response }) {
        commit('SET_STATUS', 'error');
        const status = (response && response.headers && response.headers['ezpaarse-status']) || 500;
        const message = (response && response.headers && response.headers['ezpaarse-status-message']) || 500;
        commit('SET_ERROR', `${status} : ${message}`);
      } finally {
        commit('SET_PROCESS_PROGRESS', 100);
        commit('SET_QUERY_CANCEL_SOURCE', null);
      }
    },
    CANCEL_PROCESS ({ commit, state }) {
      if (state.queryCancelSource) {
        state.queryCancelSource.cancel('Query canceled');
        commit('SET_QUERY_CANCEL_SOURCE', null);
      }
      commit('SET_STATUS', 'abort');
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
    RESET ({ commit }) {
      commit('SET_ERROR', null);
    },
    GET_REPORT ({ commit }, data) {
      return api.getReport(this.$axios, data).then(res => {
        commit('SET_REPORT', res);
      });
    },
    GET_LOGGING ({ commit }, data) {
      return api.getLogging(this.$axios, data).then(res => {
        commit('SET_LOGGING', res);
      });
    },
    LOG_PARSER (ctx, data) {
      return api.getLogParser(this.$axios, data);
    },
    GET_TREATMENTS_BY_USER ({ commit }, userId) {
      return api.getTreatmentsByUser(this.$axios, userId).then(res => commit('SET_TREATMENTS', res));
    },
    GET_TREATMENTS ({ commit }) {
      return api.getTreatments(this.$axios).then(res => commit('SET_TREATMENTS', res));
    }
  }
};
