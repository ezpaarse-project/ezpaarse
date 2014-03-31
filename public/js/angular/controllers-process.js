'use strict';

/* Controllers of the process page */

angular.module('ezPAARSE.form-controllers')
  .controller('ProcessCtrl', function ($scope, requestService, socket) {
    $scope.request = requestService.data;
    $scope.nbLines = 0;
    $scope.tab     = 'metrics';
    $scope.report  = {};
    $scope.rejects = [
      { cat: 'rejets',  key: 'nb-lines-ignored',         percent: 0, css: { width: '0%' }, title: 'Lignes ignorées' },
      { cat: 'general', key: 'nb-denied-ecs',            percent: 0, css: { width: '0%' }, title: 'ECs en accès refusé' },
      { cat: 'rejets',  key: 'nb-lines-duplicate-ecs',   percent: 0, css: { width: '0%' }, title: 'Doublons filtrés' },
      { cat: 'rejets',  key: 'nb-lines-unordered-ecs',   percent: 0, css: { width: '0%' }, title: 'Anomalies chronologiques' },
      { cat: 'rejets',  key: 'nb-lines-ignored-domains', percent: 0, css: { width: '0%' }, title: 'Domaines ignorés' },
      { cat: 'rejets',  key: 'nb-lines-unknown-domains', percent: 0, css: { width: '0%' }, title: 'Domaines inconnus' },
      { cat: 'rejets',  key: 'nb-lines-unknown-format',  percent: 0, css: { width: '0%' }, title: 'Formats inconnus' },
      { cat: 'rejets',  key: 'nb-lines-unqualified-ecs', percent: 0, css: { width: '0%' }, title: 'ECs non qualifiés' },
      { cat: 'rejets',  key: 'nb-lines-pkb-miss-ecs',    percent: 0, css: { width: '0%' }, title: 'PKBs manquantes' }
    ];

    $scope.selectTab  = function (tab) { $scope.tab = tab; };

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