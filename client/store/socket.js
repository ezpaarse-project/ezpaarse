import api from './api';

export default {
  state: () => ({
    socketid: null,
    report: {},
    logging: [],
    jobs: 0
  }),
  mutations: {
    SET_SOCKETID: (state, id) => {
      state.socketid = id;
    },
    SET_REPORT (state, data) {
      state.report = data;
    },
    SET_LOGGING (state, data) {
      state.logging = data;
    },
    PUSH_LOGGING (state, data) {
      state.logging.push(data);
    },
    SET_JOBS (state, data) {
      state.jobs = data;
    }
  },
  actions: {
    RESET: ({ commit }) => {
      commit('SET_REPORT', {});
      commit('SET_LOGGING', []);
    },
    SET_SOCKETID: ({ commit }, id) => {
      commit('SET_SOCKETID', id);
    },
    SET_REPORT ({ commit }, data) {
      commit('SET_REPORT', data);
    },
    PUSH_LOGGING ({ commit }, data) {
      commit('PUSH_LOGGING', JSON.parse(data));
    },
    async GET_JOBS ({ commit, state }) {
      commit('SET_JOBS', await api.getJobs(state.socketid));
    },
    SET_JOBS ({ commit }, data) {
      commit('SET_JOBS', data);
    }
  }
};
