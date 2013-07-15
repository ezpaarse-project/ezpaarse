#!/usr/bin/env node

// ##EZPAARSE

/*jslint node: true, maxlen: 180, maxerr: 50, indent: 2 */
'use strict';
var byline      = require('byline');
var URL         = require('url');
var querystring = require('querystring');

function parseUrl(url) {
  var result    = {};
  var parsedUrl = URL.parse(url);
  var param     = querystring.parse(parsedUrl.query)
  var path      = '';
  try {
    path = decodeURIComponent(parsedUrl.path);
  } catch (e) {}
  var match;
  
  if ((match = /\/journal(\/volumesAndIssues)?\/([0-9]+)/.exec(path)) !== null) {
    // example : http://link.springer.com.gate1.inist.fr/journal/10696
    // other example : http://link.springer.com.gate1.inist.fr/journal/volumesAndIssues/436
    result.pid  = match[2];
    result.unitid = match[2];
    result.rtype = 'TOC';
    result.mime = 'MISC';
  } else if ((match = /^\/(article|book|protocol)\/([0-9]+\.[0-9]+\/[^\/]*)(\/page\/[0-9]+)?(\/fulltext.html)?/.exec(path)) !== null) {
    result.doi  = match[2];
    if (match[3]) {
      result.unitid = match[2] + match[3];
    } else {
      result.unitid = match[2];
    }
    switch (match[1]) {
    case 'article':
      if (match[4]) {
        // example : http://link.springer.com.gate1.inist.fr/article/10.1007/s10696-011-9117-0/fulltext.html
        result.rtype = 'ARTICLE';
        result.mime = 'HTML';
      } else {
        // example : http://link.springer.com.gate1.inist.fr/article/10.1007/s10696-011-9117-0
        result.rtype = 'ABS';
        result.mime = 'MISC';
      }
      break;
    case 'book':
      // example : http://link.springer.com.gate1.inist.fr/book/10.1007/BFb0009075/page/1
    case 'protocol':
      // example : http://link.springer.com/protocol/10.1007/978-1-61779-998-3_39
      result.rtype = 'BOOK';
      result.mime = 'HTML';
      break;
    }
  } else if ((match = /^\/content\/pdf\/([0-9]+\.[0-9]+\/[^\/]*)/.exec(path)) !== null) {
    // example : http://link.springer.com.gate1.inist.fr/content/pdf/10.1007/s00359-010-0615-4
    result.doi  = match[1];
    result.unitid = match[1];
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
  } else if ((match = /^\/content\/([0-9]{4}-[0-9]{4})/.exec(path)) !== null) {
    // example : http://www.springerlink.com.gate1.inist.fr/content/1590-4261
    result.issn  = match[1];
    result.unitid = match[1];
    result.rtype = 'TOC';
    result.mime = 'MISC';
  } else if ((match = /^\/content\/([a-zA-Z0-9]+)(\/fulltext.pdf)?/.exec(path)) !== null) {
    // example : http://www.springerlink.com.gate1.inist.fr/content/1643m244v35p35n5/
    // other example : http://www.springerlink.com.gate1.inist.fr/content/m181480225654444/fulltext.pdf
    result.unitid = match[1];
    result.rtype = 'ABS';
    result.mime = 'MISC';
  } else if ((match = /^\/chapter\/([0-9]+\.[0-9]+\/[^\/]*)/.exec(path)) !== null) {
    // example : http://link.springer.com.gate1.inist.fr/chapter/10.1007/978-3-540-71233-6_4
    result.doi  = match[1];
    result.unitid = match[1];
    result.rtype = 'ABS';
    result.mime = 'MISC';
  } else if ((match = /^\/(book)?series\/([0-9]+)/.exec(path)) !== null) {
    // example : http://link.springer.com.gate1.inist.fr/bookseries/7651
    // other example : http://www.springer.com.gate1.inist.fr/series/7651
    result.pid  = match[2];
    result.unitid = match[2];
    result.rtype = 'BOOKSERIE';
    result.mime = 'MISC';
  } else if ((match = /^\/openurl.asp/.exec(path)) !== null) {
    if (param.genre && param.genre == 'journal') {
      // example : http://www.springerlink.com.gate1.inist.fr/openurl.asp?genre=journal&issn=1633-8065
      if (param.issn) {
        result.issn = param.issn;
        result.unitid = param.issn;
      }
      result.rtype = 'TOC';
      result.mime = 'MISC';
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
