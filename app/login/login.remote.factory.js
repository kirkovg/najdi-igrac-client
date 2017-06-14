(function (angular) {
  //'use strict';

  angular
    .module('najdi-igrac-client')
    .factory('LoginService', LoginServiceFn);

  LoginServiceFn.$inject = ['$log', '$http', '$cookies'];

  function LoginServiceFn($log, $http, $cookies) {
    var service = {
      login: loginFn,
      logout: logoutFn,
      isLoggedIn: isLoggedInFn
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
        localStorage.setItem('session','localStorage -> loggedin + cookie = ' + $cookies.get('JSESSIONID'));
      }, function (response) {
        $log.debug("error logging in");
      });
    }

    function logoutFn() {
      return $http.post("http://localhost:8080/logout").then(function () {
          $log.debug("logout succesful");
          localStorage.removeItem('session');
      });
    }

    function isLoggedInFn() {
      return localStorage.getItem('session') !== null;
    }
  }

})(angular);
