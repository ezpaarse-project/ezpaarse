'use strict';

var fs       = require('fs-extra');
var path     = require('path');
var spawn    = require('child_process').spawn;
var pkbClean = require('../pkb-cleaner.js');

var platformsDir = path.join(__dirname, '../../platforms');

/**
 * Execute the scrapers of one or more platforms
 */
module.exports = function () {

  var yargs = require('yargs')
    .usage('Execute the scrapers of one or more platforms' +
            '\nUsage: $0 [-alvfc] [Platform] [Platform] ...')
    .alias('help', 'h')
    .alias('all', 'a')
    .alias('list', 'l')
    .alias('clean', 'c')
    .alias('force', 'f')
    .alias('verbose', 'v')
    .describe('all', 'Execute all scrapers.')
    .describe('list', 'Only list scrapers without executing them.')
    .describe('clean', 'Clean PKB files when all scrapers has been executed.')
    .describe('force', 'Overwrite PKB files if they already exist.')
    .describe('verbose', 'Print scrapers output into the console.');
  var argv = yargs.argv;

  // show usage if --help option is used
  if (argv.help || (!argv.all && !argv._.length)) {
    yargs.showHelp();
    process.exit(0);
  }

  var platforms = argv._;
  var executed  = 0;

  fs.readdir(platformsDir, function (err, items) {
    if (err) { throw err; }

    nextPlatform();

    function nextPlatform() {
      var item = items.shift();
      if (!item) { return console.log('\nDone, %d scrapers executed', executed); }

      fs.stat(path.join(platformsDir, item), function (err, stat) {
        if (err) {
          console.error(err);
          return nextPlatform();
        }

        if (!stat.isDirectory())                         { return nextPlatform(); }
        if (item.charAt(0) == '.')                       { return nextPlatform(); }
        if (!argv.all && platforms.indexOf(item) === -1) { return nextPlatform(); }

        fs.readdir(path.join(platformsDir, item, 'scrapers'), function (err, files) {
          if (err && err.code != 'ENOENT') {
            console.error(err);
            return nextPlatform();
          }

          var scrapers = (files || []).filter(function (file) {
            return (file.substr(0, 7) == 'scrape_');
          });

          console.log('%s:', item);

          if (scrapers.length === 0) {
            console.log('  [no scrapers]');
            return nextPlatform();
          }

          var j = 0;
          (function nextScraper() {
            var scraper = scrapers[j++];
            if (!scraper) {

              if (!argv.clean) { return nextPlatform(); }

              return pkbClean({
                dir: path.join(platformsDir, item, 'pkb'),
                rewrite: true
              }).on('end', nextPlatform)
                .on('error', function (err) {
                  console.error(err);
                  nextPlatform();
                });
            }

            console.log('  %s', scraper);
            if (argv.list) { return nextScraper(); }

            var args = [];
            if (argv.force) { args.push('--force'); }

            var errorFired  = false;
            var scraperFile = path.join(platformsDir, item, 'scrapers', scraper);
            var child       = spawn(scraperFile, args, {
              stdio: argv.verbose ? 'inherit' : 'ignore'
            });

            child.on('error', function (err) {
              errorFired = true;
              console.error(err);
              nextScraper();
            });

            child.on('close', function () {
              executed++;
              if (!errorFired) { nextScraper(); }
            });
          })();
        });
      });
    }
  });
};
