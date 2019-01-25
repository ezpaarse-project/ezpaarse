/* eslint no-console: 0 */
'use strict';

const { Nuxt, Builder } = require('nuxt');

const app           = require('express')();
const logger        = require('morgan');
const cookieSession = require('cookie-session');
const cookieParser  = require('cookie-parser');
const auth          = require('./lib/auth-middlewares.js');
const passport      = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const LocalStrategy = require('passport-local').Strategy;
const fs            = require('fs-extra');
const bodyParser    = require('body-parser');
const errorHandler  = require('errorhandler');
const morgan        = require('morgan');
const path          = require('path');
const config        = require('./lib/config.js');
const pkg           = require('./package.json');
const mailer        = require('./lib/mailer.js');
const useragent     = require('useragent');

process.env.PORT = config.EZPAARSE_NODEJS_PORT || 59599;

const isDev = app.get('env') !== 'production';
if (isDev) { app.use(logger('dev')); }

// Passport (auth)
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(new BasicStrategy(auth.login));
passport.use(new LocalStrategy({ usernameField: 'userid' }, auth.login));

app.use(cookieParser('ezpaarseappoftheYEAR'));
app.use(cookieSession({ //should not be used in PROD
  key: 'ezpaarse',
  secret: 'ezpaarseappoftheYEAR'
}));
app.use(passport.initialize());
app.use(passport.session());

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

// Detect browser
const express = require('express');
app.set('views', path.resolve(`${__dirname}/public`));
app.set('view engine', 'html');
app.use(express.static(__dirname));
app.engine('html', function (filePath, options, callback) {
  fs.readFile(filePath, function (err, content) {
    if (err) return callback(new Error(err));

    return callback(null, content.toString());
  });
});
app.use(function (req, res, next) {
  const agent = useragent.is(req.headers['user-agent']).ie;
  if (agent) {
    return res.render('browser-compatibility.html');
  }
  next();
});

// Import API Routes
app.use('/api', require('./client/api/index'));
app.use('/castor', require('./lib/castor'));
app.use('/', require('./routes/ws'));
app.use('/', require('./routes/logs'));

// API error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.write(isDev ? err.stack : err.message);
  res.end();
});

// Import and Set Nuxt.js options
const nuxtConfig = require('./nuxt.config.js');
nuxtConfig.dev = isDev;

// Init Nuxt.js
const nuxt = new Nuxt(nuxtConfig);
app.use(nuxt.render);

// Build only in dev mode
if (nuxtConfig.dev) {
  new Builder(nuxt).build()
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = app;