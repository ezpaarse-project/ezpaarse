'use strict';

const fs = require('fs-extra');
const uuid = require('uuid');
const path = require('path');
const Boom = require('boom');
const Job = require('../lib/job.js');
const uuidRegExp = /^\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\/?$/;

let mime;
// mime>=4 does not support CommonJS
import('mime').then(m => { mime = m.default; });

const { Router } = require('express');
const app = Router();

/**
 * Route used for deferred ECs downloads
 * ?filename=myname can be used to force a specific filename for the download
 * Example: /3e167f80-aa9f-11e2-b9c5-c7c7ad0be3cd
 */
app.get(uuidRegExp, function (req, res, next) {
  const rid = req.params[0];
  const requestedName = req.query.filename;
  const jobDir = path.resolve(__dirname, '../tmp/jobs/', rid.charAt(0), rid.charAt(1), rid);

  fs.readdir(jobDir, function (err, files) {
    if (err) {
      return next(err.code == 'ENOENT' ? Boom.notFound() : err);
    }

    const reg = /.*\.job-ecs(\.[a-z]+){1,2}$/;
    const filename = files.find(name => reg.test(name));

    if (!filename) {
      return next(Boom.notFound());
    }

    const ext = filename.split('.').pop();
    const name = requestedName ? `${requestedName}.${ext}` : `${rid.substr(0, 8)}_${filename}`;

    res.writeHead(200, {
      'Content-Type': mime.getType(ext),
      'Content-Disposition': `attachment; filename="${name}"`
    });

    fs.createReadStream(path.resolve(jobDir, filename)).pipe(res);
  });
});

function startJob(req, res, next) {
  const jobID = req.params[0] || uuid.v1();
  const job = new Job(req, res, jobID, { resIsDeferred: !!req.params[0] });
  job._run()
    .then(() => res.end())
    .catch(next);
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


module.exports = app;