'use strict';

const socketio = require('socket.io');

/**
 * Singleton used for an easier access to IO sockets
 */
const SocketIO = function () {

  let io;

  /**
   * Configure socket.io
   * @param  {Object} server  the server to listen
   */
  this.listen = function (server) {
    io = socketio(server);
    // Send the socket ID to the client on connection
    // This ID is used to identify the client on AJAX requests
    io.on('connection', function (socket) {
      socket.emit('connected', socket.id);
    });
  };

  this.getSocket = function (id) {
    return this.io?.sockets?.sockets?.get(id);
  };

  this.io = function () { return io; };
};

module.exports = new SocketIO();