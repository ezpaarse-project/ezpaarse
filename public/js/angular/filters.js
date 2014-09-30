'use strict';

/* Filters */

angular.module('ezPAARSE.filters', [])
  .filter('bytesToSize', function() {
    return function (bytes) {
      var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
      if (bytes == 0) return '0 B';
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
      return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
    };
  })
  .filter('localNumber', function() {
    return function (str) {
      var number = parseInt(str, 10);
      if (isNaN(number)) {
        return '';
      } else {
        return number.toLocaleString();
      }
    };
  })
  .filter('toLink', function ($filter) {
    return function (text, target) {
      if (text === 0) { return '0'; }
      text = (text || '').toString();
      if (/^https?:\/\//.test(text)) {
        return $filter('linky')(text, target);
      } else {
        return text;
      }
    };
  })
  .filter('join', function ($filter) {
    return function (array, separator) {
      if (Array.isArray(array)) {
        return array.join(separator || ',');
      } else {
        return '';
      }
    };
  })
  .filter('sumOf', function ($filter) {
    return function (array, property) {
      if (!angular.isArray(array)) { return 0; }

      var sum = 0;
      array.forEach(function (element) {
        sum += element[property];
      });
      return sum;
    };
  })
  .filter('reportCategories', function () {
    return function (report) {
      var categories = [];
      if (!report) { return categories; }

      for (var key in report) {
        if (key == 'general') { categories.unshift(key); }
        else { categories.push(key); }
      }
      return categories;
    };
  })
  .filter('reportElements', function () {
    return function (report, category) {
      if (!report) { return {}; }
      return report[category];
    };
  });