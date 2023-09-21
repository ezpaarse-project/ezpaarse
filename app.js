/* eslint no-console: 0 */
'use strict';

const { Nuxt, Builder } = require('nuxt');

const app           = require('express')();
const session       = require('express-session');
const MongoStore    = require('connect-mongo');
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
const userlist      = require('./lib/userlist.js');
const useragent     = require('useragent');
const Boom          = require('boom');

process.env.PORT = config.EZPAARSE_NODEJS_PORT || 59599;

// connect ezpaarse env to expressjs env
const env = process.env.NODE_ENV = process.env.NODE_ENV || config.EZPAARSE_ENV;
app.set('env', env);
app.set('trust proxy', true);

const isDev = app.get('env') !== 'production';

// Passport (auth)
passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  userlist.get(username, done);
});

passport.use(new BasicStrategy(auth.login));
passport.use(new LocalStrategy({ usernameField: 'userid' }, auth.login));

app.use(cookieParser('ezpaarseappoftheYEAR'));
app.use(session({
  name: 'ezpaarse',
  secret: 'ezpaarseappoftheYEAR',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: config.EZPAARSE_MONGO_URL })
}));
app.use(passport.initialize());
app.use(passport.session());

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
  if (!res.locals.updating) { return next(); }

  fs.access(path.resolve(__dirname, 'update.lock'), function (err) {
    if (!err) {
      return res.status(503).send('ezPAARSE is being updated, it should be back in a few minutes');
    }
    res.locals.updating = false;
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

/**
 * Set base URL depending on headers
 * Uses X-Forwarded-Proto and X-Forwarded-Host if provided by a reverse proxy
 */
app.use(function (req, res, next) {
  const host = req.header('x-forwarded-host') || config.EZPAARSE_HOSTNAME || req.headers.host;
  req.ezBaseURL = `${req.protocol}://${host}`;
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
app.use('/api/admin', require('./routes/admin'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/format', require('./routes/format'));
app.use('/api/info', require('./routes/info'));
app.use('/info', require('./routes/info'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/logs', require('./routes/logs'));
app.use('/api/views', require('./routes/views'));
app.use('/api/ezmesure', require('./routes/ezmesure'));
app.use('/api/middlewares', require('./routes/middlewares'));
app.use('/castor', require('./lib/castor'));
app.use('/', require('./routes/ws'));
app.use('/', require('./routes/logs'));

app.use('/api', (req, res, next) => {
  next(Boom.notFound());
});

// API error handler
app.use((err, req, res, next) => {
  const error = err.isBoom ? err : Boom.boomify(err, { statusCode: err.statusCode });

  if (isDev && error.isServer) {
    error.output.payload.stack = error.stack;
  }

  if (!res.headersSent) {
    res.status(error.output.statusCode).set(error.output.headers).json(error.output.payload);
  }
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