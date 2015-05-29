'use strict';

/**
 * Create an EC field splitter
 * Used to split one or more given fields and put extracted values into new ones
 * @param {Object} ufSplitters  contains everything needed to split fields
 *                              (src, dest, sep, residual)
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
module.exports = function fieldSplitter(job) {
  var ufSplitters = job.ufSplitters;

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
