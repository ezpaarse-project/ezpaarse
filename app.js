/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var express       = require('express');
var pkg           = require('./package.json');
var config        = require('./config.json');
var http          = require('http');
var path          = require('path');
var fs            = require('fs');
var parsers       = require('./lib/init.js');
var folderChecker = require('./lib/folderchecker.js');
var FolderReaper  = require('./lib/folderreaper.js');
var winston       = require('winston');

winston.addColors({ verbose: 'green', info: 'green', warn: 'yellow', error: 'red' });

// Set up cleaning jobs for the temporary folder
var red   = '\u001b[31m';
var reset = '\u001b[0m';
if (!folderChecker.check(__dirname + '/tmp')) {
  var err = red;
  err += 'Warning! Temporary folder not found, files won\'t be stored on disk.';
  err += reset;
  console.error(err);
} else if (config.EZPAARSE_TMP_CYCLE && config.EZPAARSE_TMP_LIFETIME) {
  var folderReaper = new FolderReaper({
    recursive: true,
    lifetime: config.EZPAARSE_TMP_LIFETIME,
    cycle: config.EZPAARSE_TMP_CYCLE
  });
  folderReaper.watch(__dirname + '/tmp');
} else {
  var err = red;
  err += 'Warning! Temporary folder won\'t be automatically cleaned, ';
  err += 'fill TMP_CYCLE and TMP_LIFETIME in the configuration file.';
  err += reset;
  console.error(err);
}

// to have a nice unix process name
process.title = pkg.name.toLowerCase();

// write pid to ezpaarse.pid file
var optimist = require('optimist')
  .describe('--pidFile', 'the pid file where ezpaarse pid is stored');
if (optimist.argv.pidFile) {
  fs.writeFileSync(optimist.argv.pidFile, process.pid);
}

var app = express();

// connect ezpaarse env to expressjs env
config.EZPAARSE_ENV = process.env.NODE_ENV || config.EZPAARSE_ENV;
app.set('env', config.EZPAARSE_ENV);

app.configure('development', function () {
  // http://www.senchalabs.org/connect/middleware-logger.html
  app.use(express.logger('dev'));
  
  app.use(express.errorHandler());
});
app.configure('production', function () {
  // http://www.senchalabs.org/connect/middleware-logger.html
  app.use(express.logger({
    stream: fs.createWriteStream(__dirname + '/logs/access.log', { flags: 'a+' })
  }));
});

app.configure(function () {
  app.set('port', config.EZPAARSE_NODEJS_PORT || 3000);
  
  // for dynamics HTML pages (ejs template engine is used)
  // https://github.com/visionmedia/ejs
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');

  // used to expose a favicon in the browser
  // http://www.senchalabs.org/connect/middleware-favicon.html
  // todo: favico should be created
  app.use(express.favicon());

  app.use(express.methodOverride());
  app.use(express.cookieParser());
  
  // Set the ezPAARSE-Version header in all responses
  app.use(function (req, res, next) {
    res.header('ezPAARSE-Version', pkg.version || 'N/A');
    next();
  });

  // calculate the baseurl depending on reverse proxy variables
  app.use(function (req, res, next) {
    req.ezBaseURL = 'http://' +
      (req.headers['x-forwarded-host'] || req.headers.host);
    next();
  });

  // global object which contains
  // temporary data about ezPAARSE jobs
  app.ezJobs = {};

  // routes handling
  app.use(app.router);
  
  // used to compile .less files to .css
  // http://lesscss.org/
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  
  // used to expose static files from the public folder
  app.use(express.static(path.join(__dirname, 'public')));
});

// log related routes
require('./routes/ws')(app, parsers, config.EZPAARSE_IGNORED_DOMAINS);
require('./routes/info')(app);
require('./routes/logs')(app);

var server = http.createServer(app);
// Set socket.io to handle uploads
require('./lib/upload.js')(server, app.get('port'), false);

server.listen(app.get('port'), function () {
  console.log(pkg.name + "-" + pkg.version +
    " listening on http://localhost:" + app.get('port') + " (pid is " + process.pid + ")");
});
