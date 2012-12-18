#!/usr/bin/env node

exports.parserExecute = function () {
  console.log('parser called');
};

// thanks to: http://stackoverflow.com/questions/8864365/can-i-know-in-node-js-if-my-script-is-being-run-directly-or-being-loaded-by-an
if (!module.parent) {
  exports.parserExecute();
}