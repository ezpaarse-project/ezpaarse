'use strict';

var InitError = function (status, ezStatus) {
  this.status = status;
  this.ezStatus = ezStatus;
};

module.exports = InitError;