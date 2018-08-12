(function()
{
    'use strict';

    angular
            .module('app.login')
            .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController($rootScope, $state, AuthenticationService, $scope, msApi, $timeout)
    { 
        console.log('LoginController');
        // Data
        var vm = this;
        vm.login = login;
        vm.forgotPassword = forgotPassword;
        vm.register = register;
        vm.error = false;
        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        function login() {
           // console.log(vm.email, vm.password);
           // console.log("LoginController login");
            //      $timeout(function() {
            msApi.request('login@save', {email: vm.email,
                password: vm.password},
            // SUCCESS
            function(response)
            {
                console.log(response.data);               
                AuthenticationService.SetCredentials(vm.email, vm.password, response.data.token ,response.data);
                $state.go("app.dashboards");
            },
                    // ERROR
                            function(response)
                            {
                                console.error(response.data);
                                var msg = response.data.error.message;
                                $scope.errorMessageToast(msg);
                            }
                    );
                    //    }, 1000);

//            AuthenticationService.Login(vm.email, vm.password, function(response) {
//                if (response.success) {
//                    console.log("LoginController response.success");
//                    AuthenticationService.SetCredentials(vm.email, vm.password);
//                    $state.go("app.dashboards");
//                    //$location.path('/');
//                } else {
//                    vm.error = true;
//                    console.log("LoginController response.Error");
//                   // FlashService.Error(response.message);
//                    //vm.dataLoading = false;
//                }
//            });
                }
        ;

        function forgotPassword() {
            //console.log("forgotPassword");
            $rootScope.forgotPassword = true;
            $state.go("app.pages_auth_forgot-password");
        }
        ;
        function register() {
            $rootScope.register = true;
            $state.go("app.pages_auth_register");
        }
        ;
    }
})();