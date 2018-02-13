tokenApp.factory('Session', function($window) {
    var Session = {
        getToken: function () {
            return  $window.localStorage.access
        } ,
        isAnonymus: function() {
            return this.getToken() === undefined 
        }
    }
    return Session;
})

tokenApp.factory('SessionService', function(Session) {
    var SessionService = {
        request: function(config) {
            if(!Session.isAnonymus()) {
                config.headers['Authorization'] = Session.getToken();
            }
            return config;
        }
    }
    return SessionService;
})


tokenApp.config(function($stateProvider, $locationProvider, $httpProvider) {
    $stateProvider
        .state({
            name: 'main',
            url: '/',
            templateUrl: 'main/main.html',
            controller: 'mainController'
        })
        .state({
            name: 'autorization',
            url: '/autorization',
            templateUrl: 'autorization/autorization.html',
            controller: 'autorizationController'
        })
        .state({
            name: 'autorization.sign_in',
            url: '/sign_in',
            component: 'signInComponent'
        })
        .state({
            name: 'autorization.sign_up',
            url: '/sign_up',
            component: 'signUpComponent'
        })
        .state({
            name: 'test',
            url: '/test',
            component: 'testComponent',
            isAutorized: true
        });

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('Session');
    $httpProvider.interceptors.push('SessionService');

})

