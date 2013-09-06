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
  var id, jrp;

  if ((match = /\/weblextenso\/article\/afficher/.exec(url)) !== null) {
    // http://www.lextenso.fr/weblextenso/article/afficher
    if (param['id']) {
      id = param['id'];
      if ((match = /([A-Z]+)([0-9]+)-([^\-]+)-([^\-]+)/.exec(id)) !== null) {
        // http://www.lextenso.fr/weblextenso/article/afficher?id=CAPJA2013-1-002&d=3575203170535
        result.pid = match[1];
        result.rtype = 'ARTICLE';
        result.mime = 'HTML';
      } else if ((match = /^(C[A-Z0-9]+)/.exec(id)) !== null) {
        // http://www.lextenso.fr/weblextenso/article/afficher?id=C010IXCXCX2001X12X01X00177X053&origin=recherche;1&d=3575204329777
        jrp = match[1].split('X');
        // TODO : confirm pid value for jurisprudence
        result.pid = match[1];
        result.rtype = 'JURISPRUDENCE';
        result.mime = 'HTML';
      } else {
        console.log('unrecognized id : ' + id);
      }
      if (param['d']) {
        result.unitid = param['d'];
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
