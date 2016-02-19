'use strict';

/**
 * Create an EC field splitter
 * Used to split one or more given fields and put extracted values into new ones
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 *
 * Example of splitter :
 * {
 *   src: 'user',
 *   sep: '+',
 *   dest: [
 *     { regexp: '[a-z]+', fieldName: 'name' },
 *     { regexp: '[0-9]+', fieldName: 'age' }
 *   ],
 *   residual: 'other'
 * }
 */
module.exports = function fieldSplitter(req, res, job) {
  job.logger.verbose('Initializing field splitters');

  job.outputFields = job.outputFields || { added: [], removed: [] };

  var ufSplitters  = job.ufSplitters = {};
  var headers      = req.headers;
  var userFields   = []; // Those fields will be added to the output
  var sourceFields = [];
  var num;
  var match;

  function initError(status, ezCode) {
    var err    = new Error();
    err.status = status;
    err.code   = ezCode;
    return err;
  }

  for (var header in headers) {
    match = /^user-field([0-9]+)-dest-([a-zA-Z0-9]+)$/i.exec(header);
    if (match && match[1] && match[2]) {

      var destName = match[2];
      num = match[1];

      // Residual fieldname must not exist
      if (sourceFields.indexOf(destName) !== -1 || userFields.indexOf(destName) !== -1) {
        return initError(400, 4011);
      }

      userFields.push(destName);

      if (!ufSplitters[num])      { ufSplitters[num] = {}; }
      if (!ufSplitters[num].dest) { ufSplitters[num].dest = []; }
      ufSplitters[num].dest.push({ regexp: headers[header], fieldName: destName });

    } else {

      var value = headers[header];
      match = /^user-field([0-9]+)-(src|sep|residual)$/i.exec(header);

      if (match && match[1] && match[2]) {
        switch (match[2]) {
        case 'sep':
          // Space character can not be used alone in a header, so use word "space" instead
          if (value == 'space') { value = ' '; }
          break;
        case 'src':
          // Src fieldname must not equal an extra field (dest or residual)
          // but multiple src can share a same fieldname
          if (userFields.indexOf(value) !== -1) {
            return initError(400, 4011);
          }
          sourceFields.push(value);
          break;
        case 'residual':
          // Residual fieldname must have no doublon
          if (sourceFields.indexOf(value) !== -1 || userFields.indexOf(value) !== -1) {
            return initError(400, 4011);
          }
          userFields.push(value);
          break;
        }

        num = match[1];
        if (!ufSplitters[num]) { ufSplitters[num] = {}; }
        ufSplitters[num][match[2]] = value;
      }
    }
  }

  // All splitters must have SRC, SEP and at least one DEST
  for (var i in ufSplitters) {
    var splitter = ufSplitters[i];
    if (!splitter.src) {
      return initError(400, 4008);
    } else if (!splitter.sep) {
      return initError(400, 4009);
    } else if (!splitter.dest || splitter.dest.length === 0) {
      return initError(400, 4010);
    }
  }

  userFields.forEach(function (field) {
    if (job.outputFields.added.indexOf(field) == -1) {
      job.outputFields.added.push(field);
    }
  });

  return function split(ec, next) {
    if (!ec) { return next(); }

    for (var i in ufSplitters) {
      var splitter = ufSplitters[i];
      var found, dest, reg, element;

      if (ec[splitter.src] && splitter.sep && splitter.dest) {
        var elements = ec[splitter.src].split(splitter.sep);

        for (var j in elements) {
          element = elements[j];
          found   = false;

          for (var k in splitter.dest) {
            dest = splitter.dest[k];
            reg  = new RegExp('^' + dest.regexp + '$');

            if (reg.test(element)) {
              found = true;

              if (ec[dest.fieldName]) {
                ec[dest.fieldName] += splitter.sep;
                ec[dest.fieldName] += element;
              } else {
                ec[dest.fieldName] = element;
              }
              break;
            }
          }

          if (!found && splitter.residual) {
            if (ec[splitter.residual]) {
              ec[splitter.residual] += splitter.sep;
              ec[splitter.residual] += element;
            } else {
              ec[splitter.residual] = element;
            }
          }
        }
      }
    }

    next();
  };
};
