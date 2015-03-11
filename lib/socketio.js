'use strict';

var socketio = require('socket.io');

/**
 * Singleton used for an easier access to IO sockets
 */
var SocketIO = function () {

  var io;

  /**
   * Configure socket.io
   * @param  {Object} server  the server to listen
   */
  this.listen = function (server) {
    io = socketio.listen(server, { log: false });
    // Send the socket ID to the client on connection
    // This ID is used to identify the client on AJAX requests
    io.sockets.on('connection', function (socket) {
      socket.emit('connected', socket.id);
    });
  };

  this.io = function () { return io; };
};

module.exports = new SocketIO();