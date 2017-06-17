(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client')
    .controller('EventController', EventController);

  EventController.$inject = ['$log', '$state', 'HomeService', 'LoginService', 'EventService'];

  /* @ngInject */
  function EventController($log, $state, HomeService, LoginService, EventService) {
    var vm = this;
    vm.dateNow = getCurrentDate();
    vm.searchEvents = searchEvents;
    vm.upcomingEvents = [];
    vm.joinEvent = joinEvent;
    vm.isRequestSent = isRequestSent;
    vm.getNthPage = getNthPage;
    vm.isSinglePage = isSinglePage;
    vm.findEventsBySport = findEventsBySport;
    vm.loadUpcomingEvents = loadUpcomingEvents;
    vm.createAnEvent = createAnEvent;
    vm.errorMsg = "";
    vm.pageNr = [];
    vm.selectedPage = 0;
    vm.selectedCategory = 'All';
    vm.alreadySentRequests = [];
    vm.event = {};
    vm.dateTime = [];

    loadAlreadySentRequests();
    loadUpcomingEvents();

    function getCurrentDate() {
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1; //January is 0!
      var yyyy = today.getFullYear();

      if (dd < 10) {
        dd = '0' + dd
      }

      if (mm < 10) {
        mm = '0' + mm
      }

      today = dd + '/' + mm + '/' + yyyy;
      return today;
    }

    function searchEvents() {
      EventService.searchEvents(vm.queryString).then(function (data) {
        vm.entities = data;
      });
    }

    function loadUpcomingEvents() {
      EventService.loadUpcomingEvents(vm.selectedPage).then(function (response) {
        vm.upcomingEvents = response.data;
        vm.upcomingEvents.forEach(function (ev) {
          var myDate = Date.parse(ev.dateTime);
          var moja = new Date(myDate);
          var entityDate = moja.toDateString().split(" ");
          var entityTime = moja.toTimeString().split(" ");
          var splitDate = {
            "year": entityDate[3],
            "month": entityDate[1].charAt(0).toUpperCase() + entityDate[1].slice(1),
            "day": entityDate[2],
            "dayInWeek": entityDate[0],
            "time": entityTime[0].split(":")[0] + ":" + entityTime[0].split(":")[1]
          };
          ev.dateTime = splitDate;
        });
        var broj;
        EventService.getEventsCount().then(function (response) {
          broj = response.data;
          broj /= 2;
          broj = Math.ceil(broj);
          vm.pageNr = new Array(broj);

          for (var i = 0; i < broj; i++) {
            vm.pageNr[i] = i;
          }

        });
        vm.selectedCategory = 'All';
      })
    }

    function loadAlreadySentRequests() {
      $log.info("vlaga");
      if ((LoginService.isLoggedIn())) {
        EventService.findSentParticipatingRequests(LoginService.getLoggedInUser()).then(function (response) {
          response.data.forEach(function (req) {
            vm.alreadySentRequests.push(req.event.id);
          })
        });

      }
    }

    function joinEvent(event) {
      if (LoginService.isLoggedIn()) {
        EventService.joinEvent(event).then(function (response) {
          $log.info("go add" + event.id);
          vm.alreadySentRequests.push(event.id);
        });
      }
      else {
        $state.go("login");
      }
    }

    function isRequestSent(eventId) {
      return vm.alreadySentRequests.includes(eventId);
    }

    function createAnEvent() {
      var myDate = vm.dateTime.date.toString().split(" ");
      var myTime = vm.dateTime.time.toString().split(" ");
      if (myDate[1] === 'Oct' || myDate[1] === 'Nov' || myDate[1] === 'Dec')
        vm.event.dateTime = myDate[3] + "-" + getMonth(myDate[1]) + "-" + myDate[2] + "T" + myTime[4];
      else
        vm.event.dateTime = myDate[3] + "-0" + getMonth(myDate[1]) + "-" + myDate[2] + "T" + myTime[4];
      //vm.event.dateTime = "2017-06-15T23:54:00";
      vm.event.admin={
        'userName':LoginService.getLoggedInUser()
      };
      EventService.createAnEvent(vm.event).then(function () {
        $log.info("Sucess!");
        vm.event = [];
      });

    }

    function getMonth(monthStr) {
      return new Date(monthStr + '-1-01').getMonth() + 1
    }

    function findEventsBySport(sport) {
      EventService.loadEventsBySport(sport, vm.selectedPage).then(function (response) {
        vm.upcomingEvents = response.data;
        vm.upcomingEvents.forEach(function (ev) {
          var myDate = Date.parse(ev.dateTime);
          var moja = new Date(myDate);
          var entityDate = moja.toDateString().split(" ");
          var entityTime = moja.toTimeString().split(" ");
          var splitDate = {
            "year": entityDate[3],
            "month": entityDate[1].charAt(0).toUpperCase() + entityDate[1].slice(1),
            "day": entityDate[2],
            "dayInWeek": entityDate[0],
            "time": entityTime[0].split(":")[0] + ":" + entityTime[0].split(":")[1]
          };
          ev.dateTime = splitDate;
        });

        var broj;
        EventService.getEventsCountBySport(sport).then(function (response) {
          broj = response.data;
          broj /= 2;
          broj = Math.ceil(broj);
          vm.pageNr = new Array(broj);
          for (var i = 0; i < broj; i++) {
            vm.pageNr[i] = i;
          }
        });
        vm.selectedCategory = sport;
      });
    }

    function getNthPage(n) {
      vm.selectedPage = n;
      if (vm.selectedCategory === 'All')
        loadUpcomingEvents(n);
      else
        findEventsBySport(vm.selectedCategory, n);

    }

    function isSinglePage() {
      return vm.pageNr.length() == 1;
    }
  }

})(angular);
