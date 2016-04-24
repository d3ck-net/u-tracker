tracku.directive('mongoObjectList', function () {
    return {
        restrict: 'E',
        templateUrl: 'client/view/mongo-object-list.html',
        controllerAs: 'mongoObjectList',
        scope: {
            mongotype: '@',
            order: '=',
            field: '@'
        },
        controller: function ($scope, $reactive) {
            $reactive(this).attach($scope);

            var collectionName = $scope.mongotype + "s";
            var collection = global[collectionName];

            this.order = $scope.order;
            this.sort = '';

            this.helpers({

                entities: function () {
                    var options = {limit:10};

                    var sort = $scope.getReactively('sort');

                    if (sort) {
                        options.sort = {};
                        options.sort['values.' + sort] = -1;
                    }

                    var projection = {};
                    if($scope.field)
                    {
                        options.fields = {};
                        options.fields[$scope.field] = 1;
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
            ;

            this.getTypeOf = function (data) {
                return typeof data;
            }
            this.delete = function (entity) {
                entity.delete();
            }

            this.save = function (entity) {
                entity.save();
            }
        }
    };
});