tracku.directive('mongoObjectInsert', function () {
    return {
        restrict: 'E',
        templateUrl: 'client/view/mongo-object-insert.html',
        controllerAs: 'mongoObjectInsert',
        scope: {
            'mongotype':'@'
            // object: '='
        },
        controller: function ($scope, $reactive) {
            $reactive(this).attach($scope);
            // debugger;
            
            
            this.save = function(){
                this.object.save();
                this.reset();
            }
            
            
            this.reset = function()
            {
                this.object = new global[$scope.mongotype]();
                this.object.setFromData(this.object);
            }
            
            this.reset();
            // debugger;
        }
    };
});