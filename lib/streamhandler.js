/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

/**
 * Manage a list of streams
 */

var fs           = require('fs');
var EventEmitter = require('events').EventEmitter;
var util         = require('util');

var StreamHandler = function () {
  var self    = this;
  var streams = {};

  /**
   * Add a stream to the list
   * @param {String} name     stream name
   * @param {String} filePath the file to write into
   */
  self.add = function (name, filePath) {
    streams[name] = fs.createWriteStream(filePath);
    streams[name].on('drain', function () {
      self.emit('drain');
    });
  };

  /**
   * Write data into a stream
   * @param  {String} name stream name
   * @param  {String} data data to write
   */
  self.write = function (name, data) {
    var res = streams[name].write(data);
    if (!res) {
      self.emit('saturated');
    }
  };

  /**
   * Close one stream
   * @param {String} name stream name
   */
  self.close = function (name, callback) {
    if (streams[name]) {
      streams[name].end(callback);
    }
  };

  /**
   * Close all streams
   */
  self.closeAll = function (callback) {
    var allStreams = [];
    for (var stream in streams) {
      allStreams.push(streams[stream]);
    }

    var closeOne = function (cb) {
      var stream = allStreams.pop();
      if (stream) {
        stream.end(function () { closeOne(cb); });
      } else {
        cb();
      }
    };

    closeOne(callback);
  };
};

util.inherits(StreamHandler, EventEmitter);
module.exports = StreamHandler;