tracku.directive('intake', function () {
    return {
        restrict: 'E',
        templateUrl: 'client/view/intake.html',
        controllerAs: 'intake',
        controller: function ($scope, $reactive,$interval) {
            $reactive(this).attach($scope);

            $interval(function () {
                $scope.intakeDay = Food.getDaylyIntake();
                $scope.intake24 = Food.get24HourIntake();
                $scope.intakeLinear = Food.getInterpolatedIntake();

            },1000);
        }
    };
});