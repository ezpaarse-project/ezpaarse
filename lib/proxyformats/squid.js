/*jshint maxlen: 180*/
'use strict';

/*
* Takes a custom log format and translates it into
* a regex using Squid syntax.
* logFormat example: %ts.%03tu %6tr %>a %Ss/%03>Hs %<st %rm %ru %[un %Sh/%<a %mt
*/

function regexpEscape(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

module.exports = function (logFormat) {
  var parameters = {
    '%ts':  {property: 'timestamp',            regexp: '([0-9]+)'},
    '%tu':  {property: 'subsecond',            regexp: '([0-9]+)'},
    '%tr':  {property: 'responseTime',         regexp: '([0-9]+)'},
    '%tl':  {property: 'datetime',             regexp: '([^\\]]+)'},
    '%>a':  {property: 'host',                 regexp: '([a-zA-Z0-9\\.\\-]+(?:, ?[a-zA-Z0-9\\.\\-]+)*)'},
    '%<a':  {property: 'lastConnection',       regexp: '([a-zA-Z0-9\\., ]+|\\-)'},
    '%<A':  {property: 'domain',               regexp: '([a-zA-Z0-9\\.\\-]+)'},
    '%Ss':  {property: 'squidRequestStatus',   regexp: '([a-zA-Z_]+)'},
    '%lp':  {property: 'port',                 regexp: '([0-9]+)'},
    '%>Hs': {property: 'status',               regexp: '([0-9]+)'},
    '%<st': {property: 'size',                 regexp: '([0-9]+)'},
    '%rm':  {property: 'method',               regexp: '([A-Z]+)'},
    '%rv':  {property: 'protocolVersion',      regexp: '([0-9]\\.[0-9])'},
    '%ru':  {property: 'url',                  regexp: '([^ ]+)'},
    '%[un': {property: 'login',                regexp: '([a-zA-Z0-9@\\.\\-_%=,]+)'},
    '%Sh':  {property: 'squidHierarchyStatus', regexp: '([a-zA-Z]+)'},
    '%mt':  {property: 'mime',                 regexp: '([a-zA-Z]+\\/[a-zA-Z]+)'},
    '%ui':  {property: 'identd',               regexp: '([a-zA-Z0-9\\-]+|\\-)'}
  };


  // Initialize the format with a 'raw' regex (parameters yet to be translated)
  var format = {
    regexp: '^' + regexpEscape(logFormat) + '$',
    properties: []
  };

  // This regexp is used to catch any expression matching one of those patterns :
  //   %x
  //   %>x
  //   %[x
  //   %01x
  //   %01>x
  //   %01.02x
  //   %01.02>x
  //   %{property}<regexp>
  //   %<regexp>
  var paramRegex = new RegExp('(%[a-zA-Z]{1,2}|%(?:[0-9]+)?(?:[0-9]+)?[<>\\[]?[a-zA-Z]{1,2}|%{[a-zA-Z0-9\\-_]+}<[^<>]+>|%<[^<>]+>|%{[a-zA-Z0-9\\-_]+})', 'g');
  var match;

  while ((match = paramRegex.exec(logFormat)) !== null) {
    var paramToTranslate  = match[1];
    var customRegexp      = false;
    var customProperty    = false;
    var customMatch;

    // When a property or a regexp is provided, we must grab the expression inside {...} or <...>
    if ((customMatch = new RegExp('^%{([a-zA-Z0-9\\-_]+)}$').exec(paramToTranslate)) !== null) {
      customProperty = customMatch[1];
    } else if ((customMatch = new RegExp('^%{([a-zA-Z0-9\\-_]+)}<([^<>]+)>$').exec(paramToTranslate)) !== null) {
      customProperty = customMatch[1];
      customRegexp = customMatch[2];
    } else if ((customMatch = new RegExp('^%<([^<>]+)>$').exec(paramToTranslate)) !== null) {
      customRegexp = customMatch[1];
    }

    if (customProperty) {
      // Duplicate properties are not accepted
      for (var p in parameters) {
        if (parameters[p].property === customProperty) {
          return false;
        }
      }
      customRegexp = customRegexp || '[a-zA-Z0-9]+';
      if (/\((?!\?:)/.test(customRegexp)) {
        return false;
      }
      customRegexp = '(' + customRegexp + ')';

      parameters[customProperty] = {
        regexp: customRegexp,
        property: customProperty
      };
    } else if (customRegexp) {
      // If a regex has no matching label, it'll be taken into account
      // but won't be caught when parsing log lines
      if (/\((?!\?:)/.test(customRegexp)) {
        return false;
      }
      format.regexp = format.regexp.replace(regexpEscape(paramToTranslate), customRegexp);
      continue;
    }
    // When having min/max chain length (like %01x or %01.02x) we ignore numbers
    var param = parameters[customProperty || paramToTranslate.replace(/[0-9]+(\.[0-9]+)?/, '')];
    if (param) {
      format.properties.push(param.property);
      format.regexp = format.regexp.replace(regexpEscape(paramToTranslate), '[ ]*' + param.regexp);
    }
  }

  return format;
};