/* eslint no-console: 0, no-sync: 0 */
'use strict';

var express       = require('express');
var bodyParser    = require('body-parser');
var errorHandler  = require('errorhandler');
var morgan        = require('morgan');
var favicon       = require('serve-favicon');
var cookieSession = require('cookie-session');
var cookieParser  = require('cookie-parser');

// Set the global var "ezpaarse"
require('./lib/global.js');

var pkg           = require('./package.json');
var config        = require('./lib/config.js');
var socketIO      = require('./lib/socketio.js');
var mongo         = require('./lib/mongo.js');
var http          = require('http');
var path          = require('path');
var mkdirp        = require('mkdirp');
var fs            = require('graceful-fs');
var Reaper        = require('tmp-reaper');
var auth          = require('./lib/auth-middlewares.js');
var mailer        = require('./lib/mailer.js');
var parserlist    = require('./lib/parserlist.js');
var winston       = require('winston');
require('./lib/winston-socketio.js');
var passport      = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var LocalStrategy = require('passport-local').Strategy;
var lsof          = require('lsof');

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
  var red   = '\u001b[31m';
  var reset = '\u001b[0m';
  var err   = red;
  err += 'Warning! Temporary folder won\'t be automatically cleaned, ';
  err += 'fill TMP_CYCLE and TMP_LIFETIME in the configuration file.';
  err += reset;
  console.error(err);
}

// to have a nice unix process name
process.title = pkg.name.toLowerCase();

// write pid to ezpaarse.pid file
var yargs = require('yargs')
  .describe('pidFile', 'the pid file where ezpaarse pid is stored')
  .default('pidFile', path.resolve(__dirname, 'ezpaarse.pid'))
  .boolean('lsof')
  .boolean('memory')
  .describe('lsof', 'if provided, periodically prints the number of opened file descriptors')
  .describe('memory', 'if provided, periodically prints the memory usage');
var argv = yargs.argv;

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

var app = express();

// connect ezpaarse env to expressjs env
var env = process.env.NODE_ENV = process.env.NODE_ENV || config.EZPAARSE_ENV;
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
  var key = '_method';
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

// // Ask for basic authentification if ?auth=local
// // Render admin creation form if credentials.json does not exist
// app.use(function (req, res, next) {
//   if (req.query.auth && req.query.auth == 'local') {
//     if (userlist.length() !== 0) {
//       (passport.authenticate('basic', { session: true }))(req, res, next);
//     } else {
//       res.render('register', { title: 'ezPAARSE - Register', user: false });
//     }
//   } else {
//     next();
//   }
// });

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

console.log('Indexing robot hosts...');
require('./lib/ecfilter.js').init(function (err, nbRobots) {
  if (err) { throw err; }

  console.log('Robot hosts indexed. (%d hosts registered)', nbRobots);
  console.log('Building domains matching list...');
  parserlist.init(function (errors, duplicates) {
    if (errors) {
      errors.forEach(function (err) { console.error(err); });
    }

    if (duplicates) {
      duplicates.forEach(function (d) {
        var msg = '[Warning] The domain %s is used twice in %s and %s, %s will be ignored';
        console.error(msg, d.domain, d.first, d.ignored, d.ignored);
      });
    }

    console.log('Matching list built. (%d domains registered for %d platforms)\n',
      parserlist.sizeOf('domains'), parserlist.sizeOf('platforms'));

    var server = http.createServer(app);

    socketIO.listen(server);

    mongo.connect(function () {
      server.listen(app.get('port'), function () {
        console.log(`${pkg.name}-${pkg.version} (pid: ${process.pid}, mode: ${app.get('env')})`);
        console.log(`listening on http://localhost:${app.get('port')}`);
      });
    });
  });
});
