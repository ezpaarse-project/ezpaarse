/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
/*global describe, it*/
'use strict';

var helpers = require('./helpers.js');
var fs      = require('fs');
var should  = require('should');

var resultMonoPlus     = require('./dataset/user-mono-plus.result.json');
var resultMonoSpace    = require('./dataset/user-mono-space.result.json');
var resultMultiPlus    = require('./dataset/user-multi-plus.result.json');
var resultMultipleMisc = require('./dataset/user-multifields.result.json');

var logMonoPlus     = __dirname + '/dataset/user-mono-plus.log';
var logMonoSpace    = __dirname + '/dataset/user-mono-space.log';
var logMultiPlus    = __dirname + '/dataset/user-multi-plus.log';
var logMultipleMisc = __dirname + '/dataset/user-multifields.log';

describe('The server', function () {
  describe('receives a log on the HTTP POST / route with a user field', function () {
    it('separated by "+" and returns a JSON containing the fields specified by the user(@01)',
      function (done) {
      var headers = {
        'Accept'                     : 'application/json',
        'Log-Format-ezproxy'         : '%h - %u %t "%r" %s %b %{user}<[a-zA-Z0-9+]*>',
        'user-field0-src'            : 'user',
        'user-field0-dest-groupe'    : 'etu|persecr|uncas|unautre',
        'user-field0-dest-categorie' : '[0-9]{3}',
        'user-field0-sep'            : '+'
      };
      helpers.post('/', logMonoPlus, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);
        
        var result = JSON.parse(body);

        should.ok(helpers.compareArrays(result, resultMonoPlus),
          'ezPAARSE does not match the intended result');
        
        done();
      });
    });
  });
  describe('receives a log on the HTTP POST / route with a user field', function () {
    it('separated by " " and returns a JSON containing the fields specified by the user(@02)',
      function (done) {
      var headers = {
        'Accept'                      : 'application/json',
        'Log-Format-ezproxy'          : '%h - %u %t "%r" %s %b "%{user}<[a-zA-Z0-9 ]*>"',
        'user-field0-src'             : 'user',
        'user-field0-dest-groupe'     : 'Etudiant|Professeur|Secretaire',
        'user-field0-dest-categorie'  : 'FC|Y|M|C|A',
        'user-field0-dest-composante' : 'Droit|Lettre|Maths',
        'user-field0-sep'             : 'space'
      };
      helpers.post('/', logMonoSpace, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);
        
        var result = JSON.parse(body);

        should.ok(helpers.compareArrays(result, resultMonoSpace),
          'ezPAARSE does not match the intended result');
        
        done();
      });
    });
  });
  describe('receives a log on the HTTP POST / route with a user field', function () {
    it('separated by "+" and containing a multivalue sub-field and returns a JSON ' +
      'containing the fields specified by the user(@03)',
      function (done) {
      var headers = {
        'Accept'                     : 'application/json',
        'Log-Format-ezproxy'         : '%h - %u %t "%r" %s %b %{user}<[a-zA-Z0-9+]*>',
        'user-field0-src'            : 'user',
        'user-field0-dest-groupe'    : 'etu|persecr|uncas|unautre',
        'user-field0-dest-categorie' : '[0-9]{3}',
        'user-field0-sep'            : '+'
      };
      helpers.post('/', logMultiPlus, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);
        
        var result = JSON.parse(body);

        should.ok(helpers.compareArrays(result, resultMultiPlus),
          'ezPAARSE does not match the intended result');
        
        done();
      });
    });
  });
  describe('receives a log on the HTTP POST / route with multiple user fields', function () {
    it('containing multivalue sub-fields and returns a JSON ' +
      'containing the fields specified by the user(@04)',
      function (done) {
      var headers = {
        'Accept'                       : 'application/json',
        'Log-Format-ezproxy'           : '%h - %u %t "%r" %s %b %{user1}<[a-zA-Z0-9+]*>'
                                       + ' "%{user2}<[a-zA-Z0-9 ]*>"',
        'user-field0-src'              : 'user1',
        'user-field0-dest-groupe1'     : 'etu|persecr|uncas|unautre',
        'user-field0-dest-categorie1'  : '[0-9]{3}',
        'user-field0-sep'              : '+',
        'user-field0-residual'         : 'rest1',
        'user-field1-src'              : 'user2',
        'user-field1-dest-groupe2'     : 'Etudiant|Professeur|Secretaire',
        'user-field1-dest-categorie2'  : 'FC|Y|M|C|A',
        'user-field1-dest-composante2' : 'Droit|Lettre|Maths',
        'user-field1-sep'              : 'space'
      };
      helpers.post('/', logMultipleMisc, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        // fs.writeFileSync('gerard.result.json', body);
        res.should.have.status(200);
        
        var result = JSON.parse(body);

        should.ok(helpers.compareArrays(result, resultMultipleMisc),
          'ezPAARSE does not match the intended result');
        
        done();
      });
    });
  });
});