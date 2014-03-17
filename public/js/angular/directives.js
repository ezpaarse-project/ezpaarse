'use strict';

/* Directives */

angular.module('ezPAARSE.directives', [])
  .directive('bxslider', function () {
    return {
      restrict: 'C',
      link: function (scope, element, attributes) {
        element.bxSlider({
          mode: 'fade',
          captions: true,
          auto: true,
          adaptiveHeight: true
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
  .directive('ezTriggerClick', function () {
    return {
      restrict: 'A',
      link: function(scope, element, attributes) {
        $(element).click(function () {
          $(attributes['ezTriggerClick']).click();
        });
      }
    };
  })
  .directive('ezFileDrop', function () {
    return {
      restrict: 'A',
      link: function(scope, element, attributes) {
        var elem   = $(element);
        var fn     = attributes['ezFileDrop'];
        var dimmer = elem.find('.ui.dimmer');

        var preventDefault = function (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        var dimmed = function () {
          elem.addClass('over');
          dimmer.addClass('active');
        }
        var undimmed = function () {
          elem.removeClass('over');
          dimmer.removeClass('active');
        }

        elem.on('dragenter', function (e) {
          preventDefault(e);
          dimmed();
        });
        dimmer.on('dragover', function (e) {
          preventDefault(e);
        });
        dimmer.on('dragleave', function (e) {
          preventDefault(e);
          undimmed();
        });
        dimmer.on('drop', function (e) {
          preventDefault(e);
          undimmed();

          var files = e.originalEvent.dataTransfer.files;
          if (typeof scope[fn] == 'function') { scope[fn].call(this, files); }
        });
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