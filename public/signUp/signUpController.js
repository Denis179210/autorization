tokenApp.controller('signUpController', function($window, $state, $scope, $http, $location) {
    console.log('signUp State');

    $scope.newUser = {};
    $scope.sendData = function(e) {
        e.preventDefault();
        $http.post('/sign_up', $scope.newUser)
            .then((res) => {
                console.log(res.data);
                console.log(res.config);
                $window.localStorage.access = res.data.token;
                $window.localStorage.remember_me = res.data.remember_me;

                angular.element('.notice').show();
                $state.go('main');
            })
            .catch((err) => {
                document.body.innerHTML = `<h1 class="text-danger" style="font-size: 100px">${err.status} ${err.statusText} !</h1>`;
                console.error(err);
            })
    }
})  