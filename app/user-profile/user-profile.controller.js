(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client')
    .controller('UserProfileController', UserProfileController);

  UserProfileController.$inject = ['$log', '$state', 'UserProfileService', 'LoginService', 'EditProfileService'];

  function UserProfileController($log, $state, UserProfileService, LoginService, EditProfileService) {
    var vm = this;
    vm.userInfo = {};
    vm.events = [];
    vm.eventDetails = {};
    vm.pictureSrc = null;
    vm.isAdmin = false;
    vm.isAnon = false;
    vm.showDetailsAboutUser = false;
    vm.isFollowing = false;
    vm.isLoggedInUser = true;
    vm.followUser = followUser;
    vm.unFollowUser = unFollowUser;
    vm.toggleDetails = toggleDetails;
    vm.getUserInfoForOtherUsers = getUserInfoForOtherUsers;
    vm.getEventDetails = getEventDetails;

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
            if (vm.userInfo.userType === 'ROLE_ADMIN') {
              vm.pictureSrc = '../images/admin.png';
              vm.isAdmin = true;
            } else {
              getUserPicture(vm.userInfo.id);
              vm.isAdmin = false;
            }
            getUserEvents();

            //checkFollowing();
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

    function getUserInfoForOtherUsers(username) {
      if (LoginService.isLoggedIn()) {
        UserProfileService
          .getUserDetails(
            username
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
            vm.events = [];
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

    function getUserPicture(userId) {
      EditProfileService
        .checkIfPictureExists(userId)
        .then(function (data) {
          vm.pictureSrc = null;
          $log.debug("picture exists user-profile controller");
          vm.pictureSrc = '/api/users/getUserPicture/' + userId;
        }, function (error) {
          $log.debug('no picture for this user');
          vm.pictureSrc = '../images/anon.png';
          vm.isAnon = true;
        });
    }




    function checkFollowing() {
      if (LoginService.isLoggedIn()) {
        var currentUser = LoginService.getLoggedInUser();
        if (vm.userInfo.userName !== currentUser) {
          // means that the shown user-profile is not that of the logged in user i.e it's someone else's
          UserProfileService
            .checkFollowing(vm.userInfo.id).then(function (data) {
            $log.debug("got my response from checkFollowing in user controller --> " + data);
            vm.isFollowing = data;
            vm.isLoggedInUser = false;
          });
        } else {
          vm.isLoggedInUser = true;
        }
      }
    }

    /*
    *
    * Called on button click Follow
    * */
    function followUser() {
      if (LoginService.isLoggedIn()) {
        UserProfileService
          .followUser(vm.userInfo.id)
          .then(function () {
            vm.isFollowing = true;

            //reload details for the current user who has been followed/unfollowed
            getUserInfoForOtherUsers(vm.userInfo.userName);
          });
      }
    }

    /*
     *
     * Called on button click Unfollow
     * */
    function unFollowUser() {
      if (LoginService.isLoggedIn()) {
        UserProfileService
          .unFollowUser(vm.userInfo.id)
          .then(function () {
            vm.isFollowing = false;

            //reload details for the current user who has been followed/unfollowed
            getUserInfoForOtherUsers(vm.userInfo.userName);
          });
      }
    }


    //private function
    function parseDate(date) {
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

