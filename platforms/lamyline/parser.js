#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var byline = require('byline');
var URL    = require('url');

function parseUrl(url) {
  var result = {};
  var pathname = URL.parse(url).pathname;

  if (pathname == '/Content/DocumentView.aspx') {
    // http://lamyline.lamy.fr/Content/DocumentView.aspx?params=H4sIAAAAAAAEAO29B2AcSZYlJi9tynt/SvVK1+B0oQiAYBMk2JBAEOzBiM3mkuwdaUcj
    // KasqgcplVmVdZhZAzO2dvPfee++999577733ujudTif33/8/XGZkAWz2zkrayZ4hgKrIHz9+fB8/In7ROq+v3+Tv2s/avGl/YXO9rJbXi8/e1Ov8F7bZpPnswS/Mpu
    // 06K59W08928Xtxmb/JJvR5W7VZ+SpvPtvbvffpL6zqWV4/uf5s5xc28+rqRXZZXGRtUS2fZLVAK2azz+7vPrh/797BL7zM64a+++wni4t82ea/cF5czJ/T/1tpmjVN
    // 0ZxUJXXS5Fk9nb/MLvLPvsgush8Uy7wZZ83q3S9cZG2b15+9fv38d38w/Q7/e/L01bfx4+SU/n3++ifo389PX52+op8vntE/T1+9PH5DP1995yX/eXL2k/jr6TH+ev
    // X8hP99esY/5BO0fvL0FB99+fInvjrGx0/w4dMv8M7z1y++g05enb44ff4cvT59+W3F7PfKrz97dfqTZ6/fHP/CcvmW6Peax8JD/H8AN3adcXcBAAA=WKE

    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
  } else if (pathname == '/Content/PageViewPDF.aspx') {
    //  http://lamyline.lamy.fr/Content/PageViewPDF.aspx?params=H4sIAAAAAAAEAO29B2AcSZYlJi9tynt/SvVK1+B0oQiAYBMk2JBAEOzBiM3mkuwdaUcj
    //  KasqgcplVmVdZhZAzO2dvPfee++999577733ujudTif33/8/XGZkAWz2zkrayZ4hgKrIHz9+fB8/In7ROq+v3+Tv2s/avGl/YXO9rJbXi8/e1Ov8F7bZpPnswS/M
    //  pu06K59W08928Xtxmb/JJvR5W7VZ+SpvPtvbvffpL6zqWV4/uf5s5xc28+rqRXZZXGRtUS2fZLVAK2azz+7vPrh/797BL7zM64a+++wni4t82ea/cF5czJ/T/1tp
    //  mjVN0ZxUJXXS5Fk9nb/MLvLPvsgush8Uy7wZZ83q3S9cZG2b15+9fv38d38w/Q7/e/L01bfx4+SU/n3++ifo389PX52+op8vntE/T1+9PH5DP1995yX/eXL2k/jr
    //  6TH+evX8hP99esY/5BO0fvL0FB99+fInvjrGx0/w4dMv8M7z1y++g05enb44ff4cvT59+W3F7PfKrz97dfqTZ6/fHP/CcvmW6Peax8JD/H8AN3adcXcBAAA=WKE
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
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
