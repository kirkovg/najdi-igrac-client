/**
 * Created by Win 8 on 12.05.2017.
 */
(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client')
    .factory('EventService', EventServiceFn);

  EventServiceFn.$inject = ['$log', '$resource', '$http'];

  /* @ngInject */
  function EventServiceFn($log, $resource, $http) {

    var service = {
      searchEvents: searchEventsFn,
      loadUpcomingEvents: loadUpcomingEventsFn,
      joinEvent: joinEventFn,
      findSentParticipatingRequests:findSentParticipatingRequestsFn,
      loadEventsBySport:loadEventsBySportFn,
      getEventsCount:getEventsCountFn,
      getEventsCountBySport:getEventsCountBySportFn,
      createAnEvent:createAnEventFn

    };

    return service;

    function searchEventsFn(queryString) {
      $log.debug(queryString);
      return $resource("/api/search?query=" + queryString).query().$promise;
    }

    function loadUpcomingEventsFn(pageNr){
      $log.info(pageNr);
      return $http.get("/api/events/upcoming?pageNr=" + pageNr);
    }
    function loadEventsBySportFn(sport,pageNr){
      return $http.get("/api/events/upcoming/category?sport="+sport+"&pageNr="+ pageNr);
    }
    function findSentParticipatingRequestsFn(userName){
      return $http.get("/api/events/participatingRequests?userName=" + userName);
    }
    function getEventsCountFn(){
      return $http.get("/api/events/upcoming/count");
    }
    function getEventsCountBySportFn(sport){
      return $http.get("/api/events/upcoming/category/count?sport=" + sport);
    }
    function createAnEventFn(event){
      return $http.post("api/events",event);
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

