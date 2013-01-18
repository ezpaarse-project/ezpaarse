/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

module.exports = function(outputStream) {
  this.output = outputStream;
  this.fields = ['host','login','date','url','httpCode','size','domain','type','issn'];

  this.start = function() {
    if (this.fields[0]) {
      this.output.write(this.fields[0]);
    }

    for (var i = 1, l = this.fields.length; i<l; i++) {
      this.output.write(';' + this.fields[i]);
    }
    this.output.write('\n');
  }

  this.end = function() {}

  this.write = function(ec) {
    var str = '';
    for (var i in this.fields) {
      if (ec[this.fields[i]]) {
        str += ec[this.fields[i]];
      }
      str += ',';
    }
    this.output.write(str.replace(/,$/, '\n'));
  };
};