/*jslint node: true, maxlen: 200, maxerr: 50, indent: 2 */
'use strict';

module.exports =
{
  regexp: '^\\[([^\\]]+)\\] ([a-zA-Z0-9\\., ]+) ([^ ]+)$',
  dateFormat: 'DD/MMM/YYYY:HH:mm:ss Z',
  properties: ['datetime', 'host', 'url']
};