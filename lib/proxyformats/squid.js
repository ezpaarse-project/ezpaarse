/*jshint maxlen: 180*/
'use strict';

/*
* Takes a custom log format and translates it into
* a regex using Squid syntax.
* logFormat example: %ts.%03tu %6tr %>a %Ss/%03>Hs %<st %rm %ru %[un %Sh/%<a %mt
*/

function regexpEscape(str) {
  if (!str) { return ''; }
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

module.exports = function (logFormat, laxist) {
  var usedProperties = [];
  var parameters = {
    'ts':  {property: 'timestamp',            regexp: '([0-9]+)'},
    'tu':  {property: 'subsecond',            regexp: '([0-9]+)'},
    'tr':  {property: 'responseTime',         regexp: '([0-9]+)'},
    'tl':  {property: 'datetime',             regexp: '([^\\]]+)'},
    '>a':  {property: 'host',                 regexp: '([a-zA-Z0-9\\.\\-]+(?:, ?[a-zA-Z0-9\\.\\-]+)*)'},
    '<a':  {property: 'lastConnection',       regexp: '([a-zA-Z0-9\\.\\-, ]+)'},
    '<A':  {property: 'domain',               regexp: '([a-zA-Z0-9\\.\\-]+)'},
    'Ss':  {property: 'squidRequestStatus',   regexp: '([a-zA-Z_]+)'},
    'lp':  {property: 'port',                 regexp: '([0-9]+)'},
    '>Hs': {property: 'status',               regexp: '([0-9]+)'},
    '<st': {property: 'size',                 regexp: '([0-9]+)'},
    'rm':  {property: 'method',               regexp: '([A-Z]+)'},
    'rv':  {property: 'protocolVersion',      regexp: '([0-9]\\.[0-9])'},
    'ru':  {property: 'url',                  regexp: '([^ ]+)'},
    'un':  {property: 'login',                regexp: '([a-zA-Z0-9@\\.\\-_%=,]+)'},
    'Sh':  {property: 'squidHierarchyStatus', regexp: '([a-zA-Z_]+)'},
    'mt':  {property: 'mime',                 regexp: '([a-zA-Z]+\\/[a-zA-Z0-9\\-]+|\\-)'},
    'ui':  {property: 'identd',               regexp: '([a-zA-Z0-9\\-]+)'}
  };


  // Initialize the format with a 'raw' regex (parameters yet to be translated)
  var format = {
    regexp: '^' + regexpEscape(logFormat) + (laxist ? '' : '$'),
    properties: []
  };

  // Log member format :
  // % ["|[|'|#] [-] [[0]width] [{argument}] formatcode
  // This regexp catches all possible members
  var memberReg = '%(?:"|\\[|\'|#)?(?:-)?(?:[0-9]+(?:\\.[0-9]+)?)?(?:{[a-zA-Z0-9\\-]+})?([<>]?[a-zA-Z]{1,2})';

  var matches = [
    memberReg,
    '%{[a-zA-Z0-9\\-_]+}(?:<[^<>]+>)?', //%{property}[<regexp>]
    '%<[^<>]+>' //%<regexp>
  ];

  var paramRegex = new RegExp('(' + matches.join('|') + ')', 'g');
  var match;

  while ((match = paramRegex.exec(logFormat)) !== null) {
    var paramToTranslate = match[1]; //%02>ui
    var customRegexp     = false;
    var customProperty   = false;
    var customMatch;

    // When a property or a regexp is provided, we must grab the expression inside {...} or <...>
    if ((customMatch = /^%{([a-zA-Z0-9\-_]+)}(?:<([^<>]+)>)?$/.exec(paramToTranslate)) !== null) {
      // %{...}[<...>]
      customProperty = customMatch[1];
      customRegexp = customMatch[2];
    } else if ((customMatch = /^%<([^<>]+)>$/.exec(paramToTranslate)) !== null) {
      // %<...>
      customRegexp = customMatch[1];
    }

    if (customProperty) {
      // Properties can't be used twice
      if (usedProperties.indexOf(customProperty) != -1) { return null; }

      customRegexp = customRegexp || '[a-zA-Z0-9\\-]+';
      if (/\((?!\?:)/.test(customRegexp)) {
        return null;
      }
      customRegexp = '(' + customRegexp + ')';

      parameters[customProperty] = {
        regexp: customRegexp,
        property: customProperty
      };
      usedProperties.push(customProperty);
    } else if (customRegexp) {
      // If a regex has no matching label, it'll be taken into account
      // but won't be caught when parsing log lines
      if (/\((?!\?:)/.test(customRegexp)) {
        return null;
      }
      format.regexp = format.regexp.replace(regexpEscape(paramToTranslate), customRegexp);
      continue;
    }
    // When having min/max chain length (like %01x or %01.02x) we ignore numbers
    var param;
    if (customProperty) {
      param = parameters[customProperty];
    } else {
      var matchMember = new RegExp(memberReg).exec(paramToTranslate);
      param = matchMember ? parameters[matchMember[1]] : null;
    }
    if (param) {
      format.properties.push(param.property);
      format.regexp = format.regexp.replace(regexpEscape(paramToTranslate), '[ ]*' + param.regexp);
    }
  }

  try {
    format.regexp = new RegExp(format.regexp);
  } catch (e) {
    return null;
  }

  return format;
};
