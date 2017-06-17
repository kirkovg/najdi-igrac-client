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
      getEventDetails : getEventDetailsFn
    };

    return service;

    function getUserDetailsFn(username) {
      $log.debug("in user-profile service");
      return $http.get('/api/users/findByUserName?userName=' + username);
    }

    function getEventsForUserFn(username) {
      return $http.get('/api/users/findEventsForUser?userName=' + username);
    }

    /*
    * move this to EventService
    *
    * */
    function getEventDetailsFn(eventId) {
      return $http.get('/api/events/' + eventId);
    }

  }
})(angular);
