(function ()
{
    'use strict';

    angular
            .module('fuse')
            .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $timeout, $state, $cookies, $http, Language, $location, AuthenticationService)
    {
        // 3rd Party Dependencies
        // console.log("run");               
        // keep user logged in after page refresh
        
        $rootScope.globals = $cookies.getObject('globals') || {};
        if ($rootScope.globals.currentUser) {
            //console.log("if");
            $http.defaults.headers.common.token = $rootScope.globals.currentUser.token;
            $state.go("app.dashboards");
            //$http.defaults.headers.common.token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjEsImlzcyI6Imh0dHA6XC9cLzEwNC4yMTcuMjUzLjE1XC90d2lnYmlnXC9wdWJsaWNcL2FwaVwvdjFcL2F1dGhcL2xvZ2luIiwiaWF0IjoxNDk1NjkzMDA4LCJleHAiOjIwOTU2OTI5NDgsIm5iZiI6MTQ5NTY5MzAwOCwianRpIjoiNDdiNWU3MDQxNTRhZmI3ZDQxZmJkYzI0Y2RlMWViZGQifQ.-2in7qUI-ek9vh4RyZL_pM--kJEonKInKmuSXbM6Vqw";
        } else {
            //console.log("else");
            //$state.go("app.pages_auth_login");
        }
        // console.log("$rootScope.globals.currentUser ", $rootScope.globals.currentUser)
        $rootScope.login = false;
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            ///console.log("$locationChangeStart");
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            // console.log("restrictedPage && !loggedIn ",restrictedPage && !loggedIn);         
            if (restrictedPage && !loggedIn) {
                // console.log("restrictedPage && !loggedIn");               
                if (!$rootScope.forgotPassword && !$rootScope.register) {
                    //console.log("if2");
                    $rootScope.login = true;
                    // console.log("!$rootScope.forgotPassword && !$rootScope.register");
                    //$state.go("app.pages_auth_login");
                    
                } else {
                    //console.log("else2");
                }
            }
        });

        // editableThemes.default.submitTpl = '<md-button class="md-icon-button" type="submit" aria-label="save"><md-icon md-font-icon="icon-checkbox-marked-circle" class="md-accent-fg md-hue-1"></md-icon></md-button>';
        //  editableThemes.default.cancelTpl = '<md-button class="md-icon-button" ng-click="$form.$cancel()" aria-label="cancel"><md-icon md-font-icon="icon-close-circle" class="icon-cancel"></md-icon></md-button>';

        // Activate loading indicator
        var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function (event)
        {
            //console.log("$stateChangeStart ", $rootScope.login);
            if($rootScope.login === true){
                $rootScope.login = false;//
                event.preventDefault();
                //console.log("$stateChangeStart2 ", $rootScope.login);
                $state.go("app.pages_auth_login");
            }
            $rootScope.loadingProgress = true;
        });

        // De-activate loading indicator
        var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function ()
        {
            $timeout(function ()
            {
                //console.log("$stateChangeStart ", $rootScope.login);
                $rootScope.loadingProgress = false;
            });
        });

        // Store state in the root scope for easy access
        $rootScope.state = $state;

        //make the service available     
        $rootScope.Language = Language;

        // Cleanup
        $rootScope.$on('$destroy', function ()
        {
            stateChangeStartEvent();
            stateChangeSuccessEvent();
        });
    }
})();