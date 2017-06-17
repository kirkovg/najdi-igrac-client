(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client')
    .controller('UserProfileController', UserProfileController);

  UserProfileController.$inject = ['$log', '$state', 'UserProfileService', 'LoginService'];

  function UserProfileController($log, $state, UserProfileService, LoginService) {
    var vm = this;
    vm.userInfo = {};
    vm.events = [];
    vm.eventDetails = {};
    vm.toggleDetails = toggleDetails;
    vm.getUserInfoForOtherUsers = getUserInfoForOtherUsers;
    vm.getEventDetails = getEventDetails;

    vm.showDetailsAboutUser = false;

    getUserInfo();




    function toggleDetails() {
      if (!vm.showDetailsAboutUser) {
        vm.showDetailsAboutUser = true;
      } else {
        vm.showDetailsAboutUser = false;
      }
    }


    function getUserInfo() {
      if (LoginService.isLoggedIn()) {
        UserProfileService
          .getUserDetails(
            LoginService.getLoggedInUser()
          )
          .then(function (response) {
            vm.userInfo = response.data;
            getUserEvents();
            checkFollowing();
          });
      }
    }

    function getUserEvents() {
      if (LoginService.isLoggedIn()) {
        UserProfileService
          .getEventsForUser(
            LoginService.getLoggedInUser()
          )
          .then(function (response) {
            vm.events = response.data;
          });
      }
    }

    function getUserInfoForOtherUsers(username){
      if (LoginService.isLoggedIn()) {
        UserProfileService
          .getUserDetails(
            username
          )
          .then(function (response) {
            vm.userInfo = response.data;
            getUserEventsForOtherUsers(username);
            checkFollowing();
          });
      }
    }


    function getUserEventsForOtherUsers(username) {
      if (LoginService.isLoggedIn()) {
        UserProfileService
          .getEventsForUser(
            username
          )
          .then(function (response) {
            vm.events = response.data;
          });
      }
    }

    function getEventDetails(eventId) {
      UserProfileService
        .getEventDetails(eventId)
        .then(function (response) {
          vm.eventDetails = response.data;
          vm.eventDetails.dateTime = parseDate(new Date(Date.parse(vm.eventDetails.dateTime)).toString());
        })
    }




    function checkFollowing() {
      if (LoginService.isLoggedIn()) {
        var currentUser = LoginService.getLoggedInUser();
        if (vm.userInfo.userName !== currentUser) {
          // means that the shown user-profile is not that of the logged in user i.e it's someone else's
          $log.debug(vm.userInfo.userName);
        } else {
          $log.debug(currentUser);
        }
      }
    }





    //private function
    function parseDate(date){
      var tmpDate = date.split(" ");
      var parsedDate = {
        day: tmpDate[2],
        month: tmpDate[1],
        year: tmpDate[3],
        time: tmpDate[4]
      };
      return parsedDate;
    }
  }

})(angular);

