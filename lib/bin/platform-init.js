'use strict';

/*
* CLI platform initializer
* Creates a platform directory with basic files
*/

var readline  = require('readline');
var fs        = require('fs');
var path      = require('path');
var moment    = require('moment');
var Stackware = require('stackware');

var platformsDir = path.join(__dirname, '../../platforms');
var skeletonPath = path.join(platformsDir, '/js-parser-skeleton/parser.js');

module.exports = function () {
  var currentCompletion;
  var possibleFields = {};

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: function (line) {
      var i = line.lastIndexOf(' ');
      var wordToComplete;
      if (i === -1) { wordToComplete = line; }
      else          { wordToComplete = line.substr(i + 1); }

      var matches = (possibleFields[currentCompletion] || []).filter(function (field) {
        return field.startsWith(wordToComplete);
      });

      return [matches, wordToComplete];
    }
  });

  rl.setPrompt('> ', 2);

  rl.write('\nThis tool will help you to initialize a platform.\n');
  rl.write('It will create the basic structure for you.\n');
  rl.write('Type "exit" anytime to cancel and leave.\n\n');

  rl.on('line', function(line) {
    if (line == 'exit') {
      rl.write('Cancelled\n');
      process.exit(0);
    }
  });

  var stack = new Stackware();
  var pkbDomains;
  var rootDir;

  // Setup autocompletion
  stack.use(function (manifest, next) {
    fs.readFile(path.join(platformsDir, 'fields.json'), function (err, content) {
      if (err) { return next(); }

      try {
        possibleFields = JSON.parse(content);
        for (let p in possibleFields) {
          possibleFields[p] = possibleFields[p].map(field => field.code);
        }
      } finally {
        return next();
      }
    });
  });

  stack.use(function (manifest, next) {
    rl.write('What\'s the short name of the platform ?\n');

    (function prompt() {
      rl.prompt();
      rl.once('line', function (shortName) {
        rootDir = path.join(__dirname, '../../platforms/', shortName);

        fs.exists(rootDir, function (exist) {
          if (exist) {
            rl.write('this platform already exists\n');
            return prompt();
          }
          manifest.name = shortName;
          next();
        });
      });
    })();
  });

  stack.use(function (manifest, next) {
    rl.write('What\'s the long name of the platform ?\n');
    rl.prompt();
    rl.once('line', function (longName) {
      manifest.longname = longName;
      next();
    });
  });

  stack.use(function (manifest, next) {
    rl.write('How would you describe this parser ?\n');
    rl.prompt();
    rl.once('line', function (description) {
      manifest.describe = description;
      next();
    });
    rl.write('Identifie les consultations de la plateforme ' + manifest.longname);
  });

  stack.use(function (manifest, next) {
    rl.write('What\'s the URL of the analyzis ?\n');
    rl.prompt();
    rl.once('line', function (url) {
      manifest.docurl = url;
      next();
    });
    rl.write('http://analogist.couperin.org/platforms/' + manifest.name + '/');
  });

  stack.use(function (manifest, next) {
    rl.write('Who\'s the contact for this parser ?\n');
    rl.prompt();
    rl.once('line', function (contact) {
      manifest.contact = contact;
      next();
    });
  });

  stack.use(function (manifest, next) {
    rl.write('Does it have a knowledge base ? (y/N)\n');

    rl.prompt();
    rl.once('line', function (havePKB) {
      manifest.pkb = (havePKB.trim().toLowerCase() === 'y');
      next();
    });
  });

  stack.use(function (manifest, next) {
    if (!manifest.pkb) { return next(); }

    rl.write('If domains are taken from the knowledge base, which column contains them ?\n');
    rl.write('(empty answer to skip)\n');
    rl.prompt();
    rl.once('line', function (field) {
      field = field.trim();
      if (field) {
        manifest['pkb-domains'] = field;
        pkbDomains = true;
      }
      next();
    });
  });

  stack.use(function (manifest, next) {
    rl.write('What domains should be handled ?');
    if (pkbDomains) { rl.write(' (in addition to those found in the knowledge base)'); }
    rl.write('\n(empty answer to stop)\n');

    (function prompt() {
      rl.prompt();
      rl.once('line', function (domain) {
        domain = domain.trim();
        if (!domain) { return next(); }

        manifest.domains.push(domain);
        prompt();
      });
    })();
  });

  stack.use(function (manifest, next) {
    currentCompletion = 'rid';
    rl.write('What identifiers should be recognized (ex: title_id, doi) ?');
    rl.write('\n(tab for autocompletion, empty answer to stop)\n');

    (function prompt() {
      rl.prompt();
      rl.once('line', function (rid) {
        rid = rid.trim();
        if (!rid) {
          currentCompletion = '';
          return next();
        }

        manifest.recognize.rid.push(rid);
        prompt();
      });
    })();
  });

  stack.use(function (manifest, next) {
    currentCompletion = 'mime';
    rl.write('What mime types should be recognized (ex: HTML, PDF) ?');
    rl.write('\n(tab for autocompletion, empty answer to stop)\n');

    (function prompt() {
      rl.prompt();
      rl.once('line', function (mime) {
        mime = mime.trim();
        if (!mime) {
          currentCompletion = '';
          return next();
        }

        manifest.recognize.mime.push(mime);
        prompt();
      });
    })();
  });

  stack.use(function (manifest, next) {
    currentCompletion = 'rtype';
    rl.write('What kind of consultations should be recognized (ex: ARTICLE, BOOK) ?');
    rl.write('\n(tab for autocompletion, empty answer to stop)\n');

    (function prompt() {
      rl.prompt();
      rl.once('line', function (rtype) {
        rtype = rtype.trim();
        if (!rtype) {
          currentCompletion = '';
          return next();
        }

        manifest.recognize.rtype.push(rtype);
        prompt();
      });
    })();
  });

  // Create directories
  stack.use(function (manifest, next) {
    var directories = [
      path.join(rootDir, 'scrapers'),
      path.join(rootDir, 'pkb'),
      path.join(rootDir, 'test'),
      rootDir
    ];

    (function createDir() {
      var dir = directories.pop();
      if (!dir) { return next(); }

      fs.mkdir(dir, function (err) {
        if (err) { return next(new Error('could not create ' + dir)); }
        createDir();
      });
    })();
  });

  // Create the manifest
  stack.use(function (manifest, next) {
    var manifestPath = path.join(rootDir, 'manifest.json');

    fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), function (err) {
      if (err) { return next(new Error('could not create ' + manifestPath)); }
      next();
    });
  });

  // Create the parser skeleton
  stack.use(function (manifest, next) {
    var parserPath = path.join(rootDir, 'parser.js');


    fs.readFile(skeletonPath, function (err, skeleton) {
      if (err) {
        return next(new Error('could not read ' + skeletonPath));
      }
      skeleton = skeleton.toString().replace('[description-goes-here]', manifest.describe);

      fs.writeFile(parserPath, skeleton, { mode: parseInt('775', 8) }, function (err) {
        if (err) { return next(new Error('could not create ' + parserPath)); }
        next();
      });
    });
  });

  // Create an empty test file
  stack.use(function (manifest, next) {
    var filename     = manifest.name + '.' + manifest.version + '.csv';
    var testFilePath = path.join(rootDir, 'test', filename);
    var firstLine    = '';

    manifest.recognize.rid.forEach(function (rid) {
      firstLine += 'out-' + rid + ';';
    });
    if (manifest.recognize.rtype.length) { firstLine += 'out-rtype;'; }
    if (manifest.recognize.mime.length)  { firstLine += 'out-mime;'; }
    firstLine += 'in-url';

    fs.writeFile(testFilePath, firstLine, function (err) {
      if (err) { return next(new Error('could not create ' + testFilePath)); }
      next();
    });
  });

  stack.use(function (err, manifest, next) {
    throw err;
  });

  stack.use(function (manifest, next) {
    rl.write('Skeleton created in ' + rootDir + '\n');
    process.exit(0);
  });

  stack.process({
    version: moment().format('YYYY-MM-DD'),
    status: 'beta',
    domains: [],
    recognize: {
      rid: [],
      rtype: [],
      mime: []
    }
  });
};
