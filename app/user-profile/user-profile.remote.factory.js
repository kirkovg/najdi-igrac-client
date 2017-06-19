(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client')
    .factory('UserProfileService', UserProfileServiceFn);

  UserProfileServiceFn.$inject = ['$log', '$http'];

  function UserProfileServiceFn($log, $http) {
    var service = {
      getUserDetails: getUserDetailsFn,
      getEventsForUser: getEventsForUserFn,
      getEventDetails : getEventDetailsFn,
      checkFollowing: checkFollowingFn,
      followUser: followUserFn,
      unFollowUser: unFollowUserFn
    };

    return service;

    function getUserDetailsFn(username) {
      $log.debug("in user-profile service");
      return $http.get('/api/users/findByUserName?userName=' + username);
    }

    function getEventsForUserFn(username) {
      return $http.get('/api/users/findEventsForUser?userName=' + username);
    }

    function getEventDetailsFn(eventId) {
      return $http.get('/api/events/' + eventId);
    }

    function checkFollowingFn(userToFollowId) {
      return $http.get('/api/users/'+userToFollowId+'/isFollowing')
        .then(function(response) {
          $log.debug("got my response from checkFollowing in userporfile service"+response);
          $log.debug(response.data);
          return response.data;
        }, function (response) {
          $log.debug('error getting response from isFollowing endpoint');
          return Promise.reject();
        });
    }

    function followUserFn(userToFollowId) {
      return $http
        .post('/api/users/follow/' + userToFollowId)
        .then(function (response) {
          $log.debug('successfully followed user with id (UserProfileService) ' + userToFollowId);
        },function (response) {
          $log.debug('error following user with id (UserProfileService) ' + userToFollowId);
          return Promise.reject();
        });
    }

    function unFollowUserFn(userToFollowId) {
      return $http
        .post('/api/users/unfollow/' + userToFollowId)
        .then(function (response) {
          $log.debug('successfully unfollowed user with id (UserProfileService) ' + userToFollowId);
        },function (response) {
          $log.debug('error unfollowing user with id (UserProfileService) ' + userToFollowId);
          return Promise.reject();
        });
    }



  }
})(angular);
