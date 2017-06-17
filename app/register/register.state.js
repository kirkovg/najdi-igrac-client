(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client')
    .config(registerState);


  registerState.$inject = ['$stateProvider'];

  function registerState($stateProvider) {

    $stateProvider.state('register', {
      url: '/register',
      templateUrl: 'app/register/register.view.html',
      controller: 'RegisterController',
      controllerAs: 'vm'
    });
  }

})(angular);
