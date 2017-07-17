'use strict';

var fs         = require('graceful-fs');
var uuid       = require('uuid');
var path       = require('path');
var mime       = require('mime');
var Job        = require('../lib/job.js');
var ezJobs     = require('../lib/jobs.js');
var rgf        = require('../lib/readgrowingfile.js');
var uuidRegExp = /^\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\/?$/;

module.exports = function (app) {

  /**
   * Route used for deferred ECs downloads
   * ?filename=myname can be used to force a specific filename for the download
   * Example: /3e167f80-aa9f-11e2-b9c5-c7c7ad0be3cd
   */
  app.get(uuidRegExp, function (req, res) {
    var rid           = req.params[0];
    var job           = ezJobs[rid];
    var requestedName = req.query.filename;

    // check if this job exists
    if (job && job.ecsPath && job.ecsStream) {

      var name = path.basename(job.ecsPath);
      if (requestedName) { name = requestedName + '.' + job.fileExtension; }

      res.writeHead(200, {
        'Content-Type': job.contentType,
        'Content-Disposition': 'attachment; filename="' + name + '"'
      });

      // if job is still running (ECs are still writen in the temp file)
      // use the GrowingFile module to stream the result to the HTTP response
      rgf.readGrowingFile({
        sourceFilePath: job.ecsPath,
        onData: function (data) { res.write(data); },
        isStillGrowing: function () { return (job.ecsStream != null); },
        endCallback: function () { res.end(); }
      });
    } else {
      var jobDir = path.join(__dirname, '/../tmp/jobs/', rid.charAt(0), rid.charAt(1), rid);

      fs.readdir(jobDir, function (err, files) {
        if (err) {
          res.status(err.code == 'ENOENT' ? 404 : 500);
          return res.end();
        }

        var reg = /.*\.job-ecs(\.[a-z]+){1,2}$/;
        var filename;
        for (var i = files.length - 1; i >= 0; i--) {
          filename = files[i];

          if (reg.test(filename)) {
            var ext  = filename.split('.').pop();
            var name;
            if (requestedName) { name = requestedName + '.' + ext; }
            else               { name = rid.substr(0, 8) + '_' + filename; }

            res.writeHead(200, {
              'Content-Type': mime.lookup(ext),
              'Content-Disposition': 'attachment; filename="' + name + '"'
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

  function startJob(req, res) {
    var jobID = req.params[0] || uuid.v1();
    new Job(req, res, jobID, { resIsDeferred: !!req.params[0] })._run();
  }

  /**
   * POST data to ezPAARSE
   * two way to start a job:
   *  - POST data on /
   *  - PUT  data on /:uuid
   *  - POST data on /:uuid?_METHOD=PUT
   * Notice: resIsDeferred = true means that the result will be stored in a
   * tmp file to make possible a deferred download
   */
  app.post('/', startJob);
  app.put(uuidRegExp, startJob);
};
