/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var InitError = function (status, ezStatus) {
  this.status = status;
  this.ezStatus = ezStatus;
};

module.exports = InitError;