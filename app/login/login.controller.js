(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$log', '$state', 'LoginService'];

  /* @ngInject */
  function LoginController($log, $state, LoginService) {
    var vm = this;
    vm.title = "Please Login";
    vm.credentials = {};
    vm.errorMsg = "";
    vm.login = login;
    vm.logout = logout;
    vm.isLoggedIn = isLoggedIn;
    vm.getLoggedInUser = getLoggedInUser;

    function login() {
       LoginService.login(vm.credentials).then(function (success) {
         $log.debug("in login controller after logging in");
         $state.go("homePage");
         vm.errorMsg = "";
       }, function (error) {
         $log.debug("in login controller after failing to log");
         vm.errorMsg = "Failed to log in. Wrong credentials";
         vm.credentials = {};
       });
    }

    function logout() {
      LoginService.logout().then(function () {
        $state.go("homePage");
      });
    }

    function isLoggedIn() {
      return LoginService.isLoggedIn();
    }

    function getLoggedInUser() {
      return LoginService.getLoggedInUser();
    }
  }
})(angular);

