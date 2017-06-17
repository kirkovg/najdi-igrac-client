(function (angular) {
  //'use strict';

  angular
    .module('najdi-igrac-client')
    .factory('LoginService', LoginServiceFn);

  LoginServiceFn.$inject = ['$log', '$http'];

  function LoginServiceFn($log, $http) {
    var service = {
      login: loginFn,
      logout: logoutFn,
      isLoggedIn: isLoggedInFn,
      getLoggedInUser: getLoggedInUserFn
    };

    return service;


    function loginFn(data) {
      return $http.post(
        "http://localhost:8080/login", "username=" + data.username + "&password=" + data.password,
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }
      ).then(function (response) {
        $log.debug("login succesful");
        sessionStorage.setItem('session',data.username);
      }, function (response) {
          $log.debug("error logging in");
          return Promise.reject();
      });
    }

    function logoutFn() {
      return $http.post("http://localhost:8080/logout").then(function () {
          $log.debug("logout succesful");
        sessionStorage.removeItem('session');
      });
    }

    function isLoggedInFn() {
      return sessionStorage.getItem('session') !== null;
    }

    function getLoggedInUserFn() {
      if (isLoggedInFn()) {
        return sessionStorage.getItem('session');
      }
    }
  }

})(angular);
