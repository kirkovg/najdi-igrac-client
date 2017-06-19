/**
 * Created by Win 8 on 18.06.2017.
 */


(function (angular) {
  angular
    .module('najdi-igrac-client')
    .directive('fileModel', function ($parse) {
      return {
        restrict: 'A',
          link: function (scope,element,attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
              scope.$apply(function () {
                modelSetter(scope,element[0].files[0]);
              });
            });
          }
      };
    });

})(angular);
