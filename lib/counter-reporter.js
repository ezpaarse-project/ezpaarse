/* eslint global-require: 0 */
'use strict';

/**
 * Create a counter reporter list
 */
function CounterReporter() {
  this.reporters = {};
}
module.exports = CounterReporter;

/**
 * Add a counter reporter
 * @param {String} type jr1, br2...
 * @return {Boolean} false if the reporter couldn't be added
 */
CounterReporter.prototype.add = function (type) {
  type = (type || '').toLowerCase();
  if (this.reporters[type]) { return false; }

  try {
    var Reporter = require('./counter-reporters/' + type + '.js');
    this.reporters[type] = new Reporter(this.customer, this.vendor);
  } catch (e) {
    return false;
  }
  return true;
};

/**
 * Count an EC for each reporter
 * @param  {Object} ec consultation event
 */
CounterReporter.prototype.count = function (ec) {
  for (var type in this.reporters) {
    this.reporters[type].count(ec);
  }
};

/**
 * Set an attribute
 * @param  {String} key    attribute name
 * @param  {Any}    value  attribute value
 */
CounterReporter.prototype.set = function (key, value) {
  this[key] = value;
};

/**
 * Get reports of all counter reporters
 * @return {Object} type -> report
 */
CounterReporter.prototype.getReports = function (format) {
  var reports = {};
  for (var type in this.reporters) {
    reports[type] = this.reporters[type].generateReport(format);
  }
  return reports;
};
