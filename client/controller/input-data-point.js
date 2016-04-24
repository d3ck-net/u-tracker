tracku.directive('inputDataPoint', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'client/view/input-data-point.html',
        controllerAs: 'inputDataPoint',
        scope: {
            onSave: '=?',
            save: '=?'
        },
        link: function ($scope, $elem, $attr) {
            $document.bind('keypress', function (e) {
                console.log('Got keypress:', e.which);

                if (e.which === 43) {
                    e.preventDefault();
                    $scope.focus();
                }
            });
        },

        controller: function ($scope, $reactive, $element) {
            $reactive(this).attach($scope);

            if ($scope.save === undefined) {
                $scope.save = true
            }
            ;
            $scope.focus = function () {
                $('.inputMask .tag').focus();
            }
            this.enter = function () {
                if (this.mnt && this.tag) {
                    this.add();
                }
                else if (this.tag) {
                    $('.inputMask .mnt').focus();
                }
                else if (this.mnt) {
                    $('.inputMask .tag').focus();
                }
            }

            this.add = function () {
                try {
                    var data = {
                        tag: this.tag,
                        mnt: this.mnt,
                        comment: this.comment
                    };


                    var dataPoint = DataPoint.create(data, $scope.save);


                    this.tag = "";
                    this.mnt = "";
                    this.comment = "";
                    if ($scope.onSave) {
                        $scope.onSave(dataPoint);
                    }

                    $scope.focus();
                }
                catch (e) {
                    debugger;
                }
            }
        }
    };
});