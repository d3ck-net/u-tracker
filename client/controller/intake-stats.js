tracku.directive('intakeStats', function () {
    return {
        restrict: 'E',
        templateUrl: 'client/view/intake-stats.html',
        controllerAs: 'intakeStats',
        scope:{
          'days':'=?',
            'mode':'=?'
        },
        controller: function ($scope, $reactive, $interval) {
            $reactive(this).attach($scope);

            this.mode = $scope.mode;
            this.subscribe('Foods');
            this.subscribe('DataPoints');
            this.subscribe('userData');

            this.helpers({
                statChart: function () {
                    if(Meteor.user()) {
                        var days = $scope.getReactively('days');
                        return Meteor.user().getStatChart(days);
                    }
                },
                gramChart:function(){
                    if(Meteor.user()) {
                        return Meteor.user().getGramChart()
                    }
                }
            });
            
            
            this.statChartOptions = {
                // low: -100,
                // high: 0,
                seriesBarDistance: 30,
            };

            this.gramChartOptions = {
                // stackBars: true,
                // low: -100,
                // high: 0,
                seriesBarDistance: 30,
            };

        }
    };
});