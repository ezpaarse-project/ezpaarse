/*global describe, it*/
'use strict';

var path    = require('path');
var should  = require('should');
var helpers = require('./helpers.js');


var logFile = path.join(__dirname, 'dataset/istex.log');

function testistex(callback){
  var headers = {
      'Accept': 'application/json',
      'Force-Parser': 'istex'
    };

    helpers.post('/', logFile, headers, function (err, res, body) {
      if (!res) { throw new Error('ezPAARSE is not running'); }
      if (err)  { throw err; }
      res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);

      var result = JSON.parse(body);
      result.should.have.length(2);

      var ec = result[0];

      should.equal(ec['rtype'], 'QUERY');
      should.equal(ec['platform_name'], 'Istex');
   
      console.log(res.headers['job-report']);
      var reportURL = res.headers['job-report'];
      should.exist(reportURL, 'The header "Job-Report" was not sent by the server');

      helpers.get(reportURL, function (error, response, reportBody) {
        if (!response) { throw new Error('ezPAARSE is not running'); }
        if (error)     { throw error; }
        response.statusCode.should.equal(200,
          'failed to get the report, server responded with a code ' + response.statusCode);

        var report = JSON.parse(reportBody);
        report.should.have.property('general');
     

        callback();
      });
    });

}


describe('istex consultations', function () {
  it('should be istex enriched (@01)', function (done) {
    testistex(function(){
      testistex(done);           
    });
  });
});