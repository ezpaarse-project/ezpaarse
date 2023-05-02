'use strict';

const pm2 = require('pm2');

function restart () {
  const dockerEnv = process.env.DOCKER_ENV;
  if (dockerEnv) {
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  }
  setTimeout(() => {
    pm2.connect((err) => {
      pm2.restart('ezpaarse', (err) => {});
    });
  }, 1000);
}

module.exports = restart;
