(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client')
    .config(registerState);


  registerState.$inject = ['$stateProvider'];

  function registerState($stateProvider) {

    $stateProvider.state('userProfile', {
      url: '/user-profile',
      templateUrl: 'app/user-profile/user-profile.view.html',
      controller: 'UserProfileController',
      controllerAs: 'vm'
    });
  }

})(angular);
