'use strict';

/**
 * This module is responsible of the ezPAARSE configuration parameters
 * it will load it from the default config.json file but these parameters
 * can be overrided by the user through a config.local.json file or
 * through the environement variables or through the command line parameter
 */

var nconf   = require('nconf');

nconf.argv() // try to overide parameter from the command line
     // then from the environment
     .env()
     // then from a local config file
     .file({ file: __dirname + '/../config.local.json' })
     // then (default value) from the standard config.json file
     .file({ file: __dirname + '/../config.json' });

// return all the captured key/values
module.exports = nconf.get();