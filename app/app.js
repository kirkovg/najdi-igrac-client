(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client', [
      'ui.router',
      'ui.select',
      'ngResource',
      'ngCookies'
    ])

    .config(function ($httpProvider) {
      $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

      /*
      * Essential to access protected resources.
      * Used to send back the cookie storing the authenticated JSESSIONID
      * */
      $httpProvider.defaults.withCredentials = true;
    });

})(angular);
