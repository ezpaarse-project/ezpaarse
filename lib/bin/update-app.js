#!/usr/bin/env node
'use strict';

var spawn = require('child_process').spawn;

var child = spawn('../../bin/update-app', process.argv.slice(2), {
  cwd: __dirname,
  detached: true,
  stdio: ['ignore', 'ignore', 'ignore']
});

child.unref();
