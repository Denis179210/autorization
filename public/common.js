var tokenApp = angular.module('tokenApp', ['ui.router']);

    tokenApp.run(function($rootScope, $window, $http, $transitions, $state, $stateParams, Session) {
        
        $rootScope.onExit = function() {
            
            if($window.localStorage.remember_me) {
                return
            } else {
                delete $window.localStorage.access;
                delete $window.localStorage.remember_me;

                $http.get('/token')
                    .then((res) => {
                        return
                    })
            }
        }
        $window.onbeforeunload = $rootScope.onExit;

        $http({
            method: 'GET',
            url: '/api/get-browser-refresh-url',
        }).then((res) => {

            let clientReload = document.createElement('script');
                clientReload.setAttribute('src', `${res.data}`);
            document.body.insertBefore(clientReload, document.querySelector('.entry-point'));
        });

        $transitions.onBefore({}, function(transition) {
            console.log(transition.from().name);
           
            if(transition.to().isAutorized && Session.isAnonymus()) {
                console.log(Session.isAnonymus());
                console.log('hello')
                transition.abort();
                $state.go('autorization.sign_in');
            } else {
                return
            }
        });
    });
