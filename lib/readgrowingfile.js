/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var fs = require('fs');
var assert = require('assert');

module.exports.readGrowingFile = function (options) {
  options = options || {};
  assert(options.sourceFilePath);
  options.pollingRate = options.pollingRate || 100
  assert(options.isStillGrowing);
  assert(options.lastByteOfFile);
  options.endCallback = options.endCallback || function () {};
  options.onData = options.onData || function (data) {};

  fs.open(options.sourceFilePath, 'r', function (err, fd) {
    var readOffsetStart = 0;
    var readOffsetEnd   = 0;
    var buffer;
    function readData() {
      readOffsetEnd = options.lastByteOfFile();
      if (readOffsetEnd == readOffsetStart) {
        // if reading the file is faster than writing it
        setTimeout(readData, options.pollingRate);
        return;
      }
      buffer = new Buffer(readOffsetEnd - readOffsetStart);
      fs.read(fd, buffer, 0, buffer.length, readOffsetStart,
              function (err, bytesRead, buffer) {
        options.onData(buffer);
        readOffsetStart += bytesRead;
        if (options.isStillGrowing() || readOffsetStart != readOffsetEnd) {
          setTimeout(readData, options.pollingRate);
        } else {
          fs.closeSync(fd);
          options.endCallback();
        }
      });

    }
    readData();
  });
}
