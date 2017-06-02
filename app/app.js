(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client', [
      'ui.router',
      'ui.select',
      'ngResource'
    ])

    .config(function ($httpProvider) {
      $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    });

})(angular);
