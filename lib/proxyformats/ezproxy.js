/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

/*
*    TODO: ne pas autoriser les parentheses catchantes si une regex est spécifiée
*    '%{fieldname}<regexp>': {regex: '([a-zA-Z0-9]+)',  property: 'joker'}
*    '%<regexp>': {regex: '([a-zA-Z0-9]+)',             property: 'joker'}
*/

function regexpEscape(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

/*
* Takes a custom log format and translates it into
* a regex using EZproxy syntax.
* logFormat example: %h %l %u [%t] "%r" %s %b
*/
module.exports = function (logFormat) {
  var parameters = {
    '%h': {regexp: '([a-zA-Z0-9\\., ]+)',        property: 'host'},
    '%u': {regexp: '([a-zA-Z0-9@\\.\\-_%]+)',    property: 'login'},
    '%l': {regexp: '(-)',                        property: 'identd'},
    '%b': {regexp: '([0-9]+)',                   property: 'size'},
    '%U': {regexp: '([^ ]+)',                    property: 'url'},
    '%m': {regexp: '([A-Z]+)',                   property: 'method'},
    '%r': {regexp: '[A-Z]+ ([^ ]+) [^ ]+',       property: 'url'},
    '%t': {regexp: '([^\\]]+)',                  property: 'date'},
    '%s': {regexp: '([0-9]+)',                   property: 'status'}
  }


  // Initialize the format with a 'raw' regex (parameters yet to be translated)
  var format = {
    regexp: '^' + regexpEscape(logFormat) + '$',
    properties: []
  };

  // This regexp is used to catch any expression matching one of those patterns :
  //   %x
  //   %{property}<regexp>
  //   %<regexp>
  var paramRegex = /(%[a-zA-Z]|%{[a-zA-Z0-9\-_]+}<[^<>]+>|%<[^<>]+>|%{[a-zA-Z0-9\-_]+})/g;
  var match;

  while (match = paramRegex.exec(logFormat)) {
    var paramToTranslate  = match[1];
    var customRegexp      = false;
    var customProperty    = false;
    var customMatch;

    // When a property or a regexp is provided, we must grab the expression inside {...} or <...>
    if (customMatch = /^%{([a-zA-Z0-9\-_]+)}$/.exec(paramToTranslate)) {
      var customProperty = customMatch[1];
    } else if (customMatch = /^%{([a-zA-Z0-9\-_]+)}<([^<>]+)>$/.exec(paramToTranslate)) {
      var customProperty = customMatch[1];
      var customRegexp = customMatch[2];
    } else if (customMatch = /^%<([^<>]+)>$/.exec(paramToTranslate)) {
      var customRegexp = customMatch[1];
    }
    
    if (customProperty) {
      // Duplicate properties are not accepted
      for (var param in parameters) {
        if (parameters[param].property === customProperty) {
          return false;
        }
      }
      customRegexp = customRegexp || '[a-zA-Z0-9]+';
      customRegexp = '(' + customRegexp + ')';
      
      parameters[customProperty] = {
        regexp: customRegexp,
        property: customProperty
      }
    } else if (customRegexp) {
      // If a regex has no matching label, it'll be taken into account
      // but won't be caught when parsing log lines
      if (/\((?!\?:)/.test(customRegexp)) {
        return false;
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
  
  return format;
};