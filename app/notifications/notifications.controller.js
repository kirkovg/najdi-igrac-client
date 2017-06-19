(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client')
    .controller('NotificationsController', NotificationsControllerFn);

  NotificationsControllerFn.$inject = ['$log', '$state', 'LoginService', 'NotificationsService'];

  /* @ngInject */
  function NotificationsControllerFn($log, $state, LoginService, NotificationsService) {
    var vm = this;
    vm.participatingRequests = [];
    vm.inviteRequests = [];
    vm.requestsForMyEvents = [];
    vm.acceptInvite = acceptInvite;
    vm.rejectInvite = rejectInvite;
    vm.acceptParticipatingRequest = acceptParticipatingRequest;
    vm.rejectParticipatingRequest = rejectParticipatingRequest;

    loadNotifications();

    function loadNotifications() {
      if (LoginService.isLoggedIn()) {
        getParticipatingRequests();
        getInviteRequests();
        getParticipatingRequestsForMyEvents();
      }
    }

    function getParticipatingRequests() {
      NotificationsService
        .getParticipatingRequests()
        .then(function (data) {
          vm.participatingRequests = data;
        }, function (error) {
          $log.debug(error);
        });
    }


    function getInviteRequests() {
      NotificationsService
        .getInviteRequests()
        .then(function (data) {
          vm.inviteRequests = data;
        }, function (error) {
          $log.debug(error);
        });
    }

    function getParticipatingRequestsForMyEvents() {
      NotificationsService
        .getParticipatingRequestsForMyEvents()
        .then(function (data) {
          vm.requestsForMyEvents = data;
        });
    }

    function acceptInvite(inviteId, userId) {
      NotificationsService
        .acceptInvite(inviteId, userId)
        .then(function () {
          $log.debug('success accepting invite');
          getInviteRequests();
        }, function () {
          $log.debug('error acceptin invite');
        });
    }

    function rejectInvite(inviteId, userId) {
      NotificationsService
        .rejectInvite(inviteId, userId)
        .then(function () {
          $log.debug('success accepting invite');
          getInviteRequests();
        }, function () {
          $log.debug('error acceptin invite');
        });
    }

    function acceptParticipatingRequest(requestId) {
      $log.debug('in accept participating');
      NotificationsService
        .acceptParticipatingRequest(requestId)
        .then(function () {
          $log.debug('succesfuly accepted request');
          getParticipatingRequestsForMyEvents();
        });
    }

    function rejectParticipatingRequest(requestId) {

      $log.debug('in reject participating');
      NotificationsService
        .rejectParticipatingRequest(requestId)
        .then(function () {
          $log.debug('succesfuly rejected request');
          getParticipatingRequestsForMyEvents();
        });
    }


  }
})(angular);

