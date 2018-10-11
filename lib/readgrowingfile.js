/* eslint no-sync: 0 */
'use strict';

var fs     = require('fs-extra');
var assert = require('assert');

module.exports.readGrowingFile = function (options) {
  options             = options || {};
  options.pollingRate = options.pollingRate || 100;
  options.endCallback = options.endCallback || function () {};
  options.onData      = options.onData || function () {};
  assert(options.sourceFilePath);
  assert(options.isStillGrowing);

  fs.open(options.sourceFilePath, 'r', function (err, fd) {
    var readOffsetStart = 0;
    var readOffsetEnd   = 0;
    var buffer;

    function readData() {
      readOffsetEnd = fs.fstatSync(fd).size;
      if (readOffsetEnd == readOffsetStart) {
        if (options.isStillGrowing()) {
          // if reading the file is faster than writing it
          setTimeout(readData, options.pollingRate);
        } else {
          fs.closeSync(fd);
          options.endCallback();
        }
        return;
      }
      buffer = new Buffer(readOffsetEnd - readOffsetStart);
      fs.read(fd, buffer, 0, buffer.length, readOffsetStart, function (err, bytesRead, buffer) {
        options.onData(buffer);
        readOffsetStart += bytesRead;
        setTimeout(readData, options.pollingRate);
      });

    }
    readData();
  });
};