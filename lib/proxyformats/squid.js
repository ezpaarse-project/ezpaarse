/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
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
    '%ts':  {regexp: '([0-9]+)',                  property: 'time'},
    '%tu':  {regexp: '([0-9]+)',                  property: 'subsecond'},
    '%tr':  {regexp: '([0-9]+)',                  property: 'responseTime'},
    '%tl':  {regexp: '([^\\]]+)',                 property: 'date'},
    '%>a':  {regexp: '([a-zA-Z0-9\\., ]+|\\-)',   property: 'host'},
    '%<a':  {regexp: '([a-zA-Z0-9\\., ]+|\\-)',   property: 'lastConnection'},
    '%<A':  {regexp: '([a-zA-Z0-9\\.\\-]+)',      property: 'domain'},
    '%Ss':  {regexp: '([a-zA-Z_]+)',              property: 'squidRequestStatus'},
    '%lp':  {regexp: '([0-9]+)',                  property: 'port'},
    '%>Hs': {regexp: '([0-9]+)',                  property: 'status'},
    '%<st': {regexp: '([0-9]+)',                  property: 'size'},
    '%rm':  {regexp: '([A-Z]+)',                  property: 'method'},
    '%rv':  {regexp: '([0-9]\\.[0-9])',           property: 'protocolVersion'},
    '%ru':  {regexp: '([^ ]+)',                   property: 'url'},
    '%[un': {regexp: '([a-zA-Z0-9@\\.\\-_%=,]+)', property: 'login'},
    '%Sh':  {regexp: '([a-zA-Z]+)',               property: 'squidHierarchyStatus'},
    '%mt':  {regexp: '([a-zA-Z]+\\/[a-zA-Z]+)',   property: 'mime'},
    '%ui':  {regexp: '(-)',                       property: 'identd'}
  }


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
  var paramRegex = /(%[a-zA-Z]{1,2}|%(?:[0-9]+)?(?:[0-9]+)?[<>\[]?[a-zA-Z]{1,2}|%{[a-zA-Z0-9\-_]+}<[^<>]+>|%<[^<>]+>|%{[a-zA-Z0-9\-_]+})/g;
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
      if (/\((?!\?:)/.test(customRegexp)) {
        return false;
      }
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
    // When having min/max chain length (like %01x or %01.02x) we ignore numbers
    var param = parameters[customProperty || paramToTranslate.replace(/[0-9]+(\.[0-9]+)?/, '')];
    if (param) {
      format.properties.push(param.property);
      format.regexp = format.regexp.replace(regexpEscape(paramToTranslate), '[ ]*' + param.regexp);
    }
  }
  
  return format;
};