/*eslint max-len: 0*/
'use strict';

/*
* Takes a custom log format and translates it into
* a regex using EZproxy syntax.
* logFormat example: %h %l %u [%t] "%r" %s %b
*/

function regexpEscape(str) {
  if (!str) { return ''; }
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}

module.exports = function (logFormat, laxist) {
  var usedProperties = [];
  var parameters = {
    '%h': {property: 'host',     regexp: '([a-zA-Z0-9.\\-:]+(?:, ?[a-zA-Z0-9.\\-:]+)*)'},
    '%u': {property: 'login',    regexp: '([a-zA-Z0-9@.\\-_%,=]+)'},
    '%l': {property: 'identd',   regexp: '([a-zA-Z0-9\\-]+)'},
    '%b': {property: 'size',     regexp: '([0-9]+)'},
    '%U': {property: 'url',      regexp: '([^ ]+)'},
    '%m': {property: 'method',   regexp: '([A-Z]+)'},
    '%r': {property: 'url',      regexp: '[A-Z]+ ([^ ]+) [^ ]+'                        },
    '%t': {property: 'datetime', regexp: '\\[([^\\]]+)\\]'},
    '%s': {property: 'status',   regexp: '([0-9]+)'}
  };


  // Initialize the format with a 'raw' regex (parameters yet to be translated)
  var format = {
    regexp: '^' + regexpEscape(logFormat) + (laxist ? '' : '$'),
    properties: []
  };

  // This regexp is used to catch any expression matching one of those patterns :
  //   %x
  //   %{property}<regexp>
  //   %<regexp>
  var paramRegex = new RegExp('(%[a-zA-Z]|%{[a-zA-Z0-9\\-_]+}i?<[^<>]+>|%<[^<>]+>|%{[a-zA-Z0-9\\-_]+}i?)', 'g');
  var match;

  while ((match = paramRegex.exec(logFormat)) !== null) {
    var paramToTranslate  = match[1];
    var customRegexp      = false;
    var customProperty    = false;
    var customMatch;

    // When a property or a regexp is provided, we must grab the expression inside {...} or <...>
    if ((customMatch = new RegExp('^%{([a-zA-Z0-9\\-_]+)}i?$').exec(paramToTranslate)) !== null) {
      customProperty = customMatch[1];
    } else if ((customMatch = new RegExp('^%{([a-zA-Z0-9\\-_]+)}i?<([^<>]+)>$').exec(paramToTranslate)) !== null) {
      customProperty = customMatch[1];
      customRegexp = customMatch[2];
    } else if ((customMatch = new RegExp('^%<([^<>]+)>$').exec(paramToTranslate)) !== null) {
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
    } else if (customRegexp) {
      // If a regex has no matching label, it'll be taken into account
      // but won't be caught when parsing log lines
      if (/\((?!\?:)/.test(customRegexp)) {
        return null;
      }
      format.regexp = format.regexp.replace(regexpEscape(paramToTranslate), customRegexp);
      continue;
    }

    var param = parameters[customProperty || paramToTranslate];
    if (param) {
      format.properties.push(param.property);
      format.regexp = format.regexp.replace(regexpEscape(paramToTranslate), param.regexp);
    }
  }

  try {
    format.regexp = new RegExp(format.regexp);
  } catch (e) {
    return null;
  }

  return format;
};