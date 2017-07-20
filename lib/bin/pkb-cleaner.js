'use strict';

/*
* Command used to clean knowledge bases
*/

var clean = require('../pkb-cleaner.js');

exports.clean = function () {
  var yargs = require('yargs')
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
  var argv  = yargs.argv;

  // show usage if --help option is used
  if (argv.help || argv.h) {
    yargs.showHelp();
    process.exit(0);
  }

  var count   = {};
  var options = {
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
    .on('duplicate', function (id, file, line) {
      if (argv.verbose) { console.log('[%s:%d] %s', file, line, id); }

      if (count.hasOwnProperty(file)) {
        count[file]++;
      } else {
        count[file] = 1;
      }
    })
    .on('end', function () {
      console.log('\n%s complete', argv.norewrite ? 'Check' : 'Cleaning');
      var total = 0;
      var files = 0;
      for (var file in count) {
        console.log('[%s] %s duplicates', file, count[file]);
        total += count[file];
        files++;
      }
      console.log('%s duplicates found in %s files', total, files);
    });
};
