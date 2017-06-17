(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client')
    .controller('RegisterController', RegisterControllerFn);

  RegisterControllerFn.$inject = ['$log', '$state', 'LoginService', 'RegisterService'];

  /* @ngInject */
  function RegisterControllerFn($log, $state, LoginService, RegisterService) {
    var vm = this;
    vm.title = "Register here";
    vm.successMsg = "";
    vm.errorMsg = "";
    vm.credentials = {};
    vm.registered = false;
    vm.registerUser = registerUser;


    function registerUser() {
      RegisterService
        .register(vm.credentials)
        .then(function (success) {
          $log.debug("in register controller after registering");
          vm.successMsg = "Succesfully registered. Please login to continue";
          vm.errorMsg = "";
          vm.credentials = {};
          vm.registered = true;
        }, function (error) {
          $log.debug(error);
          $log.debug("in register controller after failing to register");
          vm.successMsg = "";
          vm.errorMsg = "Error registering";
          vm.registered = false;
        });
    }
  }
})(angular);

