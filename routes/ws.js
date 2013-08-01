'use strict';

var fs            = require('fs');
var uuid          = require('uuid');
var path          = require('path');
var mime          = require('mime');
var config        = require('../config.json');
var Job           = require('../lib/job.js');
var ezJobs        = require('../lib/jobs.js');
var rgf           = require('../lib/readgrowingfile.js');
var uuidRegExp    = /^\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\/?$/;

module.exports = function (app) {

  /**
   * Route used for deferred ECs downloads
   * ?filename=myname can be used to force a specific filename for the download
   * Example: /3e167f80-aa9f-11e2-b9c5-c7c7ad0be3cd
   */
  app.get(uuidRegExp, function (req, res) {
    var rid  = req.params[0];
    var name = req.query.filename ? req.query.filename : rid;

    // check if this job exists
    if (ezJobs[rid] && ezJobs[rid].ecsPath && ezJobs[rid].ecsStream) {
      console.log('Serving growing result file');
      var ext = mime.extension(ezJobs[rid].contentType);
      res.writeHead(200, {
        'Content-Type': ezJobs[rid].contentType,
        'Content-Disposition': 'attachment; filename="' + name + '.' + ext + '"'
      });

      console.log('Requesting deferred result ECs file (while response is generated)');
      // if job is still running (ECs are still writen in the temp file)
      // use the GrowingFile module to stream the result to the HTTP response
      rgf.readGrowingFile({
        sourceFilePath: ezJobs[rid].ecsPath,
        onData: function (data) {
          console.log('Data added to ECs temp file (' + data.length + ' bytes)');
          res.write(data);
        },
        isStillGrowing: function () {
          return !ezJobs[rid].ecsStreamEnd;
        },
        lastByteOfFile: function () {
          return ezJobs[rid].byteWriten;
        },
        endCallback: function () {
          console.log('ECs temp file completed');
          res.end();
        }
      });
    } else {
      console.log('Serving full result file');
      var jobDir = path.join(__dirname, '/../tmp/jobs/', rid.charAt(0), rid.charAt(1), rid);
      if (!fs.existsSync(jobDir)) {
        res.status(404);
        res.end();
        return;
      }
      fs.readdir(jobDir, function (err, files) {
        if (err) {
          res.status(500);
          res.end();
        }
        var reg = /^job-ecs\.([a-z]+)$/;
        var filename;
        for (var i in files) {
          filename = files[i];
          
          if (reg.test(filename)) {
            var ext = filename.split('.').pop();

            res.writeHead(200, {
              'Content-Type': mime.lookup(ext),
              'Content-Disposition': 'attachment; filename="' + name + '.' + ext + '"'
            });
            fs.createReadStream(path.join(jobDir, filename)).pipe(res);
            return;
          }
        }
        res.status(404);
        res.end();
      });
    }
  });

  /**
   * POST data to ezPAARSE
   * two way to start a job:
   *  - POST data on /
   *  - PUT  data on /:uuid
   *  - POST data on /:uuid?_METHOD=PUT
   * Notice: resIsDeferred = true means that the result will be stored in a
   * tmp file to make possible a deferred download
   */
  app.post('/', function (req, res) {
    var jobID = uuid.v1();

    new Job(req, res, jobID, {
      resIsDeferred: false,
      socket: app.io.sockets.socket(req.header('Socket-ID')),
      defaultTracesLevel: (app.get('env') == 'production' ? 'info' : 'verbose')
    })._run();
  });
  app.put(uuidRegExp, function (req, res) {
    var jobID = req.params[0];

    new Job(req, res, jobID, {
      resIsDeferred: true,
      socket: app.io.sockets.socket(req.header('Socket-ID')),
      defaultTracesLevel: (app.get('env') == 'production' ? 'info' : 'verbose')
    })._run();
  });
  // this route is useful because sometime PUT is not allowed by reverse proxies
  // PUT is replaced by a POST with a _METHOD=PUT as a query
  app.post(uuidRegExp, function (req, res) {
    var jobID = req.params[0];
    if (req.query._METHOD == 'PUT') {

      new Job(req, res, jobID, {
        resIsDeferred: true,
        socket: app.io.sockets.socket(req.header('Socket-ID')),
        defaultTracesLevel: (app.get('env') == 'production' ? 'info' : 'verbose')
      })._run();
    } else {
      res.send(400, 'Please add _METHOD=PUT as a query in the URL (RESTful way)');
    }
  });

  /**
   * GET route on /
   */
  app.get('/', function (req, res) {
    res.render('ws', { title: 'ezPAARSE - Web service' });
  });

  /**
   * GET route on /datasets/
   * Returns a list of all datasets
   */
  app.get(/^\/datasets(\/)?$/, function (req, res) {
    res.type('application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    
    var fillTree = function (tree, rootFolder, folder) {
      var absFolder = path.join(rootFolder, folder);
      var files = fs.readdirSync(absFolder);
      if (!files) {
        res.status(500);
        res.end();
        return tree;
      }

      files.forEach(function (f) {
        var file = path.join(folder, f);
        var absFile = path.join(rootFolder, file);
        var stats = fs.statSync(absFile);
        if (!stats) {
          return;
        }
        if (stats.isDirectory()) {
          tree = fillTree(tree, rootFolder, file);
        } else {
          // only list log files (.log or .log.gz)
          if (! /\.log$/.test(f) && ! /\.log\.gz$/.test(f)) {
            return;
          }
          var size  = stats.size;
          var unit  = '';
          if (size < 1024) {
            unit = 'octets';
          } else if ((size /= 1024).toFixed(2) < 1024) {
            unit = 'Ko';
          } else if ((size /= 1024).toFixed(2) < 1024) {
            unit = 'Mo';
          } else if ((size /= 1024).toFixed(2) < 1024) {
            unit = 'Go';
          }
          size = (Math.floor(size * 100) / 100) + ' ' + unit;
          tree[f] = {
            location: file,
            size: size
          }
        }
      });
      return tree;
    }
    if (config.EZPAARSE_LOG_FOLDER) {
      var rootFolder = path.join(__dirname, '..', config.EZPAARSE_LOG_FOLDER);
      if (fs.existsSync(rootFolder)) {
        var tree = {};
        tree = fillTree(tree, rootFolder, '.');
        res.status(200);
        res.write(JSON.stringify(tree, null, 2));
        res.end();
      } else {
        res.status(404);
        res.end();
      }
    } else {
      res.status(500);
      res.end();
    }
  });
};