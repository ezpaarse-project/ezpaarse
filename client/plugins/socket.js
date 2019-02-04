import Vue from 'vue'
import io from 'socket.io-client'

const socket = io(window.location.host)

Vue.use({
  install (vue, options) {
    vue.prototype.$socket = socket
  }
})

export default ({ app, store }) => {
  socket.on('castor:update', (data) => {
    store.dispatch('SET_PKBS', data)
  })
  socket.on('report', (data) => {
    store.dispatch('socket/SOCKET_REPORT', data)
  })
  if (!app.socket) app.socket = socket
}
