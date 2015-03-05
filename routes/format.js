'use strict';

var path       = require('path');
var browserify = require('browserify');

module.exports = function (app) {

  var bundle;

  /**
   *  Get a browserified version of the log parser
   */
  app.get('/logparser.js', function (req, res) {
    res.type('text/javascript');

    if (bundle) { return res.status(200).send(bundle); }

    var b = browserify();
    b.require(path.join(__dirname, '../lib/logparser.js'), { expose: 'logparser' });
    b.bundle(function (err, content) {
      if (err) { return res.status(500).end(); }
      bundle = content;
      res.status(200).send(bundle);
    });
  });
};