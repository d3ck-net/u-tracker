tracku.directive('listDataPoint', function () {
    return {
        restrict: 'E',
        templateUrl: 'client/view/list-data-point.html',
        controllerAs: 'listDataPoint',
        scope: {
            dataPoints: '=?',
            limit: '=?'
        },
        controller: function ($scope, $reactive) {
            $reactive(this).attach($scope);
            this.subscribe('Foods');
            this.subscribe('DataPoints');


            if ($scope.dataPoints) {
                this.dataPoints = $scope.dataPoints;
            }
            else {
                this.helpers({
                    dataPoints: function () {
                        var hour = 60 * 60 * 1000;
                        var day = hour * 3;
                        //var points = DataPoints.find();
                        var options = {};

                        options.limit = $scope.limit ? $scope.limit : undefined;
                        options.sort = {date: -1};

                        var search = {date: {$gt: new Date(Date.now()).getStartOfDay().getTime()}};

                        // search = {tag: {$in: Tag.getUnusedTags({Foods: 'name'})}};
                        // debugger;
                        return DataPoints.find(search, options);
                    },
                    totalMnt: function () {
                        var sum = 0;
                        var points = DataPoints.find({date: {$gt: new Date(Date.now()).getStartOfDay().getTime()}}, {sort: {date: -1}});
                        points.forEach(function (p) {
                            sum += p.mnt;
                        });

                        return sum;
                    }
                });

            }

            this.edit = true;

        }
    };
});