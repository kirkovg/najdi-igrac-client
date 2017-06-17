(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$log', '$state','HomeService','LoginService','EventService'];

  /* @ngInject */
  function HomeController($log,$state,HomeService,LoginService,EventService) {
    var vm = this;
    vm.queryString = "";
    vm.entities = [];
    vm.searchEvents = searchEvents;
    vm.upcomingEvents = [];
    vm.joinEvent = joinEvent;
    vm.isRequestSent = isRequestSent;
    vm.errorMsg = "";
    vm.alreadySentRequests = [];
    loadAlreadySentRequests();
    loadUpcomingEvents();

    function searchEvents() {
      Event.searchEvents(vm.queryString).then(function (data) {
        vm.entities = data;
      });
    }
    function loadUpcomingEvents() {
      EventService.loadUpcomingEvents(0).then(function(response){
          vm.upcomingEvents = response.data;
          vm.upcomingEvents.forEach(function (ev) {
            var myDate = Date.parse(ev.dateTime);
            var moja = new Date(myDate);
            var entityDate = moja.toDateString().split(" ");
            var entityTime = moja.toTimeString().split(" ");
            var splitDate = {
              "year" : entityDate[3],
              "month": entityDate[1].charAt(0).toUpperCase() + entityDate[1].slice(1),
              "day" : entityDate[2],
              "dayInWeek" : entityDate[0],
              "time" : entityTime[0].split(":")[0] + ":" + entityTime[0].split(":")[1]
            };
            ev.dateTime = splitDate;
          });


        })
    }

    function loadAlreadySentRequests(){
      $log.info("vlaga");
      if((LoginService.isLoggedIn()))
      {
        EventService.findSentParticipatingRequests(LoginService.getLoggedInUser()).then(function(response){
        response.data.forEach(function(req)
        {
          vm.alreadySentRequests.push(req.event.id);
        })
      });

      }
    }

    function joinEvent(event){
      $log.info("click");
      $log.info(event);
      if(LoginService.isLoggedIn())
      {
        EventService.joinEvent(event);
      }
      else {
        $state.go("login");
      }
    }

    function isRequestSent(eventId){
      return vm.alreadySentRequests.includes(eventId);
    }

  }

})(angular);
