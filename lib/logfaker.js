#!/usr/bin/env node

// ##EZPAARSE

'use strict';

var fs           = require('fs');
var path         = require('path');
var Faker        = require('Faker');
var moment       = require('moment');
var StreamPT     = require('stream').PassThrough;
var csvextractor = require('./csvextractor.js');
var platformsDir = path.join(__dirname, '/../platforms');

exports.logFaker = function (params, callback) {

  if (!params) {
    params = {};
  }
  var platforms = [];
  if (!params.platforms) {
    
    var stats;
    fs.readdirSync(platformsDir).forEach(function (item) {
      stats = fs.lstatSync(path.join(platformsDir, item));
      if (stats.isDirectory()) {
        platforms.push(item);
      }
    });
  } else {

    platforms = params.platforms;
  }

  var nb              = params.nb       || 'nolimit';
  var rate            = params.rate     || 10;
  var nbIntervals     = Math.ceil(rate / 800);
  var ratePerInterval = 1000 / rate * nbIntervals;
  var duration        = params.duration || 'nolimit';
  var stream          = new StreamPT();

  callback(stream);

  // read the platform's urls
  var urlFiles = [];
  platforms.forEach(function (platform) {
    if (!/^[a-zA-Z0-9-_]+$/.test(platform)) {
      return;
    }
    var urlDir    = path.join(platformsDir, platform, '/test');
    var urlPFiles = fs.readdirSync(urlDir).filter(function (item) {
      return (path.extname(item) == '.csv');
    });
    for (var i = 0, l = urlPFiles.length; i < l; i++) {
      urlFiles.push(path.join(urlDir, urlPFiles[i]));
    }
  });

  // extract only urls from the csv files
  csvextractor.extract(urlFiles, ['url'], function (records) {

    var timelineValue = 0;
    var saturated     = false;
    var date          = moment().subtract('days', 7);
    var intervalIds   = [];
    var random;
    var timeoutId;

    // var nbFakeIdent = Math.max(10 * (nb == 'nolimit' ? 1000 : nb), 1000);
    var nbFakeIdent = 1500;
    var fakeRange   = nbFakeIdent - 1;
    var fakeips     = [];
    var fakelogins  = [];
    var urls        = [];

    // Store URLs into an array, faster
    records.forEach(function (record) {
      urls.push(record.url);
    });
    var urlRange = urls.length - 1;

    while (nbFakeIdent-- > 0) {
      fakeips.push(Math.floor(Math.random() * 255) + '.' +
                   Math.floor(Math.random() * 255) + '.' +
                   Math.floor(Math.random() * 255) + '.' +
                   Math.floor(Math.random() * 255));
      fakelogins.push(Faker.Internet.userName().replace(/[^a-z_.]/i, '').toUpperCase());
    }

    // stop url generation when the duration is expired
    if (duration != 'nolimit') {
      timeoutId = setTimeout(function () {
        nb = 0; // no more lines to generate
      }, duration * 1000);
    }

    function launchInterval() {
      intervalIds.push(setInterval(function () {
        if (saturated) {
          intervalIds.forEach(function (id) {
            clearInterval(id);
          });
        } else {
          if (nb == 'nolimit' || nb > 0) {
            
            random  = Math.floor(Math.random() * fakeRange);

            // move the time forward (max +5 seconds)
            timelineValue = Math.floor(Math.random() * 5);
            date.add('seconds', timelineValue);
            
            // write the log to stdout
            saturated = !stream.write(
              fakeips[random] + ' - ' +
              fakelogins[random] + ' [' +
              date.format('DD/MMM/YYYY:HH:mm:ss +0100') + '] "GET ' +
              urls[Math.floor(Math.random() * urlRange)] + ' HTTP/1.1" 200 ' +
              Math.floor(Math.random() * 1000000) + '\n');
            
            if (nb != 'nolimit') { nb--; }
          } else {
            clearTimeout(timeoutId);
            intervalIds.forEach(function (id) {
              clearInterval(id);
            });
            stream.end();
          }
        }
      }, ratePerInterval));
    }

    function start() {
      for (var i = nbIntervals; i > 0; i--) {
        launchInterval();
      }
    }
    
    stream.on('drain', function () {
      saturated = false;
      start();
    });

    start();
  }, { silent: true });
};