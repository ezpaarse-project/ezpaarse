'use strict';

/**
 * Sets the array containing the fields to use when writing ECs
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 * @param  {Function} next  continue to next middleware
 */
module.exports = function (req, res, job, next) {
  job.logger.verbose('Initializing output fields');
  job.outputFields  = job.outputFields || { added: [], removed: [] };

  var fieldsHeader  = req.header('Output-Fields');

  if (fieldsHeader) {
    job.logger.verbose('Fields header: ' + fieldsHeader);
    var fields = fieldsHeader.split(',');
    for (var i = 0, l = fields.length; i < l; i++) {
      var field    = fields[i].trim();
      var operator = field.charAt(0);
      field        = field.substring(1).trim();
      if (!field) {
        next([400, 4012]);
        return;
      }

      switch (operator) {
      case '+':
        if (job.outputFields.added.indexOf(field) == -1) {
          job.outputFields.added.push(field);
        }
        break;
      case '-':
        job.outputFields.removed.push(field);
        break;
      default:
        next([400, 4013]);
        return;
      }
    }
  } else {
    job.logger.verbose('Using default fields');
  }

  next(null);
};