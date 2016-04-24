tracku.directive('userProfile', function () {
    return {
        restrict: 'E',
        templateUrl: 'client/view/user-profile.html',
        controllerAs: 'userProfile',
        controller: function ($scope, $reactive, $interval) {
            $reactive(this).attach($scope);
            
            this.subscribe('userData');

            this.ratiosView = 'mass';
            
            this.helpers({
                ratiosChart: function () {
                    
                    if(Meteor.user()) {
                        
                        var view =  this.getReactively('ratiosView');
                        return Meteor.user().getRationsChart(view);
                    }

                },
                profile:function()
                {
                    if(Meteor.user())
                    {
                        return Meteor.user().profile;
                    }
                }
            });

            this.changePassword = function()
            {
                Accounts.changePassword(this.passwordOld,this.passwordNew);
            }

            this.logout = function()
            {
                Meteor.logout();
            }


            var updateTimer = null;
            this.endRangeDrag = function()
            {
                $scope.currentUser.save();
                clearInterval(updateTimer)
            }
            this.startRangeDrag = function()
            {
                updateTimer = setInterval(function(){
                    var originalUser = Meteor.user();
                    if(originalUser.profile.distribution.protein != $scope.currentUser.profile.protein ||
                        originalUser.profile.distribution.fat !=  $scope.currentUser.profile.fat) {
                        $scope.currentUser.save();
                    }
                },200)
            }
            this.pieChartOptions = {
                // labelPosition:'outside'
            }

        }
    };
});