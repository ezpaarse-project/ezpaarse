'use strict';

/*
* Command used to clean knowledge bases
*/

const clean = require('../pkb-cleaner.js');

exports.clean = function () {
  const yargs = require('yargs')
    .usage('Clean knowledge bases.' +
      '\n  Usage: $0 [-nvp] [DIR_TO_CLEAN]')
    .boolean(['n', 'v'])
    .string('p')
    .alias('platform', 'p')
    .alias('norewrite', 'n')
    .alias('verbose', 'v')
    .describe('platform', 'Name of a platform whose PKB should be cleaned.'
                        + '(if provided, ignore dir path)')
    .describe('norewrite', 'If provided, do not rewrite files once the check is complete.')
    .describe('verbose', 'Print all duplicated entries');
  const argv  = yargs.argv;

  // show usage if --help option is used
  if (argv.help || argv.h) {
    yargs.showHelp();
    process.exit(0);
  }

  const count   = {};
  const options = {
    dir: argv._[0],
    rewrite: !argv.norewrite
  };

  if (typeof argv.platform == 'string') {
    options.platform = argv.platform;
  }

  if (!options.dir && !options.platform) {
    yargs.showHelp();
    process.exit(0);
  }

  clean(options)
    .on('error', function (err) {
      if (err.code === 'ENOENT') {
        console.error('"%s" does not exist', err.path);
      } else if (err.code === 'ENOTDIR') {
        console.error('"%s" is not a directory', err.path);
      } else {
        throw err;
      }
    })
    .on('file', function (filePath) {
      console.log('Reading %s', filePath);
    })
    .on('missing-id', function (file, line) {
      if (argv.verbose) { console.log('[%s:%d] missing title_id', file, line); }

      if (count.hasOwnProperty(file)) {
        count[file].missingIds++;
      } else {
        count[file] = {
          duplicates: 0,
          missingIds: 1
        };
      }
    })
    .on('duplicate', function (id, file, line) {
      if (argv.verbose) { console.log('[%s:%d] %s', file, line, id); }

      if (count.hasOwnProperty(file)) {
        count[file].duplicates++;
      } else {
        count[file] = {
          duplicates: 1,
          missingIds: 0
        };
      }
    })
    .on('end', function () {
      console.log('\n%s complete', argv.norewrite ? 'Check' : 'Cleaning');
      let duplicates = 0;
      let missingIds = 0;
      let files = 0;

      for (const file in count) {
        console.log(`[${file}] ${count[file].duplicates} duplicates`);
        console.log(`[${file}] ${count[file].missingIds} missing title_id`);
        duplicates += count[file].duplicates;
        missingIds += count[file].missingIds;
        files++;
      }

      console.log(`
        ${duplicates} duplicates and ${missingIds} missing title_id found in ${files} files
      `);
    });
};
