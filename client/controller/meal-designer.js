tracku.directive('mealDesigner', function () {
    return {
        restrict: 'E',
        templateUrl: 'client/view/meal-designer.html',
        controllerAs: 'mealDesigner',
        scope: {
        },
        controller: function ($scope, $reactive) {
            $reactive(this).attach($scope);

            var self = this;
            this.add = function (dataPoint) {
                debugger;

                self.meal.addIngridient(dataPoint);
                self.values = self.meal.getNutrinialValues();

            }

            this.eat = function()
            {
                self.reset();
            }

            this.reset = function()
            {
                self.meal = new Meal();
            }

            this.reset();
        }
    };
});