/*eslint no-sync: 0*/
'use strict';

const fs           = require('fs-extra');
const { execSync } = require('child_process');
const chalk        = require('chalk');
const axios        = require('axios');
const os           = require('os');
const mongo        = require('../mongo.js');
const config       = require('../config.js');
const appname      = require('../../package.json').name;

let success = true;

function successMessage(msg) {
  console.log(`${chalk.green('✔')} ${chalk.gray(msg)}`);
}
function errorMessage(msg) {
  console.error(`${chalk.red('✖')} ${chalk.gray(msg)}`);
  success = false;
}
function warningMessage(msg) {
  console.error(`${chalk.yellow('⚠')} ${chalk.gray(msg)}`);
}
function infoMessage(msg) {
  console.log(`${chalk.blue('ℹ')} ${chalk.gray(msg)}`);
}

function checkAppname() {
  if (!appname) {
    errorMessage('Cannot find application name, check your package.json');
  } else {
    successMessage(appname);
  }
}

function checkMail() {
  if (config.EZPAARSE_ADMIN_MAIL) {
    successMessage(config.EZPAARSE_ADMIN_MAIL);
  } else {
    errorMessage('Cannot find administrator mail, check EZPAARSE_ADMIN_MAIL in your config.json');
  }
}

async function checkPort() {
  const port = config.EZPAARSE_NODEJS_PORT;

  if (!port) {
    errorMessage('Cannot find server port, check your config.json');
    return;
  }

  infoMessage(`${port}`);

  let response;
  try {
    response = await axios({
      method: 'GET',
      url: `http://127.0.0.1:${port}`,
      timeout: 5000,
      validateStatus: false
    });
  } catch (e) {
    successMessage('Port is available');
    return;
  }

  const ezpaarseVersion = response?.headers?.['ezpaarse-version'];

  if (ezpaarseVersion) {
    infoMessage(`ezPAARSE ${ezpaarseVersion} already listening`);
    return;
  }

  errorMessage('Port already in use');
}

function checkPlatform() {
  const platform = os.platform();
  const release = os.release();

  let output = `${platform} ${release}`;

  if (platform == 'linux') {
    if (fs.existsSync('/etc/debian_version')) {
      output += ' (Debian)';
    } else if (fs.existsSync('/etc/SuSE-release')) {
      output += ' (SuSE)';
    } else if (fs.existsSync('/etc/redhat-release')) {
      output += ' (RedHat)';
    } else if (fs.existsSync('/etc/mandrake-release')) {
      output += ' (Mandrake)';
    } else if (fs.existsSync('/etc/fedora-release')) {
      output += ' (Fedora)';
    }
  }

  infoMessage(output);

  if (platform !== 'linux') {
    warningMessage('Non-Linux platforms are not officially supported');
  }
}

function checkEnvironment() {
  const envFile = '/usr/bin/env';

  if (fs.existsSync(envFile)) {
    successMessage(`Found: ${envFile}`);
  } else {
    errorMessage(`Cannot find ${envFile}`);
  }
}

function checkNodejs() {
  try {
    const nodePath = execSync('command -v node', { encoding: 'utf-8' });
    successMessage(nodePath.trim());
  } catch (e) {
    errorMessage('Cannot find Node.js, use "make nodejs" to install it');
  }
}

async function checkMongodb() {
  try {
    await mongo.connect(config.EZPAARSE_MONGO_URL, { serverSelectionTimeoutMS: 5000 });
  } catch (err) {
    errorMessage(`Cannot connect to ${config.EZPAARSE_MONGO_URL}`);
    return;
  }

  let mongoVersion;
  try {
    const info = await mongo.serverStatus();
    mongoVersion = info.version;
  } catch (err) {
    errorMessage('Cannot fetch MongoDB version');
    return;
  }

  const versions = /^([0-9]+)\.([0-9]+)/.exec(mongoVersion);

  if (!versions) {
    errorMessage('Cannot determine MongoDB version. Is it up and running ?');
    return;
  }

  const major = parseInt(versions[1]);
  const minor = parseInt(versions[2]);

  if (major < 3 || (major === 3 && minor < 2)) {
    errorMessage(`Outdated version ${mongoVersion}, please install version 3.2.0 or higher`);
    return;
  }

  successMessage(`Version: ${mongoVersion}`);
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

  const tests = [
    { title: 'Operating system', fn: checkPlatform },
    { title: 'Environment', fn: checkEnvironment },
    { title: 'App name', fn: checkAppname },
    { title: 'Administrator email', fn: checkMail },
    { title: 'Server port', fn: checkPort },
    { title: 'Node.js', fn: checkNodejs },
    { title: 'MongoDB', fn: checkMongodb },
  ];

  for (let i = 0; i < tests.length; i += 1) {
    const test = tests[i];
    console.log(test.title);
    console.group();
    await test.fn();
    console.groupEnd();
  }

  console.log();

  if (!success) {
    errorMessage('There are some issues. Please fix them all before going any further.');
    process.exit(1);
  }

  successMessage(`${appname} is ready ro run.`);
  process.exit(0);
};
