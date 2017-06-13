(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client')
    .config(registerState);


  registerState.$inject = ['$stateProvider', '$httpProvider'];

  function registerState($stateProvider) {

    $stateProvider.state('user', {
      url: '/user',
      templateUrl: 'app/user/user.view.html',
      controller: 'UserController',
      controllerAs: 'vm'
    });
  }

})(angular);
