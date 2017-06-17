(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client')
    .controller('EditProfileController', EditProfileController);

  EditProfileController.$inject = ['$log', '$state', 'EditProfileService', 'LoginService'];

  function EditProfileController($log, $state, EditProfileService, LoginService) {
    var vm = this;
    vm.userInfo = {};
    vm.events = [];
    vm.successUpdate = false;
    vm.updateUserDetails = updateUserDetails;


    getUserInfo();

    function getUserInfo() {
      if (LoginService.isLoggedIn()) {
        EditProfileService
          .getUserDetails(
            LoginService.getLoggedInUser()
          )
          .then(function (response) {
            vm.userInfo = response.data;
          });
      }
    }

    function updateUserDetails() {
      vm.successUpdate = false;
      if (LoginService.isLoggedIn()) {
        EditProfileService
          .updateUserDetails(
            vm.userInfo
          ).then(function (response) {
            vm.userInfo = {};
            vm.userInfo = response.data;
            vm.successUpdate = true;
        });
      }
    }

    function getUserPicture(userId) {
      //EditProfileService
        //.
    }

  }

})(angular);

