'use strict';

/**
 * Manage a list of streams
 */

var fs           = require('graceful-fs');
var EventEmitter = require('events').EventEmitter;
var util         = require('util');

function StreamHandler() {
  this.streams = {};
}
util.inherits(StreamHandler, EventEmitter);
module.exports = StreamHandler;

/**
 * Add a stream to the list
 * @param {String} name     stream name
 * @param {String} filePath the file to write into
 */
StreamHandler.prototype.add = function (name, filePath) {
  var self = this;
  self.streams[name] = fs.createWriteStream(filePath);
  self.streams[name].on('drain', function () {
    self.emit('drain');
  });
  self.streams[name].on('finish', function () {
    delete self.streams[name];
  });
  self.streams[name].on('error', function () {
    delete self.streams[name];
  });
  return self;
};

/**
 * Write data into a stream
 * @param  {String} name stream name
 * @param  {String} data data to write
 */
StreamHandler.prototype.write = function (name, data) {
  if (this.streams[name]) {
    var res = this.streams[name].write(data);
    if (!res) {
      this.emit('saturated');
    }
  }
};

/**
 * Close one stream
 * @param {String} name stream name
 */
StreamHandler.prototype.close = function (name, callback) {
  if (this.streams[name]) {
    this.streams[name].end(callback);
  }
};

/**
 * Close all streams
 */
StreamHandler.prototype.closeAll = function (callback) {
  var allStreams = [];
  for (var stream in this.streams) {
    allStreams.push(this.streams[stream]);
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
