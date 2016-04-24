tracku.directive('dashboard', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'client/view/dashboard.html',
        controllerAs: 'dashboard',
        controller: function ($scope, $reactive) {
            $reactive(this).attach($scope);

            

        },
        link:function(){
            
        }
    };
});