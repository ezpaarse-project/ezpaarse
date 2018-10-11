'use strict';

const fs           = require('fs');
const path         = require('path');
const parse        = require('csv').parse;
const skip         = require('lines-skipper');
const EventEmitter = require('events').EventEmitter;

const kbartReg = /_[0-9]{4}-[0-9]{2}-[0-9]{2}\.txt$/;

/**
 * Browse the PKBs files of a platform and remove old duplicates
 * @param  {String} platform  platform short name
 *
 * @param  {Object} options
 *         [String]  platform   a platform whose PKB should be cleaned
 *         [String]  directory  a specific directory to clean
 *         [Boolean] rewrite    rewrite files without duplicates (defaults to true)
 *
 * @return {EventEmitter} e
 *  Events : error(err)
 *           file(filePath)
 *           duplicate(id, fileName, line)
 *           end()
 */
module.exports = function (options) {
  options = options || {};

  let dir;
  if (options.platform) {
    dir = path.resolve(__dirname, '../platforms', options.platform, 'pkb');
  } else if (options.dir) {
    dir = options.dir;
  }

  const e = new EventEmitter();

  if (!dir) {
    return e.emit('error', new Error('no directory provided'));
  }

  fs.readdir(dir, function (err, files) {
    if (err) { return e.emit('error', err); }

    files = files.filter(function (file) {
      return kbartReg.test(file);
    }).sort(function (a, b) {
      // XXXX-XX-XX.txt
      return (a.substr(a.length - 14) < b.substr(b.length - 14) ? -1 : 1);
    });

    const identifiers   = {};
    const linesToRemove = {};
    const totalLines    = {};

    let j = 0;

    function rewriteFiles() {
      const file = files[j++];
      if (!file) { return e.emit('end'); }

      const lines = linesToRemove[file];
      const total = totalLines[file] - 1; // without header

      if (!lines) { return rewriteFiles(); }

      const filePath = path.join(dir, file);
      const tmpFile  = path.join(__dirname, '../tmp/' + path.basename(file));

      if (lines.length == total) {
        fs.unlink(filePath, function (err) {
          if (err) { return e.emit('error', err); }
          rewriteFiles();
        });
        return;
      }

      if (lines.length === 0) { return rewriteFiles(); }

      fs.createReadStream(filePath)
        .pipe(skip(lines))
        .pipe(fs.createWriteStream(tmpFile))
        .on('error', function (err) { e.emit('error', err); })
        .on('finish', function () {
          fs.rename(tmpFile, filePath, function (err) {
            if (err) { return e.emit('error', err); }
            rewriteFiles();
          });
        });
    }

    let i = 0;

    (function readFiles() {
      const file = files[i++];
      if (!file) {
        if (options.rewrite === false) { return e.emit('end'); }
        return rewriteFiles();
      }

      identifiers[file]   = {};
      linesToRemove[file] = [];

      const filePath = path.join(dir, file);
      let currentLine = 1;

      e.emit('file', filePath);

      const parser = parse({
        'relax_column_count': true,
        'skip_empty_lines': false,
        'delimiter': '\t',
        'columns': true
      });

      fs.createReadStream(filePath).pipe(parser)
        .on('error', function (err) { return e.emit('error', err); })
        .on('end', function () {
          totalLines[file] = currentLine;
          readFiles();
        })
        .on('readable', function () {
          let data;

          while ((data = parser.read()) !== null) {
            currentLine++;

            const id = data.title_id;

            if (!id) {
              e.emit('missing-id', file, currentLine);
              linesToRemove[file].push(currentLine);
              return;
            }

            for (const f in identifiers) {
              if (identifiers[f].hasOwnProperty(id)) {
                e.emit('duplicate', id, f, identifiers[f][id]);
                linesToRemove[f].push(identifiers[f][id]);
                delete identifiers[f][id];
                break;
              }
            }

            identifiers[file][id] = currentLine;
          }
        });
    })();
  });

  return e;
};
