#!/usr/bin/env node

// ##EZPAARSE

/*jslint node: true, maxlen: 180, maxerr: 50, indent: 2 */

/**
 * parser for acs platform
 * http://analogist.couperin.org/platforms/acs/
 */
'use strict';
var byline = require('byline');
var URL = require('url');

function parseUrl(url) {
  var result = {};
  var path   = decodeURIComponent(URL.parse(url).path);

  //console.log(path);
  
  var match;

  if ((match = /\/journal\/([a-z]+[0-9]?)$/.exec(path)) !== null) {
    // /journal/achre4
    result.pid = match[1];
    result.rtype = 'TOC';
    result.mime = 'MISC';
  } else if ((match = /\/loi\/([a-z]+[0-9]?)$/.exec(path)) !== null) {
    // /loi/achre4
    result.pid = match[1];
    result.rtype = 'TOC';
    result.mime = 'MISC';
  } else if ((match = /\/toc\/([a-z]+[0-9]?)\/current$/.exec(path)) !== null) {
    // /toc/achre4/current
    result.unitid = match[1] + "/current";
    result.pid = match[1];
    result.rtype = 'TOC';
    result.mime = 'MISC';
  } else if ((match = /\/toc\/([a-z]+[0-9]?)\/([0-9]+)\/([0-9]+)$/.exec(path)) !== null) {
    // /toc/achre4/46/4
    result.unitid = match[1] + "/" + match[2] + '/' + match[3];
    result.pid = match[1];
    result.rtype = 'TOC';
    result.mime = 'MISC';
  } else if ((match = /^\/doi\/abs\/([0-9]{2}\.[0-9]{4})\/([^.]+)$/.exec(path)) !== null) {
    // /doi/abs/10.1021/ar400025e
    result.unitid = match[1] + "/" + match[2];
    result.pid = match[1];
    result.rtype = 'ABS';
    result.mime = 'MISC';
  } else if ((match = /^\/doi\/ipdf\/([0-9]{2}\.[0-9]{4})\/([^.]+)$/.exec(path)) !== null) {
    // /doi/ipdf/10.1021/ar400025e
    result.unitid = match[1] + "/" + match[2] ;
    result.pid = match[1];
    result.rtype = 'ARTICLE';
    result.mime = 'MISC';
  } else if ((match = /^\/doi\/pdf\/([0-9]{2}\.[0-9]{4})\/([^.]+)$/.exec(path)) !== null) {
    // /doi/pdf/10.1021/ar400025e
    result.unitid = match[1] + "/" + match[2] ;
    result.pid = match[1];
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
  } else if ((match = /^\/doi\/pdfplus\/([0-9]{2}\.[0-9]{4})\/([^.]+)$/.exec(path)) !== null) {
    // /doi/pdfplus/10.1021/ar400025e
    result.unitid = match[1] + "/" + match[2] ;
    result.pid = match[1];
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
  } else if ((match = /^\/doi\/full\/([0-9]{2}\.[0-9]{4})\/([^.]+)$/.exec(path)) !== null) {
    // /doi/full/10.1021/ar400025e
    result.unitid = match[1] + "/" + match[2] ;
    result.pid = match[1];
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
  } else if ((match = /^\/isbn\/([0-9]{13})$/.exec(URL.parse(url).pathname)) !== null) {
    // /isbn/9780841229105
    result.pid = match[1];
    result.rtype = 'TOC';
    result.mime = 'MISC';
  } else if ((match = /^\/doi\/pdf\/([0-9]{2}\.[0-9]{4})\/bk-([0-9]{4})-([0-9]+)\.([a-z0-9]+)$/.exec(path)) !== null) {
    // /doi/pdf/10.1021/bk-2012-1121.ch001
    result.pid = match[1];
    result.rtype = 'BOOK_SECTION';
    result.mime = 'PDF';
  } else if ((match = /^\/doi\/pdfplus\/([0-9]{2}\.[0-9]{4})\/bk-([0-9]{4})-([0-9]+)\.([a-z0-9]+)$/.exec(path)) !== null) {
    // /doi/pdfplus/10.1021/bk-2012-1121.ch001
    result.pid = match[1];
    result.rtype = 'BOOK_SECTION';
    result.mime = 'PDF';
  } else if ((match = /^\/doi\/full\/([0-9]{2}\.[0-9]{4})\/bk-([0-9]{4})-([0-9]+)\.([a-z0-9]+)$/.exec(path)) !== null) {
    // /doi/full/10.1021/bk-2012-1121.ch001
    result.pid = match[1];
    result.rtype = 'BOOK_SECTION';
    result.mime = 'HTML';
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
      stdout.write(JSON.stringify(parseUrl(line.toString())) + '\n');
    });
  }
};

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
