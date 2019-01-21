export default {
  namespaced: true,

  state: {
    connect: false,
    report: [],
    logging: []
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
    }
  },
  actions: {
    SOCKET_REPORT ({ commit }, data) {
      commit('SOCKET_REPORT', data)
    },
    SOCKET_LOGGING ({ commit }, data) {
      commit('SOCKET_LOGGING', JSON.parse(data))
    }
  }
}
