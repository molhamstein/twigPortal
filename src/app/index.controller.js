(function ()
{
    'use strict';

    angular
        .module('fuse')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(fuseTheming, $state,$rootScope,$cookies,$http,$location)
    {
        //$state.go("app.pages_auth_login");
        console.log("IndexController $rootScope.globals.currentUser", $rootScope.globals);
        var vm = this;
       // console.log("$http.defaults.headers ", $http.defaults.headers.common);
//        $state.go("app.dashboards");
//        // keep user logged in after page refresh
//        $rootScope.globals = $cookies.getObject('globals') || {};
//        console.log("$rootScope.globals ", $rootScope.globals);
//        if ($rootScope.globals.currentUser) {
//            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
//        }

//        $rootScope.$on('$locationChangeStart', function(event, next, current) {
//            // redirect to login page if not logged in and trying to access a restricted page
//            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
//            var loggedIn = $rootScope.globals.currentUser;
//             console.log("loggedIn ",loggedIn);
//             console.log("restrictedPage ",restrictedPage);           
//            if (restrictedPage && !loggedIn) {
//                console.log("!!loggedIn");              
//                //$state.go("app.pages_auth_login");                               
//            } else {
//                $state.go("app.dashboards");
//               
//                console.log("loggedIn");
//
//            }
//        });
//        
        
        vm.themes = fuseTheming.themes;
    }
})();