(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client')
    .factory('EditProfileService', EditProfileServiceFn);

  EditProfileServiceFn.$inject = ['$log', '$http'];

  function EditProfileServiceFn($log, $http) {
    var service = {
      getUserDetails: getUserDetailsFn,
      updateUserDetails: updateUserDetailsFn,
      getUserPicture: getUserPictureFn
    };

    return service;

    function getUserDetailsFn(username) {
      return $http.get('/api/users/findByUserName?userName=' + username);
    }

    function updateUserDetailsFn(data) {
      return $http.put('/api/users/'+data.id,data);
    }

    function getUserPictureFn(userId) {

    }
  }
})(angular);
