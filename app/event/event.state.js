(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client')
    .config(registerState);


  registerState.$inject = ['$stateProvider'];

  function registerState($stateProvider) {

    $stateProvider.state('event', {
      url: '/events',
      templateUrl: 'app/event/event.view.html',
      controller: 'EventController',
      controllerAs: 'vm'
    });
  }

})(angular);
