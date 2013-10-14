/**
 * PKB row object
 * used to manage how PKB rows must be
 * deduplicate, sorted and written to CSV format 
 */

'use strict';

var EventEmitter = require('events').EventEmitter;

// Constructeur
var PkbRows = function() {
  var self = this;

  self.rows   = [];
  self.pids   = {};
  self.sorted = true;

};

// Hérite d'un eventemitter
PkbRows.prototype = Object.create(EventEmitter.prototype);

PkbRows.prototype.addRow = function (row) {
  var self = this;
  
  // skip if no pid
  if (row.pid == '') {
    console.error('Skipping row because pid is empty: ' + JSON.stringify(row));
    return;
  }

  // skip if no issn and no eissn
  if (row.issn == '' && row.eissn == '') {
    console.error('Skipping row because issn and eissn are empty: ' + JSON.stringify(row));
    return;
  }

  // deuplicate the rows by the "pid" field  
  if (!self.pids[row.pid]) {
    self.pids[row.pid] = true;
    self.rows.push(row);
    self.sorted = false;
    console.error('Keeping row:  issn = "' + row.issn +
                  '"\t eissn = "' + row.eissn +
                  '"\t pid = "' + row.pid + '"');
    //console.error(JSON.stringify(row));
  } else {
    console.error('Skipping because this "pid" has a duplicate: ' + JSON.stringify(row));
    return;
  }

};

PkbRows.prototype.sortRows = function () {
  var self = this;
  
  if (self.sorted) return;

  // sort the csv by pid
  var sort_by = function (field, reverse, primer) {
    var key = function (x) {return primer ? primer(x[field]) : x[field]};
    return function (a,b) {
      var A = key(a), B = key(b);
      return ((A < B) ? -1 : (A > B) ? +1 : 0) * [-1,1][+!!reverse];                  
    }
  };
  self.rows.sort(sort_by('pid', true, function (a) { return a.toUpperCase(); }));
  
  self.sorted = true;  
};

PkbRows.prototype.writeCSV = function (dstStream) {
  var self = this;

  // start rows sorting
  self.sortRows();

  var firstLine = true;
  var fields    = [];
  function writeRowAsCSVToStream(row) {
    if (firstLine) {
      firstLine = false;
      fields = Object.keys(row);
      fields.forEach(function (field, idx) {
        dstStream.write(field + (idx < fields.length - 1 ? ';' : ''));
      });
      dstStream.write('\n');
    }
    fields.forEach(function (field, idx) {
      if (/;/.test(row[field])) {
        dstStream.write('"' + row[field].replace('"', '""') + '"');
      } else {
        dstStream.write(row[field]);
      }
      dstStream.write(idx < fields.length - 1 ? ';' : '');
    });
    dstStream.write('\n');
  }

  // write rows to the stream 
  self.rows.forEach(function (row) {
    writeRowAsCSVToStream(row);
  });
};

module.exports = PkbRows;