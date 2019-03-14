import Vue from 'vue';
import io from 'socket.io-client';

const socket = io(window.location.host);

Vue.use({
  install (vue) {
    vue.prototype.$socket = socket;
  }
});

export default ({ app, store }) => {
  if (socket.connected) {
    store.dispatch('socket/SOCKET_CONNECT', true);
  }
  socket.on('connect', () => {
    store.dispatch('socket/SOCKET_CONNECT', true);
  });

  if (socket.disconnected) {
    store.dispatch('socket/SOCKET_CONNECT', false);
  }
  socket.on('disconnect', () => {
    store.dispatch('socket/SOCKET_CONNECT', false);
  });

  socket.on('castor:update', (data) => {
    store.dispatch('SET_PKBS', data);
  });
  socket.on('report', (data) => {
    store.dispatch('socket/SOCKET_REPORT', data);
  });
  socket.on('logging', (data) => {
    store.dispatch('socket/SOCKET_LOGGING', data);
  });
  if (!app.socket) app.socket = socket;
};
