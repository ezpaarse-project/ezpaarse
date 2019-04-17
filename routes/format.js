'use strict';

var logParser = require('../lib/logparser');
var Boom = require('boom');
var bodyParser = require('body-parser');
var { Router } = require('express');
var app = Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
*  Get a browserified version of the log parser
*/
app.put('/logparser', (req, res, next) => {
  if (!req.body) {
    return next(Boom.badRequest('noBody'));
  }
  if (typeof req.body.logLines !== 'string') {
    return next(Boom.badRequest('missingLogLinesField'));
  }

  const logLine = req.body.logLines.split('\n')[0];

  let format = req.body.format;
  const proxy = format ? req.body.proxy : null;
  const dateFormat = req.body.dateFormat;
  const auto = !format;
  const fullFormat = format;
  let strictMatch = true;
  let regexp;
  let regexpBreak;
  let parser;
  let ec;
  let reg;


  while (format || auto) {
    parser = logParser({
      proxy,
      format,
      dateFormat,
      laxist: !strictMatch
    });

    ec = parser.parse(logLine);

    // If we can build a regex with the log format, find the longest working regex
    if (strictMatch && parser.getRegexp()) {
      regexp = parser.getRegexp().source;

      for (regexpBreak = regexp.length; regexpBreak >= 0; regexpBreak--) {
        try {
          reg = new RegExp(regexp.substr(0, regexpBreak));
        } catch (e) { continue; }

        if (reg.test(logLine)) { break; }
      }
    }

    if (ec) { break; }

    if (!strictMatch) {
      format = format.substr(0, format.length - 1);
    }

    strictMatch = false;

    if (auto) { break; }
  }

  let missing = [];

  if (ec) {
    if (!ec.hasOwnProperty('timestamp')) { missing.push('date'); }
    if (!ec.hasOwnProperty('url')) { missing.push('url'); }
    if (!ec.hasOwnProperty('domain')) { missing.push('domain'); }
  }

  return res.status(200).json({
    autoDetect:  parser.autoDetect(),
    proxy:       parser.getProxy(),
    format:      parser.autoDetect() ? parser.getFormat() : fullFormat,
    formatBreak: parser.autoDetect() ? parser.getFormat().length : format.length,
    strictMatch,
    regexp,
    regexpBreak,
    missing,
    ec
  });
});

module.exports = app;
