/*global describe, it*/
'use strict';

var path    = require('path');
var should  = require('should');
var helpers = require('./helpers.js');

var logFile = path.join(__dirname, '/dataset/oncampus.log');

describe('The server', function () {
    describe('receives a log file', function () {
        it('and correctly recognizes on campus accesses (@01)', function (done) {
            var headers = {
                'Accept': 'application/json',
                'Crypted-Fields': 'none'
            };
            helpers.post('/', logFile, headers, function (err, res, body) {
                if (!res) {
                    throw new Error('ezPAARSE is not running');
                }
                if (err) {
                    throw err;
                }
                //res.should.have.status(200);
                res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);

                var result = JSON.parse(body);
                result.should.have.length(2);

                var ec0 = result[0];
                // 1879-2065 => 83506357
                ec0['on_campus'].should.equal('N', 'expected N, got ' + ec0['on_campus']);

                var ec1 = result[1];
                // 1879-2065 => 83506357
                ec1['on_campus'].should.equal('Y', 'expected Y, got ' + ec1['on_campus']);

                var reportURL = res.headers['job-report'];
                should.exist(reportURL, 'The header "Job-Report" was not sent by the server');
                helpers.get(reportURL, function (error, response, reportBody) {
                    if (!response) { throw new Error('ezPAARSE is not running'); }
                    if (error)     { throw error; }
                    response.statusCode.should.equal(200,
                        'failed to get the report, server responded with a code ' + response.statusCode);
                    var report = JSON.parse(reportBody);
                    report.should.have.property('general');
                    report.general.should.have.property('on-campus-accesses');
                    report.general['on-campus-accesses'].should.be.type('number');
                    report.general['on-campus-accesses'].should.equal(1,
                        'too many of campus accesses');

                    done();
                });
                //done();
            });
        });
    });
});