export default {
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
      state.logging = data
    }
  },
  actions: { }
}
