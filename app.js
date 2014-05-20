'use strict';

var express       = require('express');
var pkg           = require('./package.json');
var config        = require('./lib/config.js');
var http          = require('http');
var path          = require('path');
var mkdirp        = require('mkdirp');
var fs            = require('graceful-fs');
var Reaper        = require('tmp-reaper');
var auth          = require('./lib/auth-middlewares.js');
var winston       = require('winston');
require('./lib/winston-socketio.js');
var passport      = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var LocalStrategy = require('passport-local').Strategy;
var lsof          = require('lsof');
require('./lib/init.js');

winston.addColors({ verbose: 'green', info: 'green', warn: 'yellow', error: 'red' });

mkdirp.sync(path.join(__dirname, '/tmp'));

// Setup cleaning jobs for the temporary folder
if (config.EZPAARSE_TMP_CYCLE && config.EZPAARSE_TMP_LIFETIME) {
  new Reaper({
    recursive: true,
    threshold: config.EZPAARSE_TMP_LIFETIME,
    every: config.EZPAARSE_TMP_CYCLE
  }).watch(path.join(__dirname, '/tmp'))
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
var optimist = require('optimist')
  .describe('pidFile', 'the pid file where ezpaarse pid is stored')
  .default('pidFile', __dirname + '/ezpaarse.pid')
  .boolean('lsof')
  .describe('lsof', 'if provided, periodically prints the number of opened file descriptors');
if (optimist.argv.pidFile) {
  fs.writeFileSync(optimist.argv.pidFile, process.pid);
}
if (optimist.argv.lsof) {
  var checklsof = function () {
    lsof.raw(process.pid, function (data) {
      data = data.filter(function (element) {
        return /^(?:DIR|REG)$/i.test(element.type);
      });
      console.log('[%s] %d file descriptors', new Date().toLocaleTimeString(), data.length);
      setTimeout(checklsof, 5000);
    });
  };

  checklsof();
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
process.env.NODE_ENV = process.env.NODE_ENV || config.EZPAARSE_ENV;
app.set('env', process.env.NODE_ENV);

app.configure('development', function () {
  // http://www.senchalabs.org/connect/middleware-logger.html
  app.use(express.logger('dev'));
});
app.configure('production', function () {
  // http://www.senchalabs.org/connect/middleware-logger.html
  app.use(express.logger({
    stream: fs.createWriteStream(path.join(__dirname, '/logs/access.log'), { flags: 'a+' })
  }));
});

app.configure(function () {
  app.set('port', config.EZPAARSE_NODEJS_PORT || 3000);

  // for dynamics HTML pages (ejs template engine is used)
  // https://github.com/visionmedia/ejs
  app.set('views', path.join(__dirname, '/views'));
  app.set('view engine', 'ejs');

  // used to expose a favicon in the browser
  // http://www.senchalabs.org/connect/middleware-favicon.html
  app.use(express.favicon(path.join(__dirname, 'public/img/favicon.ico')));


  /**
   * Middleware to allow method override
   * either using _method in query
   * or the header X-HTTP-Method-Override
   */
  app.use(function (req, res, next) {
    var key = '_method';
    if (req.query && req.query[key]) {
      req.method = req.query[key].toUpperCase();
    } else if (req.headers['x-http-method-override']) {
      req.method = req.headers['x-http-method-override'].toUpperCase();
    }
    next();
  });
  app.use(express.cookieParser());
  app.use(express.cookieSession({ //should not be used in PROD
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
  app.use('/assets', function (req, res, next) { res.send(404); });
  app.use('/stylesheets', express.static(path.join(__dirname, 'public/stylesheets')));
  app.use('/stylesheets', function (req, res, next) { res.send(404); });
  app.use('/img', express.static(path.join(__dirname, 'public/img')));
  app.use('/img', function (req, res, next) { res.send(404); });
  app.use('/doc', express.static(path.join(__dirname, 'public/doc')));
  app.use('/doc', function (req, res, next) { res.send(404); });

  // routes handling
  app.use(app.router);

});

app.configure('development', function () {
  app.use(express.errorHandler());
});

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  next();
});

// log related routes
require('./routes/views')(app);
require('./routes/ws')(app);
require('./routes/info')(app);
require('./routes/logs')(app);
require('./routes/admin')(app);
require('./routes/auth')(app);
require('./routes/feedback')(app);

// For angular HTML5 mode
app.get('*', function (req, res) {
  res.render('main');
});

var server = http.createServer(app);

require('./lib/socketio.js').listen(server);

server.listen(app.get('port'), function () {
  console.log(pkg.name + "-" + pkg.version +
    " listening on http://localhost:" + app.get('port') + " (pid is " + process.pid + ")");
});
