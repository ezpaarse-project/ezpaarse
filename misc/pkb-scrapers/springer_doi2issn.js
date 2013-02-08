#!/usr/bin/env node

var request  = require('request');
var jsdom    = require('jsdom');
var $        = require('jquery');
var optimist = require('optimist')
    .usage('Translate DOI to ISSN\nUsage: $0 --doi="[doi-string]"')
    .demand('doi')
    .describe('doi', 'DOI example: 10.1007/s12046-009-0052-7');
var argv = optimist.argv;

// show usage if --help option is used
if (argv.help) {
  optimist.showHelp();
  process.exit(0);
}

// Resolve doi at http://dx.doi.org
// example: http://dx.doi.org/10.1007/s12046-009-0052-7
var url = 'http://dx.doi.org/' + argv.doi;
request.get(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    
    // parse the html and create a dom window
    var window = jsdom.jsdom(body, null, {
      // standard options:  disable loading other assets
      // or executing script tags
      FetchExternalResources: false,
      ProcessExternalResources: false,
      MutationEvents: false,
      QuerySelector: false
    }).createWindow();    
    $ = $.create(window); // apply jquery to the window

    // extract issn from the html (easy with jquery !)
    // example :   <dd id="abstract-about-issn">0256-2499</dd>
    var output = { 'issn' : $('#abstract-about-issn').text().trim(),
                   'eissn': $('#abstract-about-electronic-issn').text().trim() };
    process.stdout.write( JSON.stringify(output, null, '  ') + '\n');
    
    process.exit(0);
  } else {
    process.stderr.write('Network error - ' + url + '\n');
    process.exit(0);
  }
});