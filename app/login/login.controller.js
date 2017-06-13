(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$log', '$state', 'LoginService', '$cookies'];

  /* @ngInject */
  function LoginController($log, $state, LoginService) {
    var vm = this;
    vm.title = "Please Login";
    vm.credentials = {};
    vm.login = login;
    vm.logout = logout;
    vm.isLoggedIn = isLoggedIn;

    function login() {
       LoginService.login(vm.credentials).then(function () {
         $log.debug("in login controller after logging in ");
         $state.go("defaultPage");
       });
    }

    function logout() {
      LoginService.logout().then(function () {
        $state.go("defaultPage");
      });
    }

    function isLoggedIn() {
      return LoginService.isLoggedIn();
    }


  }
})(angular);

