/*jslint node: true, maxlen: 200, maxerr: 50, indent: 2 */
'use strict';

module.exports =
{
  dateFormat: 'DD/MMM/YYYY:HH:mm:ss Z',
  replacer: '-',
  properties:
  {
    'host': /^([^ ]+)$/,
    'remoteUsername': /^-$/,
    'login': /^([a-zA-Z0-9@\.\-_]+)$/,
    'date': /^\[([^\]]+)\]$/,
    'url': /^\"[A-Z]+ ([^ ]+) [^ ]+\"$/,
    'status': /^([0-9]+)$/,
    'size': /^([0-9]+)$/
  }
};