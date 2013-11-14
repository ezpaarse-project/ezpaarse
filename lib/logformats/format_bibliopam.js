/*jshint maxlen: 200*/
'use strict';

module.exports =
{
  regexp: '^([0-9]+),([a-zA-Z0-9\\., ]+),([0-9]+|\\-),"?([a-zA-Z0-9\\- ]+)"?,([^ ]+),([0-9]+),"?([a-zA-Z0-9\\-\\/;= ]+)"?,"?([a-zA-Z0-9\/ éèàç]*)"?,([a-zA-Z0-9]*),([a-zA-Z0-9]*)$',
  dateFormat: 'DD/MMM/YYYY:HH:mm:ss Z',
  properties: ['timestamp', 'host', 'size', 'ress-name', 'url', 'status', 'mt', 'profil', 'uid', 'session-id']
};