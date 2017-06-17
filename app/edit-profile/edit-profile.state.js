(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client')
    .config(registerState);


  registerState.$inject = ['$stateProvider'];

  function registerState($stateProvider) {

    $stateProvider.state('editProfile', {
      url: '/edit-profile',
      templateUrl: 'app/edit-profile/edit-profile.view.html',
      controller: 'EditProfileController',
      controllerAs: 'vm'
    });
  }

})(angular);
