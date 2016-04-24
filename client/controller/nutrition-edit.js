tracku.directive('nutritionEdit', function () {
    return {
        restrict: 'E',
        templateUrl: 'client/view/nutrition-edit.html',
        controllerAs: 'nutritionEdit',
        scope: {
            object: '=',
            ngChange: '&'

        },
        controller: function ($scope, $reactive) {
            $reactive(this).attach($scope);

            debugger;
            this.object = $scope.object;


        }
    };
});