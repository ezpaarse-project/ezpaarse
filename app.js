/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var express = require('express'),
  pkg = require('./package.json'),
  config = require('./config.json'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path'),
  fs = require('fs');


// to have a nice unix process name
process.title = pkg.name.toLowerCase();

// write pid to ezpaarse.pid file
var optimist = require('optimist').describe('--pidFile', 'the pid file where ezpaarse pid is stored');
if (optimist.argv.pidFile) {
  console.log(optimist.argv.pidFile);
  fs.writeFileSync(optimist.argv.pidFile, process.pid);
}

require('./init.js')(function fill(parsers, knowledge) {
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
    
// commented because disrupt log streaming (maybe to enable for
// the future HTML interface as it will be needed by the authentication system)
//     app.use(express.cookieParser());
//     app.use(express.session({ secret: "ezpaarse" }));

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
  require('./routes/ws')(app, parsers, knowledge, config.EZPAARSE_IGNORED_DOMAINS);
  require('./routes/info')(app);

  http.createServer(app).listen(app.get('port'), function () {
    console.log(pkg.name + "-" + pkg.version +
      " listening on http://localhost:" + app.get('port') + " (pid is " + process.pid + ")");
  });
});
