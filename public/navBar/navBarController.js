tokenApp.controller('navBarController', function($window, $state, $http, $scope) {

    $scope.access = function() {
        return $window.localStorage.access;  
    }
    
    
    $scope.exit = function(e) {
        // e.preventDefault();
        console.log(e);
        console.log('It works!');
        delete $window.localStorage.access;
        delete $window.localStorage.remember_me;

        if ($state.current.isAutorized) {
                    $state.go('autorization.sign_in')
        } else {
            return
        }
        
    }    
})