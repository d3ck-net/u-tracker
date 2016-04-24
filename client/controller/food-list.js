tracku.directive('foodList', function () {
    return {
        restrict: 'E',
        templateUrl: 'client/view/food-list.html',
        controllerAs: 'foodList',
        scope: {
        },
        controller: function ($scope, $reactive) {
            $reactive(this).attach($scope);

            var collection = Foods;

            this.order = ['protein','fat','carbohydrates'];
            this.sort = '';

            this.helpers({

                entities: function () {
                    var options = {};

                    var sort = $scope.getReactively('sort');

                    if (sort) {
                        options.sort = {};
                        options.sort['values.' + sort] = -1;
                    }


                    var find = {};
                    var filter = $scope.getReactively('filter');
                    if(filter)
                    {
                        find.name = {$regex:filter};
                    }

                    return collection.find(find, options);
                }
            })

        }
    };
});