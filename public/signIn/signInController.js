tokenApp.controller('signInController', function($window, $scope, $rootScope, $http, $location, $state) {
    $scope.reqBody = {};
    
    $scope.getAccess = function(e) { 
        e.preventDefault();
        // console.dir($http);
        $http.post('/sign_in', $scope.reqBody)
            .then((res) => {
                console.log(res.data);
                // let token = res.data
                console.log(res.config);
                $window.localStorage.access = res.data.token;
                $window.localStorage.remember_me = res.data.remember_me;

                angular.element('.notice').show();
                $state.go('main', {reload: true});
            })
            .catch((err) => {
                document.body.innerHTML = `<h1 class="text-danger" style="font-size: 100px">${err.status} ${err.statusText} !</h1>`;
                console.error(err);
            })
        
    }
})