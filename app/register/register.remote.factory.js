(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client')
    .factory('RegisterService', RegisterServiceFn);

  RegisterServiceFn.$inject = ['$log', '$http'];

  function RegisterServiceFn($log, $http) {
    var service = {
      register: registerFn
    };

    return service;


    function registerFn(data) {
       return $http
         .post('/api/register', data).then(function (response) {
          $log.debug('success in registering');
        }, function (response) {
           $log.debug('error in registering');
           Promise.reject();
        });
    }
  }

})(angular);
