/* eslint no-console: 0, no-sync: 0 */
'use strict';

const express       = require('express');
const bodyParser    = require('body-parser');
const errorHandler  = require('errorhandler');
const morgan        = require('morgan');
const favicon       = require('serve-favicon');
const cookieSession = require('cookie-session');
const cookieParser  = require('cookie-parser');

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
const auth          = require('./lib/auth-middlewares.js');
const mailer        = require('./lib/mailer.js');
const parserlist    = require('./lib/parserlist.js');
const ecFilter      = require('./lib/ecfilter.js');
const winston       = require('winston');
require('./lib/winston-socketio.js');
const passport      = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const LocalStrategy = require('passport-local').Strategy;
const lsof          = require('lsof');

winston.addColors({ verbose: 'green', info: 'green', warn: 'yellow', error: 'red' });

mkdirp.sync(path.join(__dirname, '/tmp'));

// Setup cleaning jobs for the temporary folder
if (config.EZPAARSE_TMP_CYCLE && config.EZPAARSE_TMP_LIFETIME) {
  new Reaper({
    recursive: true,
    threshold: config.EZPAARSE_TMP_LIFETIME,
    every: config.EZPAARSE_TMP_CYCLE
  }).watch(path.join(__dirname, '/tmp'))
    .on('error', console.error)
    .start();
} else {
  const red   = '\u001b[31m';
  const reset = '\u001b[0m';
  let err = red;
  err += 'Warning! Temporary folder won\'t be automatically cleaned, ';
  err += 'fill TMP_CYCLE and TMP_LIFETIME in the configuration file.';
  err += reset;
  console.error(err);
}

// to have a nice unix process name
process.title = pkg.name.toLowerCase();

// write pid to ezpaarse.pid file
const yargs = require('yargs')
  .describe('pidFile', 'the pid file where ezpaarse pid is stored')
  .default('pidFile', path.resolve(__dirname, 'ezpaarse.pid'))
  .boolean('lsof')
  .boolean('memory')
  .describe('lsof', 'if provided, periodically prints the number of opened file descriptors')
  .describe('memory', 'if provided, periodically prints the memory usage');
const argv = yargs.argv;

if (argv.pidFile) {
  fs.writeFileSync(argv.pidFile, process.pid);
}
if (argv.lsof) {
  (function checklsof() {
    lsof.raw(process.pid, function (data) {
      data = data.filter(function (element) {
        return /^(?:DIR|REG)$/i.test(element.type);
      });
      console.log('[%s] %d file descriptors', new Date().toLocaleTimeString(), data.length);
      setTimeout(checklsof, 5000);
    });
  })();
}

if (argv.memory) {
  (function checkMemory() {
    console.log('Memory usage: %d MiB',
      Math.round(process.memoryUsage().rss / 1024 / 1024 * 100) / 100);
    setTimeout(checkMemory, 5000);
  })();
}

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(new BasicStrategy(auth.login));
passport.use(new LocalStrategy({ usernameField: 'userid' }, auth.login));

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
    stream: fs.createWriteStream(path.join(__dirname, '/logs/access.log'), { flags: 'a+' })
  }));
}

app.set('port', config.EZPAARSE_NODEJS_PORT || 3000);

// for dynamics HTML pages (ejs template engine is used)
// https://github.com/visionmedia/ejs
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// used to expose a favicon in the browser
// http://www.senchalabs.org/connect/middleware-favicon.html
app.use(favicon(path.join(__dirname, 'public/img/favicon.ico')));


/**
 * Send 503 if ezPAARSE is being updated
 */
app.use(function (req, res, next) {
  if (!app.locals.updating) { return next(); }

  fs.exists(path.join(__dirname, 'update.lock'), function (exist) {
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

app.use(cookieParser('ezpaarseappoftheYEAR'));
app.use(cookieSession({ //should not be used in PROD
  key: 'ezpaarse',
  secret: 'ezpaarseappoftheYEAR'
}));
app.use(passport.initialize());
app.use(passport.session());

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

// used to expose static files from the public folder
app.use('/assets', express.static(path.join(__dirname, 'public')));
app.use('/assets', function (req, res, next) { res.status(404).end(); });
app.use('/stylesheets', express.static(path.join(__dirname, 'public/stylesheets')));
app.use('/stylesheets', function (req, res, next) { res.status(404).end(); });
app.use('/img', express.static(path.join(__dirname, 'public/img')));
app.use('/img', function (req, res, next) { res.status(404).end(); });
app.use('/doc', function (req, res, next) {
  res.redirect('http://ezpaarse.readthedocs.io/');
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

// log related routes
require('./routes/views')(app);
require('./routes/ws')(app);
require('./routes/info')(app);
require('./routes/logs')(app);
require('./routes/feedback')(app);
require('./lib/castor.js')(app);
require('./routes/admin')(app);
require('./routes/auth')(app);
require('./routes/format')(app);

// For angular HTML5 mode
app.get('*', function (req, res) {
  res.render('main');
});

if (env == 'development') {
  app.use(errorHandler());
}

start().then(() => {
  console.log(`${pkg.name}-${pkg.version} (pid: ${process.pid}, mode: ${app.get('env')})`);
  console.log(`listening on http://localhost:${app.get('port')}`);
});

/**
 * Init and start the server
 */
async function start () {
  await connectToMongo();

  console.log('Indexing robot hosts...');
  const nbRobots = await new Promise((resolve, reject) => {
    ecFilter.init((err, nbRobots) => {
      if (err) { reject(err); }
      else { resolve(nbRobots); }
    });
  });

  console.log('Robot hosts indexed. (%d hosts registered)', nbRobots);
  console.log('Building domains matching list...');

  const { errors, duplicates } = await new Promise(resolve => parserlist.init(resolve));

  if (errors) {
    errors.forEach(err => console.error(err));
  }

  if (duplicates) {
    duplicates.forEach(d => {
      const msg = '[Warning] The domain %s is used twice in %s and %s, %s will be ignored';
      console.error(msg, d.domain, d.first, d.ignored, d.ignored);
    });
  }

  const nbDomains = parserlist.sizeOf('domains');
  const nbPlatforms = parserlist.sizeOf('platforms');
  console.log('Matching list built.');
  console.log(`(${nbDomains} domains registered for ${nbPlatforms} platforms)\n`);

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
    console.error(`Cannot connect to MongoDB at ${config.EZPAARSE_MONGO_URL}`);
    process.exit(1);
  }

  let mongoVersion;
  try {
    const info = await mongo.serverStatus();
    mongoVersion = info.version;
  } catch (err) {
    console.error('Cannot fetch MongoDB version');
    process.exit(1);
  }

  console.log(`MongoDB version: ${mongoVersion}`);

  let versions = /^(?<major>[0-9]+)\.(?<minor>[0-9]+)/.exec(mongoVersion);

  const major = parseInt(versions.groups.major);
  const minor = parseInt(versions.groups.minor);

  if (major < 3 || (major === 3 && minor < 2)) {
    console.error('MongoDB server outdated, please install version 3.2.0 or higher');
    process.exit(1);
  }
}

/**
 * To handled CTRL+C events
 */
function shutdown() {
  console.log('\nGot a stop signal, shutting down...');
  process.exit(1);
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
