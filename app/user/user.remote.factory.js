(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client')
    .factory('UserService', UserServiceFn);

  UserServiceFn.$inject = ['$log', '$http'];

  function UserServiceFn($log, $http) {
    var service = {
      pullUsers: pullUsers
    };

    return service;

    function pullUsers() {
      return $http.get('/api/users');
    }
  }
})(angular);
