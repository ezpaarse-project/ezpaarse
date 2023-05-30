#!/usr/bin/env node
/* eslint no-sync: 0 */
// ##EZPAARSE

'use strict';

var fs           = require('fs-extra');
var path         = require('path');
var faker        = require('@faker-js/faker').faker;
var moment       = require('moment');
var StreamPT     = require('stream').PassThrough;
var csvextractor = require('./csvextractor.js');
var platformsDir = path.join(__dirname, '/../platforms');

exports.logFaker = function (params, callback) {

  if (!params) { params = {}; }

  var platforms = [];
  if (params.platforms) {
    platforms = params.platforms;
  } else {
    fs.readdirSync(platformsDir).forEach(function (item) {
      var stats = fs.lstatSync(path.join(platformsDir, item));
      if (stats.isDirectory()) {
        platforms.push(item);
      }
    });
  }

  var nb       = params.nb       || 'nolimit';
  var rate     = params.rate     || 10;
  var interval = 1000000000 / rate;
  var duration = params.duration || 'nolimit';
  var stream   = new StreamPT();

  // read the platform's urls
  var urlFiles = [];
  platforms.forEach(function (platform) {
    if (!/^[a-zA-Z0-9-_]+$/.test(platform)) { return; }

    var urlDir    = path.join(platformsDir, platform, '/test');
    var urlPFiles = fs.readdirSync(urlDir).filter(function (item) {
      return (path.extname(item) == '.csv');
    });
    for (var i = 0, l = urlPFiles.length; i < l; i++) {
      urlFiles.push(path.join(urlDir, urlPFiles[i]));
    }
  });

  // extract only urls from the csv files
  csvextractor.extract(urlFiles, { silent: true, fields: ['in-url'] }, function (err, records) {

    var timelineValue = 0;
    var saturated     = false;
    var date          = moment().subtract(7, 'days');
    var random;

    // var nbFakeIdent = Math.max(10 * (nb == 'nolimit' ? 1000 : nb), 1000);
    var nbFakeIdent = 1500;
    var fakeRange   = nbFakeIdent - 1;
    var fakeips     = [];
    var fakelogins  = [];
    var urls        = [];

    // Store URLs into an array, faster
    records.forEach(function (record) {
      urls.push(record['in-url']);
    });
    var urlRange = urls.length - 1;

    while (nbFakeIdent-- > 0) {
      fakeips.push(Math.floor(Math.random() * 255) + '.' +
                   Math.floor(Math.random() * 255) + '.' +
                   Math.floor(Math.random() * 255) + '.' +
                   Math.floor(Math.random() * 255));
      fakelogins.push(faker.internet.userName().replace(/[^a-z_.]/i, '').toUpperCase());
    }

    // stop url generation when the duration is expired
    if (duration != 'nolimit') {
      setTimeout(function () {
        nb = 0; // no more lines to generate
      }, duration * 1000);
    }

    var lastTime = process.hrtime();
    var elapsed;
    function updateTime() {
      elapsed  = process.hrtime(lastTime);
      if ((elapsed[0] * 1e9 + elapsed[1]) > interval) {
        lastTime = process.hrtime();
        return true;
      }
      return false;
    }

    function run() {
      if (saturated) { return; }

      if (nb == 'nolimit' || nb > 0) {
        if (updateTime()) {
          random  = Math.floor(Math.random() * fakeRange);

          // move the time forward (max +5 seconds)
          timelineValue = Math.floor(Math.random() * 5);
          date.add(timelineValue, 'seconds');

          // write the log to stdout
          saturated = !stream.write(
            fakeips[random] + ' - ' +
            fakelogins[random] + ' [' +
            date.format('DD/MMM/YYYY:HH:mm:ss +0100') + '] "GET ' +
            urls[Math.floor(Math.random() * urlRange)] + ' HTTP/1.1" 200 ' +
            Math.floor(Math.random() * 1000000) + '\n');

          if (nb != 'nolimit') { nb--; }
        }
        setImmediate(run);
      } else {
        stream.end();
      }
    }

    stream.on('drain', function () {
      saturated = false;
      run();
    });

    run();
  });

  callback(stream);
};
