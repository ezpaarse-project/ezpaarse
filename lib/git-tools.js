// map some git command
/*jslint maxlen: 180*/

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

  opt      = opt      || {};
  opt.cwd  = opt.cwd  || __dirname;
  callback = callback || function () {};

  if (win) {
    opt.env = opt.env || { PATH: winPath };
    exec(cmd, opt, callback);
  } else {
    exec(cmd, opt, callback);
  }
}

module.exports = {
  exec: function (cmd, opt, cb) { _command(bin + ' ' + cmd, opt, cb); },
  short: function (opt, cb)     { _command(bin + ' rev-parse --short HEAD', opt, cb); },
  long: function (opt, cb)      { _command(bin + ' rev-parse HEAD', opt, cb); },
  branch: function (opt, cb)    { _command(bin + ' rev-parse --abbrev-ref HEAD', opt, cb); },
  tag: function (opt, cb)       { _command(bin + ' describe --always --tag --abbrev=0', opt, cb); },
  changed: function (opt, cb)   {
    _command(bin + ' diff --name-only HEAD origin/master', opt, function (err, stdout) {
      if (err || !stdout) { return cb(err); }
      cb(null, stdout.trim().split(/[\r\n]+/));
    });
  },
  changedWithStatus: function (opt, cb)   {
    _command(bin + ' diff --name-status HEAD origin/master', opt, function (err, stdout) {
      if (err || !stdout) { return cb(err); }

      cb(null, stdout.trim().split(/[\r\n]+/).map(function (line) {
        return {
          status: line.charAt(0),
          name: line.substr(2)
        };
      }));
    });
  },
  log: function (opt, cb) {
    _command(bin + ' log --no-color --pretty=format:\'[ "%H", "%s", "%cr", "%an" ],\' --abbrev-commit', opt, function (str) {
      str = str.substr(0, str.length - 1);
      cb(JSON.parse('[' + str + ']'));
    });
  },
  status: function (opt, cb) {
    _command(bin + ' status', opt, function (str) {
      str = str.substr(0, str.length - 1);
      cb(str);
    });
  }
};