(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client')
    .controller('UserController', UserController);

  UserController.$inject = ['$log', '$state', 'UserService', 'LoginService'];

  function UserController($log, $state, UserService, LoginService) {
    var vm = this;
    vm.entities = [];

    getUsers();

    function getUsers() {
      if (LoginService.isLoggedIn()) {
        UserService.pullUsers().then(function (response) {
          //$log.debug(response.data);
          vm.entities = response.data;
        });
      }
    }
  }

})(angular);

