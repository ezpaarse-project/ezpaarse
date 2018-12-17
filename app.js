/* eslint no-console: 0 */

const { Nuxt, Builder } = require('nuxt')

const app    = require('express')()
const logger = require('morgan')

const cookieSession = require('cookie-session');
const cookieParser  = require('cookie-parser');
const auth          = require('./lib/auth-middlewares.js');
const passport      = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const LocalStrategy = require('passport-local').Strategy;

process.env.PORT = 59599

const isDev = app.get('env') !== 'production'
if (isDev) { app.use(logger('dev')) }

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

// Import API Routes
app.use('/api', require('./client/api/index.js'))
app.use('/castor', require('./lib/castor.js'))
app.use('/', require('./client/api/ws'))

// API error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.write(isDev ? err.stack : err.message)
  res.end()
})

// Import and Set Nuxt.js options
const nuxtConfig = require('./nuxt.config.js')
nuxtConfig.dev = isDev

// Init Nuxt.js
const nuxt = new Nuxt(nuxtConfig)
app.use(nuxt.render)

// Build only in dev mode
if (nuxtConfig.dev) {
  new Builder(nuxt).build()
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
}

module.exports = app