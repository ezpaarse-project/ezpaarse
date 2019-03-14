'use strict';

var logParser = require('../lib/logparser');
var bodyParser = require('body-parser');
var { Router } = require('express');
var app = Router();

/**
*  Get a browserified version of the log parser
*/
app.put('/logparser', bodyParser.urlencoded({ extended: true }), bodyParser.json(), (req, res) => {
  if (!req.body) return res.status(400);
  if (!req.body.settings || !req.body.logsLines) return res.status(400);

  const logLine = req.body.logsLines.split('\n')[0];
  const settings = req.body.settings;
  let format = settings.headers['Log-Format'].value || '';
  const fullFormat = format;
  let strictMatch = true;
  let regexp;
  let regexpBreak;
  let parser;
  let ec;
  let reg;

  let auto = !format;

  while (format || auto) {
    parser = logParser({
      proxy: format ? settings.headers['Log-Format'].format : null,
      format: format,
      dateFormat: settings.headers['Date-Format'],
      laxist: !strictMatch
    });

    ec = parser.parse(logLine);

    if (strictMatch && parser.getRegexp()) {
      regexp = parser.getRegexp().source;

      for (regexpBreak = regexp.length; regexpBreak >= 0; regexpBreak--) {
        try {
          reg = new RegExp(regexp.substr(0, regexpBreak));
        } catch (e) { continue; }

        if (reg.test(logLine)) { break; }
      }
    }

    if (ec) break;

    strictMatch = false;

    if (auto) break;
  }

  if (ec) {
    let missing = [];
    if (!ec.hasOwnProperty('timestamp')) missing.push('date');
    if (!ec.hasOwnProperty('url')) missing.push('url');
    if (!ec.hasOwnProperty('domain')) missing.push('domain');

    return res.status(200).json({
      autoDetect: parser.autoDetect(),
      strictMatch: strictMatch,
      proxy: parser.getProxy(),
      format: parser.autoDetect() ? parser.getFormat() : fullFormat,
      formatBreak: parser.autoDetect() ? parser.getFormat().length : format.length,
      regexp,
      regexpBreak,
      missing: missing,
      ec
    });
  }

  return res.status(200).json({
    autoDetect:  parser.autoDetect(),
    proxy:       parser.getProxy(),
    strictMatch: false,
    regexp:      regexp,
    regexpBreak: regexpBreak,
    format:      parser.autoDetect() ? parser.getFormat() : fullFormat,
    formatBreak: 0
  });
});

module.exports = app;
