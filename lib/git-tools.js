// map some git command
/* eslint max-len: 0 */

'use strict';

var exec = require('child_process').exec;
var path = require('path');
var os   = require('os');

var win     = /^win/.test(os.platform());
var bin     = (win ? 'git.exe' : 'git');
var winPath = process.env.PATH + ';' + path.join(__dirname, '../portable-git/bin');

function _command(cmd, opt, callback) {

  if (typeof opt == 'function') {
    callback = opt;
    opt = {};
  }

  opt      = opt      || {};
  opt.cwd  = opt.cwd  || __dirname;
  callback = callback || function () {};

  if (win) { opt.env = opt.env || { PATH: winPath }; }

  exec(cmd, opt, function (err, stdout, stderr) {
    return callback(err, stdout.trim(), stderr.trim());
  });
}

module.exports = {
  exec: function (cmd, opt, cb) { _command(bin + ' ' + cmd, opt, cb); },
  short: function (opt, cb)     { _command(bin + ' rev-parse --short HEAD', opt, cb); },
  long: function (opt, cb)      { _command(bin + ' rev-parse HEAD', opt, cb); },
  branch: function (opt, cb)    { _command(bin + ' rev-parse --abbrev-ref HEAD', opt, cb); },
  tag: function (opt, cb)       { _command(bin + ' describe --always --tag --abbrev=0', opt, cb); },
  status: function (opt, cb)    { _command(bin + ' status', opt, cb); },
  date: function (opt, cb)      { _command(bin + ' log -1 --date=short --pretty=format:"%cd"', opt, cb); },
  changed: function (opt, cb)   {
    _command(bin + ' diff --name-only HEAD origin/master', opt, function (err, stdout) {
      if (err) { return cb(err); }

      cb(null, stdout ? stdout.split(/[\r\n]+/) : []);
    });
  },
  changedWithStatus: function (opt, cb)   {
    _command(bin + ' diff --name-status HEAD origin/master', opt, function (err, stdout) {
      if (err) { return cb(err); }

      if (!stdout) { return cb(null, []); }

      cb(null, stdout.split(/[\r\n]+/).map(function (line) {
        return {
          status: line.charAt(0),
          name: line.substr(2)
        };
      }));
    });
  },
  log: function (opt, cb) {
    _command(bin + ' log --no-color --pretty=format:\'[ "%H", "%s", "%cr", "%an" ],\' --abbrev-commit', opt, function (err, stdout) {
      cb(err, JSON.parse('[' + stdout.substr(0, stdout.length - 1) + ']'));
    });
  }
};