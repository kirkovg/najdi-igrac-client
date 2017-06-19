(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client')
    .controller('EditProfileController', EditProfileController);

  EditProfileController.$inject = ['$log', '$state', 'EditProfileService', 'LoginService', '$http'];

  function EditProfileController($log, $state, EditProfileService, LoginService, $http) {
    var vm = this;
    vm.userInfo = {};
    vm.events = [];
    vm.successUpdate = false;
    vm.selectedUploadFile = null;
    vm.pictureSrc = null;
    vm.isAdmin = false;
    vm.isAnon = false;

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
            if (vm.userInfo.userType === 'ROLE_ADMIN') {
              vm.pictureSrc = '../images/admin.png';
              vm.isAdmin = true;
            } else {
              getUserPicture(vm.userInfo.id);
              vm.isAdmin = false;
            }

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
            updatePicture(vm.userInfo.id);
            vm.successUpdate = true;
        });
      }
    }

    function updatePicture(userId) {
      var formData = new FormData();
      formData.append('file', vm.selectedUploadFile);
      EditProfileService
        .uploadUserPicture(formData,userId)
        .then(function (success) {
          $log.debug("success uploading from controller");
        }, function (error) {
          $log.debug("error uploading from controller");
      });
    }

    function getUserPicture(userId){
      EditProfileService
        .checkIfPictureExists(userId)
        .then(function (data) {
          vm.pictureSrc = null;
          $log.debug("picture exists edit-profile controller");
          vm.pictureSrc = '/api/users/getUserPicture/' + userId;
        }, function (error) {
          $log.debug('no picture for this user');
          vm.pictureSrc = '../images/anon.png';
          vm.isAnon = true;
        });
    }

  }

})(angular);

