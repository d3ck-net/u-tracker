//shim for mf
if(typeof global === 'undefined')
{
    global = window;
}

Meteor.startup(function(){
    MongoObject.subscribeColletions();
    MongoObject.groundCollections();
    Meteor.subscribe("userData")
    Meteor.users._transform = function(doc)
    {
        return new User(doc);
    }
})
//Meteor.subscribe("DataPoints");

app = tracku = angular.module('tracku', [
    'angular-meteor',
    'angular-meteor.auth',
    'ui.router',
    'accounts.ui',
    'ui-rangeSlider',
    'googlechart',
    'ui.bootstrap-slider',
    // 'chart.js',
    'angular-chartist'
]);

app.run(function($rootScope){
    // $rootScope.autorun(function () {                                                                                   // 1453
    //     if (!Meteor.user) return;                                                                                        // 1454
    //     $rootScope.currentUser = new User(Meteor.user());                                                                          // 1455
    //     $rootScope.loggingIn = Meteor.loggingIn();                                                                       // 1456
    // });
});