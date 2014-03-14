'use strict';

/* Directives */

angular.module('ezPAARSE.directives', [])
  .directive('ezBxslider', function () {
    return {
      link: function (scope, element, attributes) {
        element.bxSlider({
          captions: true,
          auto: true,
          autoControls: true
        });
      }
    };
  })
  .directive('sidebar', function () {
    return {
      restrict: 'C',
      link: function(scope, element, attributes) {
        $(element).sidebar({ overlay: true });
      }
    };
  })
  .directive('ezAttachedTo', function () {
    return {
      restrict: 'A',
      link: function(scope, element, attributes) {
        var elem = $(element);
        if (elem.hasClass('modal')) { elem.modal('attach events', attributes['ezAttachedTo'], 'toggle'); }
        if (elem.hasClass('sidebar')) { elem.sidebar('attach events', attributes['ezAttachedTo'], 'toggle'); }
      }
    };
  })
  .directive('form', function () {
    return {
      restrict: 'E',
      link: function (scope, element, attributes) {
        element.submit(function (e) {
          e.preventDefault();
          e.stopPropagation();
        });
      }
    };
  }).directive('ezCheckbox', function () {
    return {
      restrict: 'E',
      link: function (scope, element, attributes) {
        element.checkbox();
      }
    };
  }).directive('ezChosen', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attributes) {
        $(element).chosen();
      }
    };
  });