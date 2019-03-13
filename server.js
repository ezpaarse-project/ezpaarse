/* eslint no-console: 0, no-sync: 0 */
'use strict';

// Set the global variable "ezpaarse"
require('./lib/global.js');

const config        = require('./lib/config.js');
const socketIO      = require('./lib/socketio.js');
const mongo         = require('./lib/mongo.js');
const http          = require('http');
const path          = require('path');
const mkdirp        = require('mkdirp');
const Reaper        = require('tmp-reaper');
const parserlist    = require('./lib/parserlist.js');
const ecFilter      = require('./lib/ecfilter.js');
const winston       = require('winston');
require('./lib/winston-socketio.js');
const lsof          = require('lsof');
const fs            = require('fs-extra');
const pkg           = require('./package.json');
const app          = require('./app');

winston.addColors({ verbose: 'green', info: 'green', warn: 'yellow', error: 'red' });

// to have a nice unix process name
process.title = pkg.name.toLowerCase();

const { argv } = require('yargs')
  .option('pid', {
    alias: 'pidFile',
    describe: 'the location of the ezpaarse pid file',
    default: path.resolve(__dirname, 'ezpaarse.pid')
  })
  .option('lsof', {
    boolean: true,
    describe: 'periodically prints the number of opened file descriptors'
  })
  .option('memory', {
    boolean: true,
    describe: 'periodically prints the memory usage'
  });

const { format } = winston;
const logger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [new (winston.transports.Console)()]
});

mkdirp.sync(path.resolve(__dirname, 'tmp'));

// Setup cleaning jobs for the temporary folder
if (config.EZPAARSE_TMP_CYCLE && config.EZPAARSE_TMP_LIFETIME) {
  new Reaper({
    recursive: true,
    threshold: config.EZPAARSE_TMP_LIFETIME,
    every: config.EZPAARSE_TMP_CYCLE
  }).watch(path.resolve(__dirname, 'tmp'))
    .on('error', err => logger.error(err.message))
    .start();
} else {
  let err = 'Temporary folder won\'t be automatically cleaned, ';
  err += 'fill TMP_CYCLE and TMP_LIFETIME in the configuration file.';
  logger.warn(err);
}

if (argv.pidFile) {
  // write pid to ezpaarse.pid file
  fs.writeFileSync(argv.pidFile, process.pid);
}
if (argv.lsof) {
  (function checklsof() {
    lsof.raw(process.pid, function (data) {
      data = data.filter(function (element) {
        return /^(?:DIR|REG)$/i.test(element.type);
      });
      logger.info(`${data.length} file descriptors`);
      setTimeout(checklsof, 5000);
    });
  })();
}

if (argv.memory) {
  (function checkMemory() {
    const memoryUsage = Math.round(process.memoryUsage().rss / 1024 / 1024 * 100) / 100;
    logger.info(`Memory usage: ${memoryUsage} MiB`);
    setTimeout(checkMemory, 5000);
  })();
}

start().then(() => {
  logger.info(`Listening on http://localhost:${app.get('port')}`);
});

/**
 * Init and start the server
 */
async function start () {
  logger.info(`${pkg.name} v${pkg.version} | PID: ${process.pid} | Mode: ${app.get('env')}`);

  await connectToMongo();

  const nbRobots = await new Promise((resolve, reject) => {
    ecFilter.init((err, nbRobots) => {
      if (err) { reject(err); }
      else { resolve(nbRobots); }
    });
  });

  try {
    await parserlist.init();
  } catch (e) {
    logger.error(`Failed to initialize parser list: ${e.message}`);
    process.exit(1);
  }

  const nbDomains = parserlist.sizeOf('domains');
  const nbPlatforms = parserlist.sizeOf('platforms');
  logger.info(`Domains: ${nbDomains} | Platforms: ${nbPlatforms} | Robot hosts: ${nbRobots}`);

  const server = http.createServer(app);

  socketIO.listen(server);

  return new Promise(resolve => server.listen(app.get('port'), resolve));
}

/**
 * Connect to MongoDB and check that version matches requirements
 */
async function connectToMongo () {
  try {
    await mongo.connect(config.EZPAARSE_MONGO_URL);
  } catch (err) {
    logger.error(`Cannot connect to MongoDB at ${config.EZPAARSE_MONGO_URL}`);
    process.exit(1);
  }

  let mongoVersion;
  try {
    const info = await mongo.serverStatus();
    mongoVersion = info.version;
  } catch (err) {
    logger.error('Cannot fetch MongoDB version');
    process.exit(1);
  }

  logger.info(`MongoDB version: ${mongoVersion}`);

  let versions = /^(?<major>[0-9]+)\.(?<minor>[0-9]+)/.exec(mongoVersion);

  const major = parseInt(versions.groups.major);
  const minor = parseInt(versions.groups.minor);

  if (major < 3 || (major === 3 && minor < 2)) {
    logger.error('MongoDB server outdated, please install version 3.2.0 or higher');
    process.exit(1);
  }
}

/**
 * To handled CTRL+C events
 */
function shutdown() {
  logger.info('Got a stop signal, shutting down...');
  process.exit(1);
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
