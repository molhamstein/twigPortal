(function()
{
    'use strict';
    angular
            .module('app.register')
            .controller('RegisterController', RegisterController);
    /** @ngInject */
    function RegisterController($rootScope, $state, $location, msApi, $scope)
    {
        var vm = this;
        vm.form = {};
       // console.log("RegisterController");
        vm.register = register;
        //msApi.register('register', ['http://104.217.253.15/twigbig/public/api/v1/users',{user: vm.u},'$save']);
        
        
        function register() {
            msApi.request('register@save', {name: vm.form.username,
                email: vm.form.email,
                password: vm.form.password,
                mobile_number: "",
                photo: "",
                cover: ""},
            // SUCCESS
            function(response)
            {
                console.log(response.data);
                $state.go("app.pages_auth_login");
            },
                    // ERROR
                            function(response)
                            {
                                var msg = "";
                                if(response.data.error.details.email)
                                    msg += response.data.error.details.email[0]+" ";
                                if(response.data.error.details.name)
                                    msg += response.data.error.details.name[0]+" ";
                                if(response.data.error.details.password)
                                    msg += response.data.error.details.password[0]+" ";
                                $scope.errorMessageToast(msg);
                                console.error(response.data);
                               
                            }
                    );

                }
    }
})();