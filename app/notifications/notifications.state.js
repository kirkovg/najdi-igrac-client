(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client')
    .config(registerState);


  registerState.$inject = ['$stateProvider'];

  function registerState($stateProvider) {

    $stateProvider.state('notifications', {
      url: '/notifications',
      templateUrl: 'app/notifications/notifications.view.html',
      controller: 'NotificationsController',
      controllerAs: 'vm'
    });
  }

})(angular);
