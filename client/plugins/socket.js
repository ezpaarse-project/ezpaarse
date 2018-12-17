import Vue from 'vue'
import store from '~/store/index'
import VueSocketIO from 'vue-socket.io'

Vue.use(new VueSocketIO({
  debug: true,
  connection: window.location.host,
  vuex: {
     store,
     actionPrefix: 'SOCKET_',
     mutationPrefix: 'SOCKET_'
  }
}))