export default {
  namespaced: true,

  state: {
    messages: []
  },

  actions: {
    error ({ commit }, text) {
      commit('addMessage', { text, color: 'error' })
    },
    info ({ commit }, text) {
      commit('addMessage', { text, color: 'info' })
    },
    success ({ commit }, text) {
      commit('addMessage', { text, color: 'success' })
    },
    addMessage ({ commit }, message) {
      commit('addMessage', message)
    },
    shiftMessages ({ commit }) {
      commit('shiftMessages')
    }
  },

  mutations: {
    addMessage (state, message) {
      if (typeof message !== 'object') { return }

      const msg = {
        color: message.color || 'info',
        text: message.text,
        timeout: message.timeout || 3000
      }

      state.messages.push(msg)
    },
    shiftMessages (state) {
      state.messages.shift()
    }
  }
}