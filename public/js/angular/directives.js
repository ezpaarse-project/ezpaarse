'use strict';

/* Directives */

angular.module('ezPAARSE.directives', [])
  .directive('ezBxslider', function () {
    return {
      link: function (scope, element, attrs) {
        element.bxSlider({
          captions: true,
          auto: true,
          autoControls: true
        });
      }
    };
  })
  .directive('modal', function () {
    return {
      restrict: 'C',
      link: function(scope, elem, attr) {
        if (attr['attachedTo']) {
          $(elem).modal('attach events', attr['attachedTo'], 'toggle');
        }
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
  });