'use strict';

var config = require('../lib/config.js');

var { Router } = require('express');
var app = Router();

app.get('/', function (req, res) {
  res.render('main');
});

app.get('/partials/:name', function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name, { demo: config.EZPAARSE_DEMO });
});

module.exports = app;
