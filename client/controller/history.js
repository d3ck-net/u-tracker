tracku.directive('history', function () {
    return {
        restrict: 'E',
        templateUrl: 'client/view/history.html',
        controllerAs: 'history',
        controller: function ($scope, $reactive, $interval) {
            $reactive(this).attach($scope);
            // $scope.helpers({
            //    days:function(){
            //       
            //    }
            // });

            $scope.days = 7;
            $scope.date = new Date(Date.now());
        }
    };
});