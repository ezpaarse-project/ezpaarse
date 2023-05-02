'use strict';

const pm2 = require('pm2');

function restart() {
  const dockerEnv = process.env.DOCKER_ENV;
  setTimeout(() => {
    if (dockerEnv) {
      return process.exit(0);
    }
    pm2.connect((err) => {
      pm2.restart('ezpaarse', (err) => { });
    });
  }, 1000);
}

module.exports = restart;
