/*jslint node: true, maxlen: 200, maxerr: 50, indent: 2 */
'use strict';

module.exports =
[
  {
    // Type: aze-21.site.fr - HR2AZ-50 [10/Sep/2012:12:18:26 +0100] "GET http://www.nature.com:80/nchem/scripts/site.js HTTP/1.1" 200 639
    exp: /^([^ ]+) - ([a-zA-Z0-9@\.\-_]+) \[([^\]]+)\] \"[A-Z]+ ([^ ]+) [^ ]+\" ([0-9]+) ([0-9]+)/,
    properties: ['host', 'login', 'date', 'url', 'httpCode', 'size'],
    dateFormat: 'DD/MMM/YYYY:HH:mm:ss Z'
  },
  {
    // Type: aze-21.site.fr - - [10/Sep/2012:14:03:46 +0100] "GET http://www.nature.com/nchem/index.html HTTP/1.1" 302 0
    exp: /^([^ ]+) - - \[([^\]]+)\] \"[A-Z]+ ([^ ]+) [^ ]+\" ([0-9]+) ([0-9]+)/,
    properties: ['host', 'date', 'url', 'httpCode', 'size'],
    dateFormat: 'DD/MMM/YYYY:HH:mm:ss Z'
  },
  {
    // Type: 159.56.14.57, 159.56.24.38 - HR2AZ-50 [10/Sep/2012:14:22:56 +0100] "GET http://www.nature.com:80/nchembio/archive/index.html HTTP/1.1" 200 54778
    // Autre: Unknown, 159.56.24.38 ...
    exp: /^([a-zA-Z0-9\., ]+) - ([a-zA-Z0-9@\.\-_]+) \[([^\]]+)\] \"[A-Z]+ ([^ ]+) [^ ]+\" ([0-9]+) ([0-9]+)/,
    properties: ['host', 'login', 'date', 'url', 'httpCode', 'size'],
    dateFormat: 'DD/MMM/YYYY:HH:mm:ss Z'
  },
  {
    // Type: 159.56.12.147, 159.56.14.126 - - [10/Sep/2012:16:55:48 +0100] "GET http://www.nature.com/nchem/index.html HTTP/1.1" 302 0
    // Autre: Unknown, 159.56.14.126 ...
    exp: /^([a-zA-Z0-9\., ]+) - - \[([^\]]+)\] \"[A-Z]+ ([^ ]+) [^ ]+\" ([0-9]+) ([0-9]+)/,
    properties: ['host', 'date', 'url', 'httpCode', 'size'],
    dateFormat: 'DD/MMM/YYYY:HH:mm:ss Z'
  },
  {
    // Type: [16/Dec/2012:14:42:40 +0100] proxy http://www.sciencedirect.com/science?_ob=GatewayURL&_origin=CELLPRESS&_urlversion=4&_method=citationSearch&_version=1&_src=FPDF&_piikey=S1535610811003631&md5=c9d808a4f1d98faabe1bb4ac389cb224
    exp: /^^\[([^\]]+)\] ([a-zA-Z0-9]+) ([^ ]+)/,
    properties: ['date', 'host', 'url'],
    dateFormat: 'DD/MMM/YYYY:HH:mm:ss Z'
  }
];