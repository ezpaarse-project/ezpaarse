'use strict';

/*
* Command used to enrich csv source with geolocalization info
*
* */

exports.hostLocalize = function () {
  var csvextractor = require('../../lib/csvextractor.js');
  var hostlocalize = require('../../lib/hostlocalize.js');
  require('sugar'); // add more methods to Objects (like merge)
  var yargs = require('yargs')
    .usage('Enrich a csv with geolocalisation from host ip.' +
      '\n  Usage: $0 [-s] [-f string | -k string]')
    .alias('file', 'f')
    .alias('hostkey', 'k')
    .alias('silent', 's')
    .describe('hostkey', 'the field name containing host ip (default "host").')
    .describe('file', 'A csv file to parse. If absent, will read from standard input.')
    ;
  var argv = yargs.argv;

  // *  from csvextractor

  // show usage if --help option is used
  if (argv.help || argv.h) {
    yargs.showHelp();
    process.exit(0);
  }

  var options = {};
  var fields  = [];
  var source = argv.file ? argv.file : process.stdin;
  var hostkey = 'host'; // default key field for ip address

  if (argv.hostkey) {
    hostkey = argv.hostkey;
  }

  if (argv.silent) {
    options.silent = true;
  }

  // by default csv
  csvextractor.extract(source, fields, function (err, records) {
    if (err) {
      console.error(err); // just notify the error and continue
    }
    // csv header line with keys from first record
    var first = records[0];
    var commonFields = Object.keys(first).intersect(hostlocalize.geoipFields);
    if (commonFields.length !== 0) {
      console.error('Error : geoip fields (', commonFields.join(', '), ') already in input file');
      process.exit();
    }
    hostlocalize.resolve(first[hostkey],
      function (geo) {
        // record fields first and then geoip fields
        process.stdout.write(Object.keys(first).join(';')
          + Object.keys(geo).join(';') + '\n');
        // all other records
        records.forEach(function (record) {
          if (Object.keys(record).indexOf(hostkey) === -1) {
            console.error('Error : host key field ', hostkey, ' not found');
            return;
          }
          hostlocalize.resolve(record[hostkey],
            function (geo) {
              // record fields first and then geoip fields
              process.stdout.write(Object.values(record).join(';')
                + Object.values(geo).join(';') + '\n');
            }
          );
        });
      }
    );
  }, options);
};
