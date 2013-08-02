#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var byline = require('byline');
var URL = require('url');
var querystring = require('querystring');

function parseUrl(url) {
  var result = {};
  var param = querystring.parse(URL.parse(url).query);
  
  var match;
  if ((match = /\/droit\/results\/docview\/docview/.exec(url)) !== null) {
    // http://www.lexisnexis.com/fr/droit/results/docview/docview.do?docLinkInd=true
    // &risb=21_T17183418923&format=GNBFULL&sort=DATE-PUBLICATION,D,H,$PSEUDOXAB,A,H,TYPE-ARTICLE,A,H
    // &startDocNo=1&resultsUrlKey=29_T17183418941&cisb=22_T17183418938&treeMax=true&treeWidth=0&csi=294776&docNo=3
    if (param['risb']) {
      result.pid = param['risb'];
      result.unitid = param['risb'];
    }
    if (param['format']) {
      switch (param['format']) {
      case 'GNBFULL':
        result.rtype = 'ARTICLE';
        result.mime = 'HTML';
        break;
      case 'AUTRECAS':
        result.rtype = 'ARTICLE';
        result.mime = 'HTML';
        break;
      default:
        console.log("Unknown matching format : " + param['format'] + "\n");
        break;
      }
    }
  }

  return result;
}

/*
* If an array of urls is given, return an array of results
* Otherwise, read stdin and write into stdout
*/
exports.parserExecute = function (urls) {

  if (urls && Array.isArray(urls)) {
    var results = [];
    for (var i = 0, l = urls.length; i < l; i++) {
      results.push(parseUrl(urls[i]));
    }
    return results;
  } else {
    var stdin = process.stdin;
    var stdout = process.stdout;
    var stream = byline.createStream(stdin);

    stream.on('end', function () {
      process.exit(0);
    });

    stream.on('close  ', function () {
      process.exit(0);
    });

    stream.on('data', function (line) {
      stdout.write(JSON.stringify(parseUrl(line)) + '\n');
    });
  }
}

if (!module.parent) {
  var optimist = require('optimist')
    .usage('Parse URLs read from standard input. ' +
      'You can either use pipes or enter URLs manually.' +
      '\n  Usage: $0' +
      '\n  Example: cat urls.txt | $0');
  var argv = optimist.argv;

  // show usage if --help option is used
  if (argv.help || argv.h) {
    optimist.showHelp();
    process.exit(0);
  }

  exports.parserExecute();
}
