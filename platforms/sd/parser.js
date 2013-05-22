#!/usr/bin/env node

// ##EZPAARSE

/*jslint node: true, maxlen: 150, maxerr: 50, indent: 2 */
'use strict';
var byline      = require('byline');
var URL         = require('url');
var querystring = require('querystring');

function parseUrl(url) {
  var result  = {};
  var param   = querystring.parse(URL.parse(url).query);
  var match;
  
  if (param._ob) {
    if (param._cdi) {
      result.pid = param._cdi;
    }
    switch (param._ob) {
    case 'IssueURL':
      // The CDI is the 2nd parameter of _tockey (params separated by '#')
      var arg = param._tockey.split('#');
      result.pid = arg[2];
      // Set consultation type to TableOfContent (TOC)
      result.rtype = 'TOC';
      result.mime = 'MISC';
      break;
    case 'ArticleURL':
      // Summary of full text
      if (param._fmt) {
        switch (param.fmt) {
        case 'summary':
          // Set consultation type to Summary
          result.rtype = 'ABS';
          result.mime = 'MISC';
          break;
        case 'full':
          // Set consultation type to Text
          result.rtype = 'ARTICLE';
          result.mime = 'HTML';
          break;
        }
      }
      break;
    case 'MImg':
      // PDF
      // Set consultation type to PDF
      result.rtype = 'ARTICLE';
      result.mime = 'PDF';
      break;
    case 'MiamiImageURL':
      if (param._pii) {
        if ((match = /S([0-9]{4})([0-9]{3}[0-9Xx])([0-9A-Za-z]*)/.exec(param._pii)) !== null) {
          // example : http://pdn.sciencedirect.com.gate1.inist.fr/science?_ob=MiamiImageURL&_cid=282179&_user=4046392
          // &_pii=S221267161200100X&_check=y&_origin=browseVolIssue&_zone=rslt_list_item&_coverDate=2012-12-31
          // &wchp=dGLbVlB-zSkWz&md5=79a307d3c9bdbea6d6a6092d73c25545&pid=1-s2.0-S221267161200100X-main.pdf
          // result.unitid = match[1] + match[2] + match[3];
          result.issn = match[1] + '-' + match[2];
          result.rtype = 'ARTICLE';
          result.mime = 'PDF';
        } else if ((match = /B([0-9]{12})([0-9Xx])/.exec(param._pii)) !== null) {
          // example : http://pdn.sciencedirect.com.gate1.inist.fr/science?_ob=MiamiImageURL&_cid=276181&_user=4046392
          // &_pii=B9780122694400500017&_check=y&_origin=browse&_zone=rslt_list_item&_coverDate=1996-12-31
          // &wchp=dGLzVlV-zSkWz&md5=7e7ed3b95463e5438053bb62f487cf57&pid=3-s2.0-B9780122694400500017-main.pdf
          // result.unitid = match[1] + match[2];
          result.pid = match[1] + match[2];
          result.rtype = 'BOOK';
          result.mime = 'PDF';
        } else {
          // result.unitid = param._pii.substr(1, 4) + '-' + param._pii.substr(5, 4);
          result.issn = param._pii.substr(1, 4) + '-' + param._pii.substr(5, 4);
          // Set consultation type to PDF
          result.rtype = 'ARTICLE';
          result.mime = 'PDF';
        }
      }
      break;
    }
  } else {
    if ((match = /\/science\/article\/pii\/S([0-9]{4})([0-9]{3}[0-9Xx])([0-9A-Za-z]*)/.exec(url)) !== null) {
      // example : http://www.sciencedirect.com.gate1.inist.fr/science/article/pii/S2212671612001011
      // result.unitid = match[1] + match[2] + match[3];
      result.issn = match[1] + '-' + match[2];
      result.rtype = 'ARTICLE';
      result.mime = 'HTML';
    } else if ((match = /\/science\/publication\?issn=([0-9]{4})([0-9]{4})/.exec(url)) !== null) {
      // result.unitid = match[1] + '-' + match[2];
      result.issn = match[1] + '-' + match[2];
      result.rtype = 'TOC';
      result.mime = 'MISC';
    } else if ((match = /\/science\/journal\/([0-9]{4})([0-9]{4})/.exec(url)) !== null) {
      // example : http://www.sciencedirect.com.gate1.inist.fr/science/journal/22126716
      // result.unitid = match[1] + '-' + match[2];
      result.issn = match[1] + '-' + match[2];
      result.rtype = 'TOC';
      result.mime = 'MISC';
    } else if ((match = /\/science\/bookseries\/([0-9]{8})(\/[0-9]+)?/.exec(url)) !== null) {
      // example : http://www.sciencedirect.com.gate1.inist.fr/science/bookseries/00652458
      // if (match[2]) {
      //   result.unitid = match[1] + match[2];
      // } else {
      //   result.unitid = match[1];
      // }
      result.pid   = match[1];
      result.rtype = 'BOOKSERIE';
      result.mime = 'MISC';
    } else if ((match = /\/science\/handbooks\/([0-9]{8})(\/[0-9]+)?/.exec(url)) !== null) {
      // example : http://www.sciencedirect.com.gate1.inist.fr/science/handbooks/01673785
      // example : http://www.sciencedirect.com.gate1.inist.fr/science/handbooks/01673785/11
      // if (match[2]) {
      //   result.unitid = match[1] + match[2];
      // } else {
      //   result.unitid = match[1];
      // }
      result.pid   = match[1];
      result.rtype = 'HANDBOOK';
      result.mime = 'MISC';
    } else if ((match = /\/science\/book\/([0-9]{13})/.exec(url)) !== null) {
      // example : http://www.sciencedirect.com.gate1.inist.fr/science/book/9780122694400
      // result.unitid = match[1];
      // ##RN
      result.pid   = match[1];
      result.rtype = 'BOOK';
      result.mime = 'HTML'
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
