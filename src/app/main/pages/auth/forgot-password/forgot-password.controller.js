(function()
{
    'use strict';

    angular
            .module('app.forgot-password')
            .controller('ForgotPasswordController', ForgotPasswordController);

    /** @ngInject */
    function ForgotPasswordController(msApi, $scope, $http, $state)
    {
        var vm = this;
        vm.submit = submit;

        function submit() {
//            $http.post('https://twigbig.com/api/public/index.php/api/v1/auth/forget_password', {email: vm.email})
//                    .then(function(response)
//                    {
//                        console.log(response);
//                    },
//                            function(response)
//                            {
//                                console.error(response);
//                            });

            msApi.request('forgotpassword@save', {email: vm.email},
            // SUCCESS
            function(response){
                console.log(response);
                $scope.errorMessageToast(response.message);
                //$http.defaults.headers.common.token = 
                $state.go("app.pages_auth_reset-password");
            },
                    // ERROR
                            function(response)
                            {
                                var msg = response.error.message;
                                $scope.errorMessageToast(msg);
                                console.error(response);
                            }
                    );
                }
    }
})();