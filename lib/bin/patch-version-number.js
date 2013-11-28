'use strict';

/**
 * Patch files with the indicated ezpaarse version
 */

exports.patchVersionNumber = function () {
  var fs = require('fs');

  var optimist = require('optimist')
      .usage('Patch files with the indicated ezpaarse version.\nUsage: $0 --version=[n].[n].[n]')
      .demand('version').alias('version', 'v')
      .describe('version', 'wanted version for ezPAARSE source code');
  var argv = optimist.argv;
  var version = argv.version;

  // show usage if --help option is used
  if (argv.help) {
    optimist.showHelp();
    process.exit(0);
  }

  var version_pattern = '([0-9]+\\.[0-9]+\\.[0-9]+|[0-9]+\\.[0-9]+\\.[0-9]+[0-9abcdef+]+)';
  if (new RegExp('^' + version_pattern + '$').test(version)) {

    var c = '';
    var f = '';

    // package.json: "version": "0.0.3",
    f = __dirname + '/../../package.json';
    c = fs.readFileSync(f, 'utf8');
    c = c.replace(new RegExp('"' + version_pattern + '"'), '"' + version + '"');
    fs.writeFileSync(f, c, 'utf8');
    process.stdout.write(f + ' patched\n');

    // misc/deb/DEBIAN/control: Version: 0.0.3
    f = __dirname + '/../../misc/deb/DEBIAN/control';
    c = fs.readFileSync(f, 'utf8');
    c = c.replace(new RegExp('Version: ' + version_pattern), 'Version: ' + version);
    fs.writeFileSync(f, c, 'utf8');
    process.stdout.write(f + ' patched\n');

    // doc/templates/layout.html: ezPAARSE - Version: 0.0.3
    f = __dirname + '/../../doc/theme/_layout.html';
    c = fs.readFileSync(f, 'utf8');
    c = c.replace(new RegExp('ezPAARSE - Version: ' + version_pattern),
                  'ezPAARSE - Version: ' + version);
    fs.writeFileSync(f, c, 'utf8');
    process.stdout.write(f + ' patched\n');

    // views/footer.ejs: ezPAARSE - Version: 0.0.5
    f = __dirname + '/../../views/footer.ejs';
    c = fs.readFileSync(f, 'utf8');
    c = c.replace(new RegExp('ezPAARSE - Version: ' + version_pattern),
                  'ezPAARSE - Version: ' + version);
    fs.writeFileSync(f, c, 'utf8');
    process.stdout.write(f + ' patched\n');

    // misc/windows/ezPAARSE-MUI.nsi: Version "0.0.4"
    f = __dirname + '/../../misc/windows/ezPAARSE-MUI.nsi';
    c = fs.readFileSync(f, 'utf8');
    c = c.replace(new RegExp('Version "' + version_pattern + '"'), 'Version "' + version + '"');
    fs.writeFileSync(f, c, 'utf8');
    process.stdout.write(f + ' patched\n');

    process.exit(0);
  } else {
    process.stderr.write('Wrong version format (should be n.n.n or a git commit id)\n');
    process.exit(1);
  }
};