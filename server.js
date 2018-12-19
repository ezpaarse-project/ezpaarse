/* eslint no-console: 0, no-sync: 0 */
'use strict';

const express       = require('express');
const bodyParser    = require('body-parser');
const errorHandler  = require('errorhandler');
const morgan        = require('morgan');

// Set the global variable "ezpaarse"
require('./lib/global.js');

const pkg           = require('./package.json');
const config        = require('./lib/config.js');
const socketIO      = require('./lib/socketio.js');
const mongo         = require('./lib/mongo.js');
const http          = require('http');
const path          = require('path');
const mkdirp        = require('mkdirp');
const fs            = require('fs-extra');
const Reaper        = require('tmp-reaper');
const mailer        = require('./lib/mailer.js');
const parserlist    = require('./lib/parserlist.js');
const ecFilter      = require('./lib/ecfilter.js');
const winston       = require('winston');
require('./lib/winston-socketio.js');
const lsof          = require('lsof');

const nuxt          = require('./app');

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

const app = express();

// connect ezpaarse env to expressjs env
const env = process.env.NODE_ENV = process.env.NODE_ENV || config.EZPAARSE_ENV;
app.set('env', env);

switch (env) {
case 'development':
  app.use(morgan('dev'));
  break;
case 'production':
  app.use(morgan('combined', {
    stream: fs.createWriteStream(path.resolve(__dirname, 'logs/access.log'), { flags: 'a+' })
  }));
}

app.set('port', config.EZPAARSE_NODEJS_PORT || 3000);

/**
 * Send 503 if ezPAARSE is being updated
 */
app.use(function (req, res, next) {
  if (!app.locals.updating) { return next(); }

  fs.exists(path.resolve(__dirname, 'update.lock'), function (exist) {
    if (exist) {
      return res.status(503).send('ezPAARSE is being updated, it should be back in a few minutes');
    }
    app.locals.updating = false;
    next();
  });
});

/**
 * Middleware to allow method override
 * either using _method in query
 * or the header X-HTTP-Method-Override
 */
app.use(function (req, res, next) {
  const key = '_method';
  if (req.query && req.query[key]) {
    req.method = req.query[key].toUpperCase();
  } else if (req.headers['x-http-method-override']) {
    req.method = req.headers['x-http-method-override'].toUpperCase();
  }
  next();
});

// Set the ezPAARSE-Version header in all responses
app.use(function (req, res, next) {
  res.header('ezPAARSE-Version', pkg.version || 'N/A');
  next();
});

// calculate the baseurl depending on reverse proxy variables
app.use(function (req, res, next) {
  req.ezBaseURL = 'http://' + (req.headers['x-forwarded-host'] || req.headers.host);
  next();
});

/**
 * routes handling
 */
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers',
    req.header('Access-Control-Request-Headers') || 'X-Requested-With');
  next();
});

// Handles delegated mails
app.post('/mail', bodyParser.urlencoded({ extended: true }), bodyParser.json(), mailer.handle);

if (env == 'development') {
  app.use(errorHandler());
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

  const nuxtApp = nuxt;
  nuxtApp.set('port', app.get('port'));

  const server = http.createServer(nuxtApp);

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
