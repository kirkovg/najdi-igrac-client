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
      getMyEventsCount:getMyEventsCountFn,
      createAnEvent:createAnEventFn,
      cancelRequest:cancelRequestFn,
      loadMyEvents:loadMyEventsFn,
      deleteEvent:deleteEventFn

    };

    return service;

    function searchEventsFn(queryString) {
      $log.debug(queryString);
      return $http.get("/api/search?query=" + queryString);
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
    function getMyEventsCountFn() {
      return $http.get("/api/events/myEvents/count");
    }
    function getEventsCountBySportFn(sport){
      return $http.get("/api/events/upcoming/category/count?sport=" + sport);
    }
    function createAnEventFn(event,sendInvitesToFollowers){
      $log.info(event);
      return $http.post("api/events?sendInvites=" + sendInvitesToFollowers,event);
    }
    function joinEventFn(eventId) {
        return $http.post(
        "http://localhost:8080/api/events/participate/" + eventId
      ).then(function (response) {
        $log.info("You sent participating request for the event!!");
      }, function (response) {
        $log.info("You cant join the event!");
          return undefined;
      });
    }
    function cancelRequestFn(eventId) {
        return $http.delete("api/events/participate/" + eventId).then(function (response) {
          $log.info("You canceled your request");
        },function (response) {
          $log.info("Canceling failed!");
        })
    }
    function deleteEventFn(eventId) {
        return $http.delete("api/events/" + eventId).then(function (response) {
          $log.info("Event deleted!")
        });
    }
    function loadMyEventsFn(pageNr){
      return $http.get("api/events/myEvents?pageNr=" + pageNr)
    }

  }

})(angular);

