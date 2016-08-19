/* eslint global-require: 0 */
'use strict';

const path = require('path');

global.ezpaarse = {};
global.ezpaarse.config = require('./config');

global.ezpaarse.lib = function (name) {
  return require(path.resolve(__dirname, name));
};
