'use strict';

/* Controllers of the process page */

angular.module('ezPAARSE.form-controllers')
  .controller('ProcessCtrl', function ($scope, $location, requestService, socket) {
    $scope.request = requestService.data;
    $scope.nbLines = 0;
    $scope.tab     = 'metrics';
    $scope.logs    = [];
    $scope.report  = {};
    $scope.rejects = [
      { cat: 'general', key: 'nb-denied-ecs',            percent: 0, css: { width: '0%' }, title: 'rejects+denied_ecs' },
      { cat: 'rejets',  key: 'nb-lines-duplicate-ecs',   percent: 0, css: { width: '0%' }, title: 'rejects+duplicates' },
      { cat: 'rejets',  key: 'nb-lines-unordered-ecs',   percent: 0, css: { width: '0%' }, title: 'rejects+chrono_anomalies' },
      { cat: 'rejets',  key: 'nb-lines-ignored-domains', percent: 0, css: { width: '0%' }, title: 'rejects+ignored_domains' },
      { cat: 'rejets',  key: 'nb-lines-unknown-domains', percent: 0, css: { width: '0%' }, title: 'rejects+unknown_domains' },
      { cat: 'rejets',  key: 'nb-lines-unknown-format',  percent: 0, css: { width: '0%' }, title: 'rejects+unknown_formats' },
      { cat: 'rejets',  key: 'nb-lines-unqualified-ecs', percent: 0, css: { width: '0%' }, title: 'rejects+unqualified_ecs' },
      { cat: 'rejets',  key: 'nb-lines-pkb-miss-ecs',    percent: 0, css: { width: '0%' }, title: 'rejects+missing_pkbs' }
    ];

    $scope.selectTab = function (tab) { $scope.tab = tab; };
    $scope.selectHelper = function (helper) { $scope.helper = helper; };

    $scope.abort = function () {
      requestService.abort(function () {
        $location.path('/form');
      });
    };

    $scope.inProgress = function () {
      return requestService.isLoading();
    };

    socket.on('logging', function (log) {
      $scope.logs.push(log);
    });

    socket.on('report', function (report) {
      $scope.report = report;

      $scope.nbLines = report.general['nb-lines-input'] - report.rejets['nb-lines-ignored'];
      if (!$scope.nbLines) { $scope.nbLines = 0; return; }

      $scope.rejects.forEach(function (reject) {
        reject.number    = report[reject.cat][reject.key];
        reject.percent   = (reject.number / $scope.nbLines) * 100;
        reject.css.width = reject.percent + '%';
        reject.warning   = (reject.percent > 25);
      });
    });
  });