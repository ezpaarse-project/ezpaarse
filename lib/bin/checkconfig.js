'use strict';

var fs          = require('graceful-fs');
var shell       = require('shelljs');
var portscanner = require('portscanner');
var os          = require('os');
var async       = require('async');
var mongo       = require('../mongo.js');
var config      = require('../config.js');
var appname     = require('../../package.json').name;

var red       = '\u001b[1;31m'; // Color red
var green     = '\u001b[1;32m'; // Color green
var yellow    = '\u001b[1;36m'; // Color yellow
var brown     = '\u001b[33m';   // Color brown
var reset     = '\u001b[0m';    // Color reset
var separator = '-------------------------------';
var pass      = green + '--> OK' + reset;
var fail      = red + '--> FAIL' + reset;
var warning   = brown + '--> WARNING' + reset;

var success = true;
var dist;

function checkAppname(callback) {
  console.log(separator);
  console.log(yellow + 'Looking for application name' + reset);
  if (!appname) {
    console.error(fail + ' : The application must be named, check your package.json');
    success = false;
  } else {
    console.log(appname);
    console.log(pass);
  }
  callback(null);
}

function checkMail(callback) {
  console.log(separator);
  console.log(yellow + 'Looking for admin mail' + reset);
  if (!config.EZPAARSE_ADMIN_MAIL) {
    console.error(fail + ' : The admin mail must be specified, check your config.json');
    success = false;
  } else {
    console.log(config.EZPAARSE_ADMIN_MAIL);
    console.log(pass);
  }
  callback(null);
}

function checkPort(callback) {
  console.log(separator);
  console.log(yellow + 'Checking server port' + reset);
  if (!config.EZPAARSE_NODEJS_PORT) {
    console.error(fail + " : No port found, check your config.json");
    success = false;
    callback(null);
  } else {
    console.log("Port : " + config.EZPAARSE_NODEJS_PORT);

    portscanner.checkPortStatus(config.EZPAARSE_NODEJS_PORT, '127.0.0.1', function (err, status) {
      if (!err && status == 'open') {
        console.error(fail + " : Port already in use");
        success = false;
      } else {
        console.log("Available");
        console.log(pass);
      }
      callback(null);
    });
  }
}

function checkPlatform(callback) {
  console.log(separator);
  var platform = os.platform();
  var release = os.release();

  if (platform == 'linux') {
    if (fs.existsSync('/etc/debian_version')) {
      dist = 'Debian';
    } else if (fs.existsSync('/etc/SuSE-release')) {
      dist = 'SuSE';
    } else if (fs.existsSync('/etc/redhat-release')) {
      dist = 'RedHat';
    } else if (fs.existsSync('/etc/mandrake-release')) {
      dist = 'Mandrake';
    } else if (fs.existsSync('/etc/fedora-release')) {
      dist = 'Fedora';
    }
  }
  console.log('Operating system: ' + platform + ' ' + release + (dist ? ' (' + dist + ')' : ''));
  callback(null);
}

function checkEnvironment(callback) {
  console.log(separator);
  console.log(yellow + 'Checking environment' + reset);
  if (fs.existsSync('/usr/bin/env')) {
    console.log(pass);
  } else {
    console.error(fail + ' : couldn\'t find /usr/bin/env');
    success = false;
  }
  callback(null);
}

function checkDependencies(callback) {
  console.log(separator);
  console.log(yellow + 'Checking dependencies' + reset);
  var ok = true;

  if (!dist) {
    console.error(fail + ' : Couldn\'t determine the distribution');
    callback(null);
    return;
  }

  if (dist == 'Debian') {
    var dependencies = [
      'build-essential',
      'git',
      'make',
      'curl',
      'python',
      'gcc'
    ];

    dependencies.forEach(function (dep) {
      if (shell.exec('dpkg -l ' + dep, {silent: true}).code !== 0) {
        console.error("\n" + appname + " requires " + red + dep + reset +
                      " but it is not installed.");
        console.error("If you are running ubuntu or debian you might be able to install " +
                      dep + " with the following command:");
        console.error(brown + "sudo apt-get install " + dep + reset);
        ok = false;
      }
    });
  }

  if (!ok) {
    console.error('\n' + fail + ' : fix dependencies before running ' + appname);
    success = false;
  } else {
    console.log(pass);
  }

  callback(null);
}

function checkLanguages(callback) {
  console.log(separator);
  console.log(yellow + 'Checking node.js installation' + reset);

  if (shell.exec('which node', { silent: true }).code !== 0) {
    success = false;
    console.error(fail + ' : node.js was not found, use "make nodejs" to install it');
  } else {
    console.log(pass);
  }

  callback(null);
}

function checkMongodb(callback) {
  console.log(separator);
  console.log(yellow + 'Checking MongoDB connection' + reset);

  mongo.connect(function (err, db) {
    if (err) {
      console.error(warning + ' : could not connect to MongoDB, is it installed and running ?');
    } else {
      console.log(pass);
    }

    mongo.disconnect(callback);
  });
}

exports.checkConfig = function () {
  // get the command line argument
  // platform
  var yargs = require('yargs')
      .usage('Check if ezPAARSE is able to run\nUsage: $0')
      .alias('port', 'p')
      .alias('mongodb', 'm')
      .describe('port', 'only check port availability')
      .describe('mongodb', 'only check mongoDB connection');
  var argv = yargs.argv;

  // show usage if --help option is used
  if (argv.help) {
    yargs.showHelp();
    process.exit(0);
  }

  if (argv.port) {
    checkPort(function () {
      if (success) {
        process.exit(0);
      } else {
        process.exit(1);
      }
    });
  } else if (argv.mongodb) {
    checkMongodb(function () {
      if (success) {
        process.exit(0);
      } else {
        process.exit(1);
      }
    });
  } else {
    async.series([
      checkPlatform,
      checkEnvironment,
      checkAppname,
      checkMail,
      checkPort,
      checkDependencies,
      checkLanguages,
      checkMongodb
    ],
      function afterCheck() {
        console.log(separator);
        if (success) {
          console.log(green + appname + ' is ready to run' + reset);
          process.exit(0);
        } else {
          console.error(red + appname +
            ' won\'t be able to run correctly, fix all troubles before going any further' + reset);
          process.exit(1);
        }
      }
    );
  }
};
