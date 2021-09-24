/*eslint no-sync: 0*/
'use strict';

const fs           = require('fs-extra');
const { execSync } = require('child_process');
const axios        = require('axios');
const os           = require('os');
const mongo        = require('../mongo.js');
const config       = require('../config.js');
const appname      = require('../../package.json').name;

const red       = '\u001b[1;31m'; // Color red
const green     = '\u001b[1;32m'; // Color green
const yellow    = '\u001b[1;36m'; // Color yellow
const brown     = '\u001b[33m';   // Color brown
const reset     = '\u001b[0m';    // Color reset
const separator = '-------------------------------';
const pass      = green + '--> OK' + reset;
const fail      = red + '--> FAIL' + reset;
const warning   = brown + '--> WARNING' + reset;

let success = true;
let dist;

function checkAppname() {
  console.log(separator);
  console.log(yellow + 'Looking for application name' + reset);
  if (!appname) {
    console.error(fail + ' : The application must be named, check your package.json');
    success = false;
  } else {
    console.log(appname);
    console.log(pass);
  }
}

function checkMail() {
  console.log(separator);
  console.log(yellow + 'Looking for admin mail' + reset);
  if (!config.EZPAARSE_ADMIN_MAIL) {
    console.error(fail + ' : The admin mail must be specified, check your config.json');
    success = false;
  } else {
    console.log(config.EZPAARSE_ADMIN_MAIL);
    console.log(pass);
  }
}

async function checkPort() {
  console.log(separator);
  console.log(yellow + 'Checking server port' + reset);

  const port = config.EZPAARSE_NODEJS_PORT;
  if (!port) {
    console.error(fail + ' : No port found, check your config.json');
    success = false;
    return;
  }

  console.log('Port : ' + port);

  let response;
  try {
    response = await axios({
      method: 'GET',
      url: `http://127.0.0.1:${port}`,
      timeout: 5000,
      validateStatus: false
    });
  } catch (e) {
    console.log('Available');
    console.log(pass);
    return;
  }

  const ezpaarseVersion = response?.headers?.['ezpaarse-version'];

  if (ezpaarseVersion) {
    console.log(`ezPAARSE ${ezpaarseVersion} already listening`);
    console.log(pass);
    return;
  }

  console.error(fail + ' : Port already in use');
  success = false;
}

function checkPlatform() {
  console.log(separator);
  const platform = os.platform();
  const release = os.release();

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
}

function checkEnvironment() {
  console.log(separator);
  console.log(yellow + 'Checking environment' + reset);
  if (fs.existsSync('/usr/bin/env')) {
    console.log(pass);
  } else {
    console.error(fail + ' : couldn\'t find /usr/bin/env');
    success = false;
  }
}

function checkDependencies() {
  console.log(separator);
  console.log(yellow + 'Checking dependencies' + reset);
  let ok = true;

  if (!dist) {
    console.error(fail + ' : Couldn\'t determine the distribution');
    return;
  }

  if (dist == 'Debian') {
    const dependencies = [
      'python',
      'g++',
      'make',
      'git',
      'curl'
    ];

    dependencies.forEach(function (dep) {
      try {
        execSync('dpkg -l ' + dep);
      } catch (e) {
        console.error('\n' + appname + ' requires ' + red + dep + reset +
                      ' but it is not installed.');
        console.error('If you are running ubuntu or debian you might be able to install ' +
                      dep + ' with the following command:');
        console.error(brown + 'sudo apt-get install ' + dep + reset);
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
}

function checkLanguages() {
  console.log(separator);
  console.log(yellow + 'Checking node.js installation' + reset);

  try {
    execSync('which node');
    console.log(pass);
  } catch (e) {
    success = false;
    console.error(fail + ' : node.js was not found, use "make nodejs" to install it');
  }
}

async function checkMongodb() {
  console.log(separator);
  console.log(yellow + 'Checking MongoDB connection' + reset);

  try {
    await mongo.connect(config.EZPAARSE_MONGO_URL);
  } catch (err) {
    console.error(`${warning} : cannot connect to MongoDB at ${config.EZPAARSE_MONGO_URL}`);
    success = false;
    return;
  }

  let mongoVersion;
  try {
    const info = await mongo.serverStatus();
    mongoVersion = info.version;
  } catch (err) {
    console.error('Cannot fetch MongoDB version');
    success = false;
    return;
  }

  console.log(`MongoDB version: ${mongoVersion}`);

  const versions = /^([0-9]+)\.([0-9]+)/.exec(mongoVersion);

  if (!versions) {
    console.error(`${warning} : couldn't determine MongoDB version, is it up and running ?`);
    success = false;
    return;
  }

  const major = parseInt(versions[1]);
  const minor = parseInt(versions[2]);

  if (major < 3 || (major === 3 && minor < 2)) {
    console.error(`${warning} : MongoDB server outdated, please install version 3.2.0 or higher`);
    success = false;
    return;
  }

  console.log(pass);
  return mongo.disconnect();
}

exports.checkConfig = async function () {
  // get the command line argument
  // platform
  const yargs = require('yargs')
    .usage('Check if ezPAARSE is able to run\nUsage: $0')
    .alias('port', 'p')
    .alias('mongodb', 'm')
    .describe('port', 'only check port availability')
    .describe('mongodb', 'only check mongoDB connection');
  const argv = yargs.argv;

  // show usage if --help option is used
  if (argv.help) {
    yargs.showHelp();
    process.exit(0);
  }

  if (argv.port) {
    await checkPort();
    process.exit(success ? 0 : 1);
  }

  if (argv.mongodb) {
    await checkMongodb();
    process.exit(success ? 0 : 1);
  }

  checkPlatform();
  checkEnvironment();
  checkAppname();
  checkMail();
  await checkPort();
  checkDependencies();
  checkLanguages();
  await checkMongodb();

  console.log(separator);

  if (!success) {
    console.error(red + appname +
      ' won\'t be able to run correctly, fix all troubles before going any further' + reset);
    process.exit(1);
  }

  console.log(green + appname + ' is ready to run' + reset);
  process.exit(0);
};
