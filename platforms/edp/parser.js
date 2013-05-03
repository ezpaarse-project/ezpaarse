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
  var param     = querystring.parse(parsedUrl.query);
  var domain    = parsedUrl.hostname;
  result.pid    = domain;

  var match;
  if (param.url) {
    url = param.url;
  }
  if (param.option && param.option == 'com_journals') {
    // example : http://publications.edpsciences.org.gate1.inist.fr/index.php?option=com_journals
    result.rtype = 'TOC';
    result.mime = 'MISC';
  } else if ((match = /\/articles\/([a-zA-Z0-9]+)\/abs\/([0-9]{4}\/[0-9]{2}|first)\/contents\/contents.html$/.exec(url)) !== null) {
    // example : http://www.apidologie.org/index.php?option=com_toc&url=/articles/apido/abs/2010/06/contents/contents.html
    // result.unitid = match[2];
    result.rtype = 'TOC';
    result.mime = 'MISC';
  } else if ((match = /\/articles\/([a-zA-Z0-9]+)\/(abs|full_html|ref)\/([0-9]{4}\/[0-9]{2}|first)(\/[a-z0-9\-]+)\/[a-z0-9\-]+.html$/.exec(url)) !== null) {
    switch (match[2]) {
    case 'abs':
      // example : http://www.apidologie.org/index.php?option=com_article&url=/articles/apido/abs/2010/06/m08176/m08176.html
      // result.unitid = match[2]+match[3];
      result.rtype = 'ABS';
      result.mime = 'MISC';
      break;
    case 'full_html':
      // example : http://www.apidologie.org/index.php?option=com_article&url=/articles/apido/full_html/2010/06/m08176/m08176.html
      // result.unitid = match[2]+match[3];
      result.rtype = 'ARTICLE';
      result.mime = 'HTML';
      break;
    case 'ref':
      // example http://www.apidologie.org/index.php?option=com_article&url=/articles/apido/ref/2010/06/m09075/m09075.html
      // result.unitid = match[2]+match[3];
      result.rtype = 'REF';
      result.mime = 'MISC';
      break;
    }
  } else if ((match = /\/articles\/([a-zA-Z0-9]+)\/pdf\/([0-9]{4}\/[0-9]{2}|first)(\/[a-z0-9\-]+).pdf$/.exec(url)) !== null) {
    // example : http://www.apidologie.org/articles/apido/pdf/2010/06/m08176.pdf
    // result.unitid = match[2]+match[3];
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
  } else {
    if ((match = /\/action\/([a-zA-Z]+)/.exec(url)) !== null) {
      switch (match[1]) {
      case 'displayJournal':
        // example : http://www.epjap.org/action/displayJournal?jid=JAP
        result.rtype = 'TOC';
        result.mime = 'MISC';
        break;
      case 'displayFulltext':
        if (param.pdftype) {
          // example : http://www.epjap.org/action/displayFulltext?type=1&pdftype=1&fid=8820898&jid=JAP&volumeId=61&issueId=01&aid=8820896
          // if (param.aid) result.unitid = param.aid;
          result.rtype = 'ARTICLE';
          result.mime = 'PDF';
        } else {
          // example : http://www.epjap.org/action/displayFulltext?type=8&fid=8820897&jid=JAP&volumeId=61&issueId=01&aid=8820896
          // if (param.aid) result.unitid = param.aid;
          result.rtype = 'REF';
          result.mime = 'MISC';
        }
        break;
      case 'displayAbstract':
        // example : http://www.epjap.org/action/displayAbstract?fromPage=online&aid=8820896&fulltextType=RA&fileId=S1286004212303182
        // if (param.aid) result.unitid = param.aid;
        result.rtype = 'ABS';
        result.mime = 'MISC';
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
