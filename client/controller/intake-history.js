tracku.directive('intakeHistory', function () {
    return {
        restrict: 'E',
        templateUrl: 'client/view/intake-history.html',
        controllerAs: 'intakeHistory',
        scope: {
            date: '=?',
            days: '=?'
        },
        controller: function ($scope, $reactive, $interval) {
            $reactive(this).attach($scope);


            this.subscribe('Foods');
            this.subscribe('DataPoints');
            this.subscribe('userData');

            this.helpers({
                historyChart: function () {
                    if (Meteor.user()) {
                        var days = $scope.getReactively('days');
                        var res = Meteor.user().getHistoryChart($scope.date,days);
                        return res;
                    }
                }
            });

            this.historyChartOptions = {
                showPoint: false,
                fullWidth: true,
                // low: -100,
                // high: 100,
                showArea: true,
                showLine: true,
                lineSmooth: true
            };
        }
    };
});