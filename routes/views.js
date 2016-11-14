'use strict';

var config = require('../lib/config.js');

module.exports = function (app) {

  app.get('/', function (req, res) {
    res.render('main');
  });

  app.get('/partials/:name', function (req, res) {
    var name = req.params.name;
    res.render('partials/' + name, { demo: config.demo });
  });
};