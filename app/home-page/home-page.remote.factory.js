/**
 * Created by Win 8 on 12.05.2017.
 */
(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client')
    .factory('HomeService', HomeServiceFn);

  HomeServiceFn.$inject = ['$log', '$resource', '$http'];

  /* @ngInject */
  function HomeServiceFn($log, $resource, $http) {

    var service = {
      searchEvents: searchEventsFn,
      loadUpcomingEvents: loadUpcomingEventsFn,
      joinEvent: joinEventFn,
      findSentParticipatingRequests:findSentParticipatingRequestsFn
    };

    return service;

    function searchEventsFn(queryString) {
      $log.debug(queryString);
      return $resource("/api/search?query=" + queryString).query().$promise;
    }

    function loadUpcomingEventsFn(){
      return $http.get("/api/events/upcoming");
    }
    function findSentParticipatingRequestsFn(userName){
      return $http.get("/api/events/participatingRequests?userName=" + userName);
    }
    function joinEventFn(eventId) {
        $http.post(
        "http://localhost:8080/api/events/participate/" + eventId
      ).then(function (response) {
        $log.info("You joined the event!!");
      }, function (response) {
        $log.info("You cant join the event!")
      });
    }
  }

})(angular);

