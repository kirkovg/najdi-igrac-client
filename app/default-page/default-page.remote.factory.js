/**
 * Created by Win 8 on 12.05.2017.
 */
(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client')
    .factory('SearchService', SearchServiceFn);

  SearchServiceFn.$inject = ['$log', '$resource', '$http'];

  /* @ngInject */
  function SearchServiceFn($log, $resource, $http) {

    var service = {
      searchEvents: searchEventsFn
    };

    return service;

    function searchEventsFn(queryString) {
      $log.debug(queryString);
      return $resource("/api/search?query=" + queryString).query().$promise;
    }
  }

})(angular);

