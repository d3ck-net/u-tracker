tracku.config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
        .state('dashboard', {
            url: '/dashboard',
            template: '<dashboard></dashboard>'
        })
        .state('profile', {
            url: '/profile',
            template: '<user-profile></user-profile>'
        })
        .state('foods', {
            url: '/foods',
            template:'<food-list></food-list>'
            // '<mongo-object-insert mongotype="Food"></mongo-object-insert>'
            //     +
            //  '<mongo-object-list mongotype="Food" field="tag" order="[\'\',\'protein\',\'fat\',\'carbohydrates\']"></mongo-object-list>'
        })
        .state('foodEdit', {
            url: '/foods/:tag',
            template:'<object-editor type="Food" ></object-editor>'
        });;

    $urlRouterProvider.otherwise("/dashboard");
});
