/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var express       = require('express');
var pkg           = require('./package.json');
var config        = require('./config.json');
var routes        = require('./routes');
var http          = require('http');
var path          = require('path');
var fs            = require('fs');
var parsers       = require('./lib/init.js');
var folderChecker = require('./lib/folderChecker.js');

if (!folderChecker.check(__dirname + '/tmp')) {
  console.error('\u001b[31mWarning! Temporary folder not found, files won\'t be stored on disk.\u001b[0m')
}

// to have a nice unix process name
process.title = pkg.name.toLowerCase();

// write pid to ezpaarse.pid file
var optimist = require('optimist')
  .describe('--pidFile', 'the pid file where ezpaarse pid is stored');
if (optimist.argv.pidFile) {
  console.log(optimist.argv.pidFile);
  fs.writeFileSync(optimist.argv.pidFile, process.pid);
}

var app = express();

// connect ezpaarse version to expressjs env version
app.set('env', config.EZPAARSE_VERSION);

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
  
  app.use(express.logger('dev'));
  //app.use(express.bodyParser());
  app.use(express.methodOverride());
  
  // Set the ezPAARSE-Version header in all responses
  app.use(function (req, res, next) {
    res.header('ezPAARSE-Version', pkg.version || 'N/A');
    next();
  });

  app.use(express.cookieParser());
  app.use(express.session({ secret: "ezpaarse", key: "ezpaarse.sid" }));

  // routes handling
  app.use(app.router);
  
  // used to compile .less files to .css
  // http://lesscss.org/
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  
  // used to expose static files from the public folder
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
  app.use(express.errorHandler());
});

app.get('/', routes.index);

// Routes relatives aux logs
require('./routes/ws')(app, parsers, config.EZPAARSE_IGNORED_DOMAINS);
require('./routes/info')(app);

var server = http.createServer(app);
// Set socket.io to handle uploads
require('./lib/upload.js')(server, app.get('port'), false);

server.listen(app.get('port'), function () {
  console.log(pkg.name + "-" + pkg.version +
    " listening on http://localhost:" + app.get('port') + " (pid is " + process.pid + ")");
});