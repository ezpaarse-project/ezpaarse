/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var debug    = require('debug')('log');
var fs       = require('fs');
var Writer   = require('../output/writer.js');

module.exports = function (app, parsers, knowledge, ignoredDomains) {
  
  /**
   * GET route on /ws/
   */
  app.get('/ws/info/platforms', function (req, res) {
    res.status(200);

    var delimiter = '';
    var platformsFolder = __dirname + '/../platforms';
    var cfgFilename = 'manifest.json';
    var folders = fs.readdirSync(platformsFolder);
    res.write('[');

    for (var i in folders) {
      var folder = folders[i];
      var configFile = platformsFolder + '/' + folder + '/' + cfgFilename;
      var parserFile = platformsFolder + '/' + folder + '/parser';

      var configExists = fs.existsSync(configFile) && fs.statSync(configFile).isFile();
      var parserExists = fs.existsSync(parserFile) && fs.statSync(parserFile).isFile();
      if (configExists && parserExists) {
        var config = JSON.parse(fs.readFileSync(configFile, 'UTF-8'));
        if (config instanceof Object) {
          var platform = {};
          platform.longname = config.longname;
          platform.version = config.version;
          platform.describe = config.describe;
          platform.docurl = config.docurl;
          res.write(delimiter + JSON.stringify(platform,null,2));
          if (delimiter == '') { delimiter = ','; }
        }
      }
    }

    res.write(']');
    res.end();
  });
  
};