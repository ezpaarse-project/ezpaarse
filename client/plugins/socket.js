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
    store.dispatch('socket/SET_SOCKETID', socket.id);
  }
  socket.on('connect', () => {
    store.dispatch('socket/SET_SOCKETID', socket.id);
  });

  if (socket.disconnected) {
    store.dispatch('socket/SET_SOCKETID', null);
  }
  socket.on('disconnect', () => {
    store.dispatch('socket/SET_SOCKETID', null);
  });

  socket.on('castor:update', (data) => {
    store.dispatch('SET_PKBS', data);
  });
  socket.on('report', (data) => {
    store.dispatch('socket/SET_REPORT', data);
  });
  socket.on('logging', (data) => {
    store.dispatch('socket/PUSH_LOGGING', data);
  });

  if (!app.socket) {
    app.socket = socket;
  }
};
