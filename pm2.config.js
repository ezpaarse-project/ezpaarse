/* eslint-disable camelcase */
'use strict';

const env = process.argv[process.argv.indexOf('--env') + 1];
const isDev = env === 'development';

module.exports = {
  apps : [{
    name: 'ezpaarse',
    script: 'server.js',
    node_args: isDev ? ['--inspect=0.0.0.0'] : undefined,
    exp_backoff_restart_delay: 100,
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 100000,
    max_memory_restart: '1500M',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    pid_file: './ezpaarse.pid',
    cwd: __dirname,
    watch: isDev ? ['**/*.js'] : false,
    env: {
      NODE_ENV: 'production'
    },
    env_development: {
      NODE_ENV: 'development'
    }
  }]
};
