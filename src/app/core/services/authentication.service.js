(function () {
    'use strict';

    angular
            .module('app.core')
            .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', '$timeout','permissions'];
    function AuthenticationService($http, $cookies, $rootScope, $timeout,permissions) {
        var service = {};

        //    service.Login = Login;
        service.setLoggedUser = setLoggedUser;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;

        return service;

        function setLoggedUser() {
           return $rootScope.globals;
        }
        function SetCredentials(email, password, token, loggedUser) {
            var user = {
               id: loggedUser.id,
               name : loggedUser.name,
               photo : loggedUser.photo,
               roles : loggedUser.roles
            };
            $rootScope.globals = {
                currentUser: {
                    token: token,
                    loggedUser: user
                }
            };
            //console.log(" $rootScope.globals ",  $rootScope.globals);

            $http.defaults.headers.common.token = token;
            // set default auth header for http requests
            // $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
            // console.log("$http.defaults.headers.common ", $http.defaults.headers.common);
            // store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
            var cookieExp = new Date();
            cookieExp.setDate(cookieExp.getDate() + 7);
            $cookies.putObject('globals', $rootScope.globals, {expires: cookieExp});
            permissions.setPermissions(loggedUser.roles,loggedUser.businesses);
            setLoggedUser();
        }

        function ClearCredentials() {
            // console.log("AuthenticationService ClearCredentials");
            $rootScope.globals = {};
            $cookies.remove('globals');
            $http.defaults.headers.common.token = '';
        }
    }

})();