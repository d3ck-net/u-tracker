tracku.directive('intakeHistory', function () {
    return {
        restrict: 'E',
        templateUrl: 'client/view/intake-history.html',
        controllerAs: 'intakeHistory',
        controller: function ($scope, $reactive, $interval) {
            $reactive(this).attach($scope);


            this.subscribe('Foods');
            this.subscribe('DataPoints');
            this.subscribe('userData');

            this.helpers({
                historyChart: function () {
                    if(Meteor.user()) {
                        var res = Meteor.user().getHistoryChart();
                        return res;
                    }
                }
            });

            this.historyChartOptions = {
                showPoint: false,
                // low: -100,
                // high: 100,
                showArea: true,
                showLine: true,
                lineSmooth: false
            };
        }
    };
});