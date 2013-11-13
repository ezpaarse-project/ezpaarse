/*jshint maxlen: 200*/
'use strict';

module.exports =
{
  regexp: '^\\[([^\\]]+)\\] ([a-zA-Z0-9\\.\\-]+(?:, ?[a-zA-Z0-9\\.\\-]+)*) ([^ ]+)$',
  dateFormat: 'DD/MMM/YYYY:HH:mm:ss Z',
  properties: ['datetime', 'host', 'url']
};