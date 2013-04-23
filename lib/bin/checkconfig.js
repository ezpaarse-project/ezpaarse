/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var fs      = require('fs');
var net     = require('net');
var Socket  = net.Socket;
var shell   = require('shelljs');
var os      = require('os');
var async   = require('async');
var config  = require('../../config.json');
var appname = require('../../package.json').name;

var red   = '\u001b[1;31m';   // Color red
var green = '\u001b[1;32m';   // Color green
var yellow = '\u001b[1;36m';  // Color yellow
var brown = '\u001b[33m';   // Color brown
var reset = '\u001b[0m';    // Color reset
var separator = '-------------------------------';
var pass = green + '--> OK' + reset;
var fail = red + '--> FAIL' + reset;

var success = true;

var platformsFolder = __dirname + '/../../platforms'
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
    var socket = new Socket();
    var used = true;

    // Socket connection established, port is in use
    socket.on('connect', function () {
      socket.end();
    })

    // If no response, assume port is not listening
    socket.setTimeout(400)
    socket.on('timeout', function () {
      used = false;
      socket.destroy();
    });

    // Assuming the port is not in use if an error.
    socket.on('error', function (exception) {
      used = false;
    });

    socket.on('close', function (exception) {
      if (used) {
        console.error(fail + " : Port already in use");
        success = false;
      } else {
        console.log("Available");
        console.log(pass);
      }
      callback(null);
    });

    socket.connect(config.EZPAARSE_NODEJS_PORT, '127.0.0.1');
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
    success = false
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
      'libldap2-dev',
      'perl',
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
  console.log(yellow + 'Looking for required languages' + reset);
  var ok = true;
  var folders = fs.readdirSync(platformsFolder);
  var languages = [];
  var badParsers = [];

  for (var i in folders) {
    var folder = folders[i];
    var parserFile = platformsFolder + '/' + folder + '/parser';
    
    if (fs.existsSync(parserFile) && fs.statSync(parserFile).isFile()) {
      // Assuming the header of all parsers is : #!/usr/bin/env XXX
      // where XXX is the language
      var firstLine = fs.readFileSync(parserFile, 'utf8').split('\n')[0];
      var match = /^\#\!\/usr\/bin\/env ([a-zA-Z]+)$/.exec(firstLine);
      if (match && match[1]) {
        var lang = match[1];
        if (languages.indexOf(lang) == -1) {
          languages.push(lang);
        }
      } else {
        badParsers.push(folder);
      }
    }
  }
  
  if (languages.length > 0) {
    languages.forEach(function (language) {
      if (shell.exec('which ' + language, {silent: true}).code !== 0) {
        console.error(language + ' : ' + red + ' not installed' + reset);
        ok = false;
      } else {
        console.log(language + ' : installed');
      }
    });
  }

  if (badParsers.length > 0) {
    var error = 'Couldn\'t determine the language for the following parsers :';
    badParsers.forEach(function (platform) {
      error += ' ' + platform;
    })
    console.error(red + error + reset);
    ok = false;
  }

  if (!ok) {
    console.error(fail + ' : install required languages or fix parsers header before running ' +
                  appname);
    success = false;
  } else {
    console.log(pass);
  }

  callback(null);
}

exports.checkConfig = function () {
  // get the command line argument
  // platform
  var optimist = require('optimist')
      .usage('Check if ezPAARSE is able to run\nUsage: $0')
      .alias('port', 'p')
      .describe('port', 'check only if the port is available');
  var argv = optimist.argv;

  // show usage if --help option is used
  if (argv.help) {
    optimist.showHelp();
    process.exit(0);
  }
  
  if (argv.port) {
    checkPort(function (err) {
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
      checkLanguages
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
}