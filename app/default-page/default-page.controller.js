(function (angular) {
  'use strict';

  angular
    .module('najdi-igrac-client')
    .controller('SearchController', SearchController);

  SearchController.$inject = ['$log', 'SearchService'];

  /* @ngInject */
  function SearchController($log, SearchService) {
    var vm = this;
    vm.queryString = "";
    vm.entities = [];
    vm.searchEvents = searchEvents;

    function searchEvents() {
      SearchService.searchEvents(vm.queryString).then(function (data) {
        vm.entities = data;
      });
    }

  }

})(angular);
