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
      uploadUserPicture: uploadUserPictureFn,
      checkIfPictureExists: checkIfPictureExistsFn
    };

    return service;

    function getUserDetailsFn(username) {
      return $http
        .get('/api/users/findByUserName?userName=' + username);
    }

    function updateUserDetailsFn(data) {
      return $http.put('/api/users/' + data.id, data);
    }

    function uploadUserPictureFn(formData, userId) {
      return $http.put('/api/users/' + userId + '/uploadPicture', formData, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      }).then(function (response) {
        $log.debug('succes uploading picture from editservice');
      }, function (response) {
        $log.debug("error uploading picture");
        return Promise.reject();
      });
    }

    function checkIfPictureExistsFn(userId) {
      return $http
        .get('/api/users/' + userId + '/checkIfPictureExists')
        .then(function (response) {
          $log.debug("picture exists for user")
        }, function (response) {
          $log.debug("picture doesn't exist");
          return Promise.reject();
        });
    }


  }
})(angular);
