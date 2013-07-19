#!/usr/bin/env node

// ##EZPAARSE

/*jslint node: true, maxlen: 150, maxerr: 50, indent: 2 */
'use strict';

var fs           = require('fs');
var Faker        = require('Faker');
var moment       = require('moment');
var StreamPT     = require('stream').PassThrough;
var csvextractor = require('./csvextractor.js');
var platformsDir = __dirname + '/../platforms/';

exports.logFaker = function (params, callback) {

  if (!params) {
    params = {};
  }
  var platforms = [];
  if (!params.platforms) {
    
    var stats;
    fs.readdirSync(platformsDir).forEach(function (item) {
      stats = fs.lstatSync(platformsDir + item);
      if (stats.isDirectory()) {
        platforms.push(item);
      }
    });
  } else {

    platforms = params.platforms;
  }

  var nb       = params.nb ? params.nb : 'nolimit';
  var rate     = params.rate ?  params.rate : 10;
  var duration = params.duration ? params.duration : 'nolimit';
  var stream   = new StreamPT();

  callback(stream);

  // stop url generation when the duration is expired
  if (duration != 'nolimit') {
    setTimeout(function () {
      nb = 0; // no more lines to generate
    }, duration * 1000);
  }

  // read the platform's urls
  var urlFiles = [];
  platforms.forEach(function (platform) {
    if (! /^[a-zA-Z0-9-_]+$/.test(platform)) {
      return;
    }
    var urlDir  = platformsDir + platform + '/test';
    var urlPFiles = fs.readdirSync(urlDir).filter(function (item) {
      return new RegExp('.csv$').test(item);
    });
    for (var i = 0, l = urlPFiles.length; i < l; i++) {
      urlPFiles[i] = urlDir + '/' + urlPFiles[i];
    }
    urlFiles = urlFiles.concat(urlPFiles);
  });

  // extract only urls from the csv files
  csvextractor.extract(urlFiles, ['url'], function (records) {

    var log            = {};
    var timeline_value = 0;
    var saturated      = false;
    var intervalId;

    // generate fake ip/login
    var nb_fake_ident = Math.max(10 * (nb == 'nolimit' ? 1000 : nb), 1000);
    var fakeident = [];
    while (nb_fake_ident-- > 0) {
      fakeident.push({
        ip: Math.floor(Math.random() * 255) + '.' +
            Math.floor(Math.random() * 255) + '.' +
            Math.floor(Math.random() * 255) + '.' +
            Math.floor(Math.random() * 255),
        login: Faker.Internet.userName().replace(/[^a-z_.]/i, '').toUpperCase()
      });
    }

    function interval() {
      intervalId = setInterval(function () {
        
        if (saturated) {
          clearInterval(intervalId);
        } else {
          if (nb == 'nolimit' || nb > 0) {

            // don't generate log lines with empty url
            if (log.url === '') {
              nb = nb == 'nolimit' ? nb : nb + 1;
              return;
            }
            
            // move the time forward (max +5 seconds)
            timeline_value += Math.floor(Math.random() * 5);
            
            // generate fake log data
            var ident = fakeident[Math.floor(Math.random() * (fakeident.length - 1))];
            log.ip    = ident.ip;
            log.login = ident.login;
            log.url   = records[Math.floor(Math.random() * (records.length - 1))].url;
            //[30/Nov/2012:00:17:37 +0100]
            log.date  = moment().subtract('days', 7).add('seconds', timeline_value).format('DD/MMM/YYYY:hh:mm:ss +0100');
            
            // write the log to stdout
            saturated = !stream.write(
              log.ip + ' - ' +
              log.login + ' [' +
              log.date + '] "GET ' +
              log.url + ' HTTP/1.1" 200 ' +
              Math.floor(Math.random() * 1000000) + '\n');
            
            nb = nb == 'nolimit' ? nb : nb - 1;
          } else {
            stream.end();
            clearInterval(intervalId);
          }
        }
      }, 1000 / rate);
    }
    
    stream.on('drain', function () {
      saturated = false;
      interval();
    });

    interval();
  });
}