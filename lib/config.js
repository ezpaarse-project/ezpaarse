'use strict';

/**
 * This module is responsible of the ezPAARSE configuration parameters
 * it will load it from the default config.json file but these parameters
 * can be overrided by the user through a config.local.json file or
 * through the environement variables or through the command line parameter
 */

var nconf = require('nconf');
var path  = require('path');

var envConfig = process.env.EZPAARSE_CONFIG;

if (typeof envConfig === 'string' && envConfig.length > 0) {
  try {
    envConfig = JSON.parse(envConfig);
  } catch (e) {
    throw new Error('EZPAARSE_CONFIG is not a valid JSON');
  }

  nconf.overrides(envConfig);
}

nconf.argv() // try to get parameter from the command line
     // then from the environment
     .env()
      // then from the local config
     .file('local',   path.join(__dirname, '../config.local.json'))
     // then (default value) from the standard config.json file
     .file('default', path.join(__dirname, '../config.json'));

nconf.defaults({
  'EZPAARSE_HTTP_PROXY': process.env.HTTP_PROXY || process.env.http_proxy
});

// return all the captured key/values
module.exports = nconf.get();
