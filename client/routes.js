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
        .state('history', {
            url: '/history',
            template:'<history></history>'
        })
        .state('foods', {
            url: '/foods',
            template:'<food-list></food-list>'
        })
        .state('foodAdd', {
            url: '/foods/add',
            template:'<mongo-object-insert mongotype="Food"></mongo-object-insert>'
        })
        .state('foodEdit', {
            url: '/foods/:tag',
            template:'<object-editor type="Food" ></object-editor>'
        });;

    $urlRouterProvider.otherwise("/dashboard");
});
