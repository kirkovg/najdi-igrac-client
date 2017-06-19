(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client')
    .factory('NotificationsService', NotificationsServiceFn);

  NotificationsServiceFn.$inject = ['$log', '$http'];

  function NotificationsServiceFn($log, $http) {
    var service = {
      getParticipatingRequests: getParticipatingRequestsFn,
      getInviteRequests: getInviteRequestsFn,
      acceptInvite: acceptInviteFn,
      rejectInvite: rejectInviteFn,
      getParticipatingRequestsForMyEvents: getParticipatingRequestsForMyEventsFn,
      acceptParticipatingRequest: acceptParticipatingRequestFn,
      rejectParticipatingRequest: rejectParticipatingRequestFn
    };
    return service;

    function getParticipatingRequestsFn() {
      return $http
        .get('/api/participateRequests/forAuthenticatedUser')
        .then(function (response) {
          return response.data;
        }, function (response) {
          Promise.reject();
        });
    }

    function getInviteRequestsFn() {
      return $http
        .get('/api/inviteRequests/forAuthenticatedUser')
        .then(function (response) {
          return response.data;
        }, function (response) {
          Promise.reject();
        });
    }

    function getParticipatingRequestsForMyEventsFn() {
      return $http
        .get('/api/participateRequests/getParticipateRequestsForMyEvents')
        .then(function (response) {
          $log.debug("got my answer from getParticipatingRequestsForMyEvents");
          return response.data;
        }, function (response) {
          $log.debug("error getting my answer from getParticipatingRequestsForMyEvents");
          Promise.reject();
        });
    }

    function acceptInviteFn(inviteId, userId) {
      return $http
        .post('/api/inviteRequests/' + inviteId + '/acceptInvite/' + userId);
    }


    function rejectInviteFn(inviteId, userId) {
      return $http
        .post('/api/inviteRequests/' + inviteId + '/rejectInvite/' + userId);
    }

    function acceptParticipatingRequestFn(requestId) {
      return $http
        .post('/api/participateRequests/accept/'+requestId);
    }

    function rejectParticipatingRequestFn(requestId) {
      return $http
        .post('/api/participateRequests/reject/' + requestId);
    }

  }
})(angular);
