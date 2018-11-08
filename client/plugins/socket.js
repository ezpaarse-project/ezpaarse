import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'

export default ({ app }) => {
  Vue.use(VueSocketIO, window.location.host, app.store['socket'])
}
