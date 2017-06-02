(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client')
    .config(registerState);


  registerState.$inject = ['$stateProvider'];

  function registerState($stateProvider) {

    $stateProvider.state('login', {
      url: '/login',
      templateUrl: 'app/login/login.view.html',
      controller: 'LoginController',
      controllerAs: 'vm'
    });
  }

})(angular);
