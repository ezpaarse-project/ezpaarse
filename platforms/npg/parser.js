#!/usr/bin/env node

// ##EZPAARSE

/*jslint node: true, maxlen: 180, maxerr: 50, indent: 2 */
'use strict';

var byline = require('byline');
var URL = require('url');
var querystring = require('querystring');

function parseUrl(url) {
  var result = {};
  var param = querystring.parse(URL.parse(url).query);
  //console.log(URL.parse(url));
  var path = URL.parse(url).path;
  
  var match;
  if ((match = /\/([a-zA-Z0-9]+)\/journal\/v([0-9]*)\/n([0-9]*)\/(pdf|full)\/([a-zA-Z0-9]*).(pdf|html)/.exec(url)) !== null) {
    result.pid = match[1];
    //result.volume = match[2];
    //result.numero = match[3];
    //result.revue  = match[5];
    if (match[4].toUpperCase() == "FULL") {
      // example : http://www.nature.com.gate1.inist.fr/nature/journal/v493/n7431/full/493166a.html
      // result.unitid = match[5];
      result.rtype = 'ARTICLE';
      result.mime = 'HTML';
    } else {
      // example : http://www.nature.com.gate1.inist.fr/nature/journal/v493/n7431/pdf/493166a.pdf
      // result.unitid = match[5];
      result.rtype = 'ARTICLE';
      result.mime = 'PDF';
    }
  } else if ((match = /\/([a-zA-Z0-9]+)\/knowledgeenvironment\/([0-9]*)\/([0-9]*)\/[a-zA-Z0-9]+\/(pdf|full)\/([a-zA-Z0-9]*).(pdf|html)/.exec(url)) !== null) {
    result.pid = match[1];
    //result.volume = match[2];
    //result.numero = match[3];
    //result.revue  = match[5];
    if (match[4].toUpperCase() == "FULL") {
      // example : http://www.nature.com.gate1.inist.fr/bonekey/knowledgeenvironment/2012/120613/bonekey2012109/full/bonekey2012109.html
      // result.unitid = match[5];
      result.rtype = 'ARTICLE';
      result.mime = 'HTML';
    } else {
      // example : http://www.nature.com.gate1.inist.fr/bonekey/knowledgeenvironment/2012/120613/bonekey2012109/pdf/bonekey2012109.html
      // result.unitid = match[5];
      result.rtype = 'ARTICLE';
      result.mime = 'PDF';
    }
  } else if ((match = /\/([a-zA-Z0-9]+)\/journal\/v([0-9]*)\/n([a-zA-Z0-9]*)\/index.html/.exec(url)) !== null) {
    // example http://www.nature.com.gate1.inist.fr/nature/journal/v493/n7431/index.html
    result.pid = match[1];
    //result.volume = match[2];
    //result.numero = match[3];
    //result.unitid = 'v' + match[2] + '/n' + match[3];
    result.rtype = 'TOC';
    result.mime = 'MISC';
  } else if ((match = /^\/([a-zA-Z0-9]+)\/index.html/.exec(path)) !== null) {
    // example : http://www.nature.com.gate1.inist.fr/nature/index.html
    result.pid = match[1];
    result.rtype = 'TOC';
    result.mime = 'MISC';
  } else if ((match = /^\/([a-zA-Z0-9]+)\/archive\/index.html/.exec(path)) !== null) {
    // example : http://www.nature.com/clpt/archive/index.html?showyears=2013-2011-#y2011
    result.pid = match[1];
    result.rtype = 'TOC';
    result.mime = 'MISC';
  } else if ((match = /\/([a-zA-Z0-9]+)\/current_issue.html/.exec(url)) !== null) {
    // example : http://www.nature.com.gate1.inist.fr/nature/current_issue.html
    result.pid = match[1];
    result.rtype = 'TOC';
    result.mime = 'MISC';
  } else if ((match = /\/news\//.exec(url)) !== null) {
    // example : http://www.nature.com/news/work-resumes-on-lethal-flu-strains-1.12266
    result.pid = 'nature';
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
  } else if ((match = /\/polopoly_fs\//.exec(url)) !== null) {
    // example : http://www.nature.com/polopoly_fs/1.12266
    result.pid = 'nature';
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
  } else if ((match = /\/siteindex\/index.html/.exec(url)) !== null) {
    // example : http://www.nature.com.gate1.inist.fr/siteindex/index.html
    result.rtype = 'TOC';
    result.mime = 'MISC';
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
