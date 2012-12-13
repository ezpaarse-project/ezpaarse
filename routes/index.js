/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var debug = require('debug')('index');
var appname = require('../package.json').name;

/*
 * GET home page.
 */

exports.index = function (req, res) {
    debug("Req : " + req);
    res.render('index', { title: appname });
  };