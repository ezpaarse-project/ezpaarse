'use strict';

/* Filters */

angular.module('ezPAARSE.filters', []).
  filter('bytesToSize', function() {
    return function(bytes) {
       var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
       if (bytes == 0) return '0 B';
       var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
       return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
    };
  });