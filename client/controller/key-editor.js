tracku.directive('keyEditor', function () {
    return {
        restrict: 'E',
        replace:true,
        templateUrl: 'client/view/key-editor.html',
        controllerAs: 'keyEditor',
        scope: {
            object:'=',
            key:'=',
            value: '=',
            change:'&'

        },
        controller: function ($scope, $reactive) {
            $reactive(this).attach($scope);

            // debugger;
            this.getTypeOf = function (data,key) {
                if(data === null)
                {
                    return "null";
                }
                
                var type = typeof data;
                // debugger;
                return type;
            }

        }
    };
});