/*jslint node: true, maxlen: 200, maxerr: 50, indent: 2 */
'use strict';

module.exports =
{
  dateFormat: 'DD/MMM/YYYY:HH:mm:ss Z',
  replacer: '-',
  properties:
  {
    'date': /^\[([^\]]+)\]$/,
    'host': /^([a-zA-Z0-9\., ]+)$/,
    'url': /^([^ ]+)$/
  }
};