/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var express = require('express'),
  pkg = require('./package.json'),
  config = require('./config.json'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path');

// to have a nice unix process name
process.title = pkg.name.toLowerCase();

require('./init.js')(function fill(parsers, knowledge) {
  var app = express();
  
  app.configure(function () {
    app.set('port', config.EZPAARSE_NODEJS_PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    //app.use(express.bodyParser());
    app.use(express.methodOverride());
    
// commented because disrupt log streaming (maybe to enable only for the HTML interface because will be needed by the futur authentication system)
//     app.use(express.cookieParser());
//     app.use(express.session({ secret: "ezpaarse" }));

    //app.use(cas.casauth({root: 'https://auth.inist.fr' }));
    app.use(app.router);
    app.use(require('less-middleware')({ src: __dirname + '/public' }));
    app.use(express.static(path.join(__dirname, 'public')));
  });

  app.configure('development', function () {
    app.use(express.errorHandler());
  });



  app.get('/', routes.index);

  // Routes relatives aux logs
  require('./routes/ws')(app, parsers, knowledge, config.EZPAARSE_IGNORED_DOMAINS);

  http.createServer(app).listen(app.get('port'), function () {
    console.log(pkg.name + "-" + pkg.version + " listening on port " + app.get('port') + " (pid is " + process.pid + ")");
  });
});
