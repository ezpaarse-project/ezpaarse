import api from './api'

export default {
  namespaced: true,

  state: {
    connect: false,
    report: [],
    logging: [],
    jobs: 0
  },
  mutations: {
    SOCKET_CONNECT: (state, status) => {
      state.connect = true
    },
    SOCKET_REPORT (state, data) {
      state.report = data
    },
    SOCKET_LOGGING (state, data) {
      state.logging.push(data)
    },
    SET_JOBS (state, data) {
      state.jobs = data
    }
  },
  actions: {
    SOCKET_CONNECT: ({ commit }, data) => {
      commit('SOCKET_CONNECT', data)
    },
    SOCKET_REPORT ({ commit }, data) {
      commit('SOCKET_REPORT', data)
    },
    SOCKET_LOGGING ({ commit }, data) {
      commit('SOCKET_LOGGING', JSON.parse(data))
    },
    GET_JOBS ({ commit }, data) {
      return api.getJobs(this.$axios, data).then(res => {
        commit('SET_JOBS', res)
      }).catch(err => { })
    },
    SET_JOBS ({ commit }, data) {
      commit('SET_JOBS', data)
    }
  }
}
