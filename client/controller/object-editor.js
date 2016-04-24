tracku.directive('objectEditor', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'client/view/object-editor.html',
        controllerAs: 'objectEditor',
        scope: {
            object: '=',
            change: '&',
            type: '@',
            search: '='

        },
        controller: function ($scope, $reactive,$stateParams) {
            $reactive(this).attach($scope);
            this.helpers({
                entity: function () {
                    if ($scope.type) {
                        var collection = global[$scope.type + 's'];

                        if($stateParams)
                        {

                        }
                        var search = $scope.search ? $scope.search : ($stateParams ? $stateParams : {});
                        return collection.findOne(search);
                    }
                    else 
                    {
                        return $scope.object;
                    }
                }
            });

            // debugger;
            this.getTypeOf = function (data) {
                return typeof data;
            }

        }
    };
});