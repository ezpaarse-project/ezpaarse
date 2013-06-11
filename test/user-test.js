/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
/*global describe, it*/
'use strict';

var helpers       = require('./helpers.js');
var fs            = require('fs');
var should        = require('should');

var resultMonoPlus  = require('./dataset/user-mono-plus-result.json');
var resultMonoSpace = require('./dataset/user-mono-space-result.json');
var resultMultiPlus = require('./dataset/user-multi-plus-result.json');

var logMonoPlus   = __dirname + '/dataset/user-mono-plus.log';
var logMonoSpace  = __dirname + '/dataset/user-mono-space.log';
var logMultiPlus  = __dirname + '/dataset/user-multi-plus.log';

describe('The server', function () {
  describe('receives a log on the HTTP POST / route with a user field', function () {
    it('separated by "+" and returns a JSON containing the fields specified by the user (@01)',
      function (done) {
      var headers = {
        'Accept'                     : 'application/json',
        'Log-Format-ezproxy'         : '%h - %u %t "%r" %s %b %{user}<[a-zA-Z0-9+]*>',
        'user-field0-src'            : 'user',
        'user-field0-dest-groupe'    : 'etu|persecr|uncas|unautre',
        'user-field0-dest-categorie' : '[0-9]{3}',
        'user-field0-sep'            : '+'
      };
      helpers.post('/', logMonoPlus, headers, function (error, res, body) {
        if (error) {
          throw error;
        }
        if (!res) {
          throw new Error('ezPAARSE is not running');
        }
        res.should.have.status(200);
        
        var result = JSON.parse(body);

        should.ok(helpers.compareArrays(result, resultMonoPlus),
          'ezPAARSE does not match the intended result');
        
        done();
      });
    });
  });
  describe('receives a log on the HTTP POST / route with a user field', function () {
    it('separated by " " and returns a JSON containing the fields specified by the user (@02)',
      function (done) {
      var headers = {
        'Accept'                      : 'application/json',
        'Log-Format-ezproxy'          : '%h - %u %t "%r" %s %b "%{user}<[a-zA-Z0-9 ]*>"',
        'user-field0-src'             : 'user',
        'user-field0-dest-groupe'     : 'Etudiant|Professeur|Secretaire',
        'user-field0-dest-categorie'  : 'FC|Y|M|C|A',
        'user-field0-dest-composante' : 'Droit|Lettre|Maths',
        'user-field0-sep'             : ' '
      };
      helpers.post('/', logMonoSpace, headers, function (error, res, body) {
        if (error) {
          throw error;
        }
        if (!res) {
          throw new Error('ezPAARSE is not running');
        }
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
      'containing the fields specified by the user (@03)',
      function (done) {
      var headers = {
        'Accept'                     : 'application/json',
        'Log-Format-ezproxy'         : '%h - %u %t "%r" %s %b %{user}<[a-zA-Z0-9+]*>',
        'user-field0-src'            : 'user',
        'user-field0-dest-groupe'    : 'etu|persecr|uncas|unautre',
        'user-field0-dest-categorie' : '[0-9]{3}',
        'user-field0-sep'            : '+'
      };
      helpers.post('/', logMultiPlus, headers, function (error, res, body) {
        if (error) {
          throw error;
        }
        if (!res) {
          throw new Error('ezPAARSE is not running');
        }
        res.should.have.status(200);
        
        var result = JSON.parse(body);

        should.ok(helpers.compareArrays(result, resultMultiPlus),
          'ezPAARSE does not match the intended result');
        
        done();
      });
    });
  });
});