(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client')
    .controller('EventController', EventController);

  EventController.$inject = ['$log', '$state', 'HomeService',
    'LoginService', 'EventService', 'EditProfileService', 'UserProfileService'];

  /* @ngInject */
  function EventController($log, $state, HomeService,
                           LoginService, EventService,
                           EditProfileService, UserProfileService) {
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
    vm.cancelRequest=cancelRequest;
    vm.loadMyEvents=loadMyEvents;
    vm.makeItDeleteing = makeItDeleteing;
    vm.deleteEvent = deleteEvent;
    vm.eventsOverview = eventsOverview;
    vm.loadParticipatingEvents = loadParticipatingEvents;
    vm.isMyEvent = isMyEvent;
    vm.isMyEvent=isMyEvent;
    vm.getEventDetails =getEventDetails;
    vm.deleteingEvent = {};
    vm.myEventsClicked = false;
    vm.errorMsg = "";
    vm.pageNr = [];
    vm.selectedPage = 0;
    vm.selectedCategory = 'All';
    vm.todayDate = new Date().toISOString().split('T')[0];
    vm.sendInvitesToFollowers = false;
    vm.eventDetails = {};
    vm.alreadySentRequests = [];
    vm.event = {};
    vm.dateTime = [];
    vm.pictureSrc = null;
    vm.isAdmin = false;
    vm.isAnon = false;

    loadAlreadySentRequests();
    loadUpcomingEvents();
    loadUserPicture();


    function loadUserPicture() {
      $log.debug('in loadUserPictutre()');
      if (LoginService.isLoggedIn()) {
        UserProfileService
          .getUserDetails(
            LoginService.getLoggedInUser()
          )
          .then(function (response) {
            $log.debug(response);
            $log.debug('from loadUserPicure()'+response.data.id);
            getUserPicture(response.data.id);
          });
      }

    }


    function getUserPicture(userId) {
      $log.debug('in getUserPicture() with userid= ' + userId);
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
      EventService.searchEvents(vm.queryString).then(function (response) {


        $log.info(response.data);
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
          broj /= 7;
          broj = Math.ceil(broj);
          vm.pageNr = new Array(broj);

          for (var i = 0; i < broj; i++) {
            vm.pageNr[i] = i;
          }

        });
      });
    }
    function makeItDeleteing(event) {
      $log.info("makeItDeleteing(event)");
      $log.info(event);
      vm.deleteingEvent = event;
    }

    function eventsOverview() {
      vm.myEventsClicked = false;
      loadUpcomingEvents();
    }
    function deleteEvent() {
      EventService.deleteEvent(vm.deleteingEvent.id).then(function () {
        $log.info(vm.upcomingEvents);
        var index = vm.upcomingEvents.indexOf(vm.deleteingEvent);
        vm.upcomingEvents.splice(index,1);
        $log.info(vm.upcomingEvents);
      });
    }
    function loadUpcomingEvents() {
      if(vm.selectedCategory!='All'){
      vm.selectedCategory = 'All';
      vm.selectedPage = 0;
      }
      vm.queryString="";
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
          broj /= 7;
          broj = Math.ceil(broj);
          vm.pageNr = new Array(broj);

          for (var i = 0; i < broj; i++) {
            vm.pageNr[i] = i;
          }

        });

      })
    }


    function loadAlreadySentRequests() {
      $log.info("vlaga");
      if ((LoginService.isLoggedIn())) {
        EventService.findSentParticipatingRequests(LoginService.getLoggedInUser()).then(function (response) {
          $log.info(response.data);
          response.data.forEach(function (req) {
            vm.alreadySentRequests.push(req.event.id);
          })
        });

      }
    }


    function loadParticipatingEvents() {
      if(LoginService.isLoggedIn()){
        EventService.findSentParticipatingRequests(LoginService.getLoggedInUser()).then(function (response) {
          //implementiraj
        })
      }
    }

    function joinEvent(eventId) {
      if (LoginService.isLoggedIn()) {
        EventService.joinEvent(eventId).then(function () {
          vm.alreadySentRequests.push(eventId);
        });
      }
      else {
        $state.go("login");
      }
    }


    function loadMyEvents() {
        vm.myEventsClicked = true;
      if(vm.selectedCategory!="MyEvents"){
        vm.selectedCategory = "MyEvents";
        vm.selectedPage = 0;
      }
        if(LoginService.isLoggedIn()){
          EventService.loadMyEvents(vm.selectedPage).then(function (response) {
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
            EventService.getMyEventsCount().then(function (response) {
              broj = response.data;
              broj /= 7;
              broj = Math.ceil(broj);
              vm.pageNr = new Array(broj);

              for (var i = 0; i < broj; i++) {
                vm.pageNr[i] = i;
              }

            });
          });
        }
    }




    function cancelRequest(eventId) {
        EventService.cancelRequest(eventId).then(function () {
          $log.info(vm.alreadySentRequests);
          var index = vm.alreadySentRequests.indexOf(eventId);
          vm.alreadySentRequests.splice(index,1);
          $log.info(vm.alreadySentRequests);
        })
    }

    function isRequestSent(eventId) {
      return vm.alreadySentRequests.includes(eventId);
    }

    function createAnEvent() {
      $log.info("createAnEvent()");
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
      EventService.createAnEvent(vm.event,vm.sendInvitesToFollowers).then(function () {
        $log.info("Sucess!");
        vm.event = [];
        vm.sendInvitesToFollowers = false;
        if (vm.selectedCategory === 'All')
          loadUpcomingEvents();
        else
          findEventsBySport(vm.selectedCategory);
      });

    }

    function getMonth(monthStr) {
      return new Date(monthStr + '-1-01').getMonth() + 1
    }

    function getEventDetails(event) {
      vm.eventDetails = event;
    }
    function findEventsBySport(sport) {

      vm.queryString="";

      if(vm.selectedCategory!=sport){
        vm.selectedCategory = sport;
        vm.selectedPage = 0;
      }
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
          broj /= 7;
          broj = Math.ceil(broj);
          vm.pageNr = new Array(broj);
          for (var i = 0; i < broj; i++) {
            vm.pageNr[i] = i;
          }
        });


      });
    }

    function getNthPage(n) {
      vm.selectedPage = n;
      if(vm.myEventsClicked)
        loadMyEvents();
      else if (vm.selectedCategory === 'All')
        loadUpcomingEvents();
      else
        findEventsBySport(vm.selectedCategory);

    }
    function isMyEvent(event) {
      return (LoginService.getLoggedInUser()===event.admin.userName);
    }
    function isSinglePage() {
      return vm.pageNr.length() == 1;
    }
  }

})(angular);
