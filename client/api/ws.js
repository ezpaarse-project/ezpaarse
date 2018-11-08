'use strict';

var express = require('express');
var app     = express();

app.use(require('../../routes/ws'));

module.exports = {
  path: '/',
  handler: app
};
