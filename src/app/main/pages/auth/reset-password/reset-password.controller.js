(function ()
{
    'use strict';

    angular
        .module('app.reset-password')
        .controller('ResetPasswordController', ResetPasswordController);

    /** @ngInject */
    function ResetPasswordController($scope, msApi, $http, $state)
    {
        var vm = this;
       vm.submit = submit;
       
       function submit(){
          // $http.defaults.headers.common.token='';
          // console.log("$http.defaults.headers.common ", $http.defaults.headers.common);
           msApi.request('resetpassword@save', {
               token: vm.token,
               password:vm.password,
               password_confirmation:vm.passwordConfirm
           },
                // SUCCESS
                function(response)
                {
                    //console.log(response); 
                    //$scope.errorMessageToast(response.message);
                    $state.go("app.pages_auth_login");
                },
                        // ERROR
                                function(response)
                                {
                                    var msg = response.error.message;                                  
                                    //$scope.errorMessageToast(msg);
                                    console.error(response);                                    
                                }
                        );
       }
    }
})();