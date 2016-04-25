tracku.directive('dashboard', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'client/view/dashboard.html',
        controllerAs: 'dashboard',
        controller: function ($scope, $reactive) {
            $reactive(this).attach($scope);

            $scope.helpers({
                'stats': function () {
                    if (Meteor.user()) {
                        var intakes = Meteor.user().getPercentageIntake();

                        return {
                            type: 'Gauge',
                            data: [
                                ['Label', 'Value'],
                                ['protein\n100g', Tools.round(intakes.protein)],
                                ['fat', Tools.round(intakes.fat)],
                                ['carbohydrates', Tools.round(intakes.carbohydrates)],
                                ['calories', Tools.round(intakes.calories)]
                            ],
                            options: {
                                width: 400, height: 120,
                                min:0,
                                max:200,
                                // redFrom: 0, redTo: 200,
                                // yellowFrom: 75, yellowTo: 125,
                                greenFrom:85,greenTo:115,
                                minorTicks: 1
                            }
                        };

                    }
                }
            })

        },
        link: function () {

        }
    };
});