#!/usr/bin/env node

// ##EZPAARSE

/*jslint node: true, maxlen: 150, maxerr: 50, indent: 2 */
'use strict';
var byline      = require('byline');
var URL         = require('url');
var querystring = require('querystring');

/**
 * Specific part of the parser.
 * To be adapted. Depends on each platform.
 */
function parseUrl(url) {
  var result    = {};
  var parsedUrl = URL.parse(url);
  var param     = querystring.parse(parsedUrl.query);
  var path      = parsedUrl.path;
  
  //console.error(parsedUrl);
  //console.error(param);
  
  var match;
  var split;
  
  if (parsedUrl.pathname == '/numero.php') {
    // example: http://www.cairn.info/numero.php?ID_REVUE=ARSS&ID_NUMPUBLIE=ARSS_195&AJOUTBIBLIO=ARSS_195_0012
    if (param.ID_REVUE) {
      result.pid = param.ID_REVUE;
      // result.unitid = param.ID_REVUE;
    }
    
    if (param.AJOUTBIBLIO) {
      result.rtype = 'BOOKMARK';
      result.mime = 'MISC';
      // result.unitid = param.AJOUTBIBLIO; // plus précis que le précédent
    }
  } else if (parsedUrl.pathname == '/load_pdf.php') {
    // journal article example: http://www.cairn.info/load_pdf.php?ID_ARTICLE=ARSS_195_0012
    // book section example: http://www.cairn.info/load_pdf.php?ID_ARTICLE=ERES_DUMEZ_2003_01_0009
    if (param.ID_ARTICLE) {
      // result.unitid = param.ID_ARTICLE;
      if ((match = /[A-Z]+/.exec(param.ID_ARTICLE.split('_')[1])) !== null) {
        //case of a book section pdf event
        split = param.ID_ARTICLE.split('_');
        result.pid = split[0] + "_" +
                     split[1] + "_" +
                     split[2] + "_" +
                     split[3];
        result.rtype = 'BOOK_SECTION';
        result.mime = 'PDF';
      } else {
        // case of journal article
        // pid is the first part of ID_ARTICLE ("_" character is the separator)
        result.pid = param.ID_ARTICLE.split('_')[0];
        result.rtype = 'ARTICLE';
        result.mime = 'PDF';
      }
    }
  } else if  (parsedUrl.pathname == '/resume.php') {
    // example: http://www.cairn.info/resume.php?ID_ARTICLE=ARSS_195_0012
    if (param.ID_ARTICLE) {
      // pid is the first part of ID_ARTICLE ("_" character is the separator)
      result.pid = param.ID_ARTICLE.split('_')[0];
      // result.unitid = param.ID_ARTICLE;
    }
    result.rtype = 'ABS';
    result.mime = 'MISC';
  } else if  (parsedUrl.pathname == '/feuilleter.php') {
    // leaf-through a book section, in a flash player
    // example: http://www.cairn.info/feuilleter.php?ID_ARTICLE=PUF_MAZIE_2010_01_0003
    if (param.ID_ARTICLE) {
      // pid is the concatenation of the first to the forelast part of the ID_ARTICLE parameter
      // result.unitid = param.ID_ARTICLE;
      split = param.ID_ARTICLE.split('_');
      result.pid = split[0] + "_" +
                   split[1] + "_" +
                   split[2] + "_" +
                   split[3];
      result.rtype = 'BOOK_SECTION';
      result.mime = 'MISC';
    }
  } else if ((match = /^\/(revue\-|magazine\-)([a-z0-9@\-]+)(\-[0-9]{4}\-[0-9]+\-page\-[0-9]+)\.htm$/.exec(parsedUrl.pathname)) !== null) {
    // journal example: http://www.cairn.info/revue-actes-de-la-recherche-en-sciences-sociales-2012-5-page-4.htm
    // result.unitid = match[1] + match[2] + match[3];
    result.pid = match[1] + match[2];
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
  } else if ((match = /^\/(revue\-|magazine\-)([a-z0-9@\-]+)(\-[0-9]{4}\-[0-9]+\-p\-[0-9]+)\.htm$/.exec(parsedUrl.pathname)) !== null) {
    // journal example: http://www.cairn.info/revue-actes-de-la-recherche-en-sciences-sociales-2012-5-p-4.htm
    // result.unitid = match[1] + match[2] + match[3];
    result.pid = match[1] + match[2];
    result.rtype = "PREVIEW";
    result.mime = 'MISC';
  } else if ((match = /^\/(revue\-|magazine\-)([a-z0-9@\-]+)(\-[0-9]{4}\-[0-9]+)\.htm$/.exec(parsedUrl.pathname)) !== null) {
    // journal example: http://www.cairn.info/revue-a-contrario-2012-2.htm
    // result.unitid = match[1] + match[2] + match[3];
    result.pid = match[1] + match[2];
    result.rtype = "TOC";
    result.mime = 'MISC';
  } else if ((match = /^\/(revue\-|magazine\-)([a-z0-9@\-]+)\.htm$/.exec(parsedUrl.pathname)) !== null) {
    // journal example: http://www.cairn.info/revue-a-contrario.htm
    // result.unitid = match[1] + match[2];
    result.pid = match[1] + match[2];
    result.rtype = "TOC";
    result.mime = 'MISC';
  } else if ((match = /^\/[a-z0-9@\-]+\-\-([0-9]{13})(\-page\-[0-9]+).htm$/.exec(parsedUrl.pathname)) !== null) {
    // book example: http://www.cairn.info/a-l-ecole-du-sujet--9782749202358-page-9.htm
    // result.unitid = match[1] + match[2];
    result.isbn = match[1];
    result.rtype = "BOOK_SECTION";
    result.mime = 'HTML';
  } else if ((match = /^\/[a-z0-9@\-]+\-\-([0-9]{13})(\-p\-[0-9]+).htm$/.exec(parsedUrl.pathname)) !== null) {
    // book example: http://www.cairn.info/a-l-ecole-du-sujet--9782749202358-p-9.htm
    // result.unitid = match[1] + match[2];
    result.isbn = match[1];
    result.rtype = "PREVIEW";
    result.mime = 'MISC';
  } else if ((match = /^\/[a-z0-9@\-]+\-\-([0-9]{13}).htm$/.exec(parsedUrl.pathname)) !== null) {
    // book example: http://www.cairn.info/a-l-ecole-du-sujet--9782749202358.htm
    // result.unitid = match[1];
    result.isbn = match[1];
    result.rtype = "TOC";
    result.mime = 'MISC';
  }
  return result;
}

/**
 * If an array of urls is given, return an array of results
 * Otherwise, read stdin and write into stdout
 * This is the entry point of the program.
 * Generic part of the parser: should not be changed.
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

    stream.on('close', function () {
      process.exit(0);
    });

    stream.on('data', function (line) {
      stdout.write(JSON.stringify(parseUrl(line)) + '\n');
    });
  }
}

// when the parser is called from command line
// (standalone version)
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
