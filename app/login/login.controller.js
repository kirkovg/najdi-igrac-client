(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$log', '$http', '$rootScope', '$location'];

  /* @ngInject */
  function LoginController($log, $http, $rootScope, $location) {
    var vm = this;
    vm.login = loginFn;
    vm.logout = logoutFn;
    vm.title = 'Please login';
    vm.credentials = {};


    /*
    * Ova e za na pocetok na load ko ke se povikat da ne pobarat user tuku random stringce
    * poso inace frlat exception za undefined credentials
    *
    * */
    var query = Math.random().toString(36).substring(9); // random string


    var authenticate = function(credentials, callback) {
      if (credentials != undefined) {
        $log.debug("username na pocetok vo authenticate --> " + credentials.username);
        $log.debug("password na pocetok vo authenticate --> " +credentials.password);
        query = credentials.username;
      }

      var headers = credentials ? {
        authorization: "Basic "
        + btoa(credentials.username + ":"
          + credentials.password)
      } : {};

      $log.debug("headers --> " + headers.authorization);

      $http.get('/api/users/findByUserName?userName='+query, {
        headers: headers
      }).then(function (response) {
        $log.debug("inside autheticate after get to users");
        if (response.data.username) {
          $log.debug(response.data.username + "========" + "vleze vo response.data.username");
          $rootScope.authenticated = true;
        } else {
          $log.debug("ne uspea da go zemit --> authenticated = false");
          $rootScope.authenticated = false;
        }
        callback && callback($rootScope.authenticated);
      }, function () {
        $rootScope.authenticated = false;
        callback && callback(false);
      });

    };

    authenticate();

    function loginFn() {
      $log.debug("inside login");
      authenticate(vm.credentials, function (authenticated) {
        $log.debug("posle callback od authenticate()");
        $log.debug("credentials --> "+vm.credentials.username + " === " + vm.credentials.password);

        if (authenticated) {
          console.log("Login succeeded");
          $location.path("/");
          vm.error = false;
          $rootScope.authenticated = true;
        } else {
          console.log("Login failed");
          $location.path("/login");
          vm.error = true;
          $rootScope.authenticated = false;
        }
      });
    }



    function logoutFn() {
      $http.post('logout', {}).finally(function () {
        $rootScope.authenticated = false;
        $location.path("/");
      });
    }
  }
})(angular);

