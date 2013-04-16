#!/usr/bin/env node

/*jslint node: true, maxlen: 180, maxerr: 50, indent: 2 */
'use strict';
var byline      = require('byline');
var URL         = require('url');
var querystring = require('querystring');

function parseUrl(url) {
  var result    = {};
  var parsedUrl = URL.parse(url);
  var param     = querystring.parse(parsedUrl.query);
  var domain    = parsedUrl.hostname;
  result.pid    = domain;

  var match;
  if (param.url) {
    url = param.url;
  }
  if (param.option && param.options == 'com_journals') {
    result.type = 'TOC';
  } else if ((match = /\/articles\/([a-zA-Z0-9]+)\/abs\/([0-9]{4}\/[0-9]{2}|first)\/contents\/contents.html$/.exec(url)) !== null) {
    result.type = 'TOC';
  } else if ((match = /\/articles\/([a-zA-Z0-9]+)\/(abs|full_html|ref|olm)\/([0-9]{4}\/[0-9]{2}|first)\/[a-z0-9\-]+\/[a-z0-9\-]+.html$/.exec(url)) !== null) {
    switch (match[2]) {
    case 'abs':
      result.type = 'ABS';
      break;
    case 'full_html':
      result.type = 'TXT';
      break;
    case 'ref':
      result.type = 'REF';
      break;
    case 'olm':
      result.type = 'OLM';
      break;
    }
  } else if ((match = /\/articles\/([a-zA-Z0-9]+)\/pdf\/([0-9]{4}\/[0-9]{2}|first)\/[a-z0-9\-]+.pdf$/.exec(url)) !== null) {
    result.type = 'PDF';
  } else {
    if ((match = /\/action\/([a-zA-Z]+)/.exec(url)) !== null) {
      switch (match[1]) {
      case 'displayJournal':
        result.type = 'TOC';
        break;
      case 'displayFulltext':
        if (param.pdftype) {
          result.type = 'PDF';
        } else {
          result.type = 'REF';
        }
        break;
      case 'displayAbstract':
        result.type = 'ABS';
        if (param.fileId) {
          result.issn = param.fileId.substr(1, 4) + '-' + param.fileId.substr(5, 4);
        }
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
