angular.module('mainCtrl', [])

.controller('mainController', function ($rootScope, $location, Auth) {

    var vm = this;

    //get info if a person is logged in
    vm.loggedIn = Auth.isLoggedIn();

    //    console.log(vm);

    //check to see if a user is logged in on every request
    $rootScope.$on('$routeChangeStart', function () {
        vm.loggedIn = Auth.isLoggedIn();

        //get user information on route change
        Auth.getUser().success(function (data) {
            vm.user = data;
        });
    });

    //handle login form
    vm.doLogin = function () {
        //call the auth login form
        vm.processing = true;
        vm.error = '';
        Auth.login(vm.loginData.userName, vm.loginData.password).success(function (data) {
            vm.processing = false;
            //            console.log(data);

            //on success, forward to users page
            if (data.success) {
                $location.path('/users');

            } else {
                vm.error = data.message;
            }
        })
    };

    vm.doLogout = function () {
        Auth.logout();
        //reset all user info
        vm.user = {};
        $location.path('/login');
    }
})
