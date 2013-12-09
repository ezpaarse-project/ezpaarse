/*global describe, it*/
'use strict';

var path    = require('path');
var should  = require('should');
var helpers = require('./helpers.js');

var logfile = path.join(__dirname, '/dataset/sd.relative-domain.log');

describe('The server', function () {
  describe('receives a log line with a relative URL', function () {
    it('and uses the domain provided in Relative-Domain (@01)', function (done) {
      var headers = {
        'Accept': 'application/json',
        'Relative-Domain': 'www.sciencedirect.com'
      };
      helpers.post('/', logfile, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);

        should.exist(body);
        should.ok(body.length, 'The server returned an empty response');
        var ecs = JSON.parse(body);
        ecs.should.be.an.instanceOf(Array);
        should.ok(ecs.length == 1, 'The server should return 1 EC, but it returned '
                                  + ecs.length);
        should.ok(ecs[0].platform == 'sd', 'the platform of the resulting EC should be sd, not '
                                           + ecs[0].platform);
        done();
      });
    });
  });
});