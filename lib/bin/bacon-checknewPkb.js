'use strict';
var bacon = require('../../platforms/.lib/bacon_harvester.js');

module.exports = function () {

  var yargs = require('yargs')
      .usage('Check new Pkb on bacon site ...')
      .alias('help', 'h')
      .alias('verbose', 'v')
      .describe('verbose', 'blabla.');
  var argv = yargs.argv;

    // show usage if --help option is used
  if (argv.help ) {
    yargs.showHelp();
    process.exit(0);
  }


  if (argv.verbose){
  	bacon.checkNewPkb();
  }
}