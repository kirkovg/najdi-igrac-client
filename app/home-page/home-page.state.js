(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client')
    .config(registerState);


  registerState.$inject = ['$stateProvider'];

  function registerState($stateProvider) {

    $stateProvider.state('homePage', {
      url: '/',
      templateUrl: 'app/home-page/home-page.view.html',
      controller: 'SearchController',
      controllerAs: 'vm'
    });
  }

})(angular);
