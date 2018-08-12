//var rolesList = [], userRolesList = {roles: [], businesses: []};
//angular.element(document).ready(function () {
//    var cookie = JSON.parse(decodeURIComponent($.cookie("globals")));
//    console.log("rolesList ", cookie);
//    if (cookie.currentUser) {
//        userRolesList.roles = cookie.currentUser.roles;
//        userRolesList.businesses = cookie.currentUser.businesses;
//    }
//});
(function ()
{
    'use strict';
    angular
            .module('app.core')
            .run(runBlock);
    /** @ngInject */
    function runBlock(msUtils, fuseGenerator, fuseConfig, permissions, $cookies, $rootScope,AuthenticationService,$state)
    {
        $rootScope.globals = $cookies.getObject('globals') || {};
        console.log("core.run");
        if ($rootScope.globals.currentUser) {
            console.log("$rootScope.globals.currentUser", $rootScope.globals.currentUser.loggedUser);
            if($rootScope.globals.currentUser.loggedUser.roles)
                permissions.setPermissions($rootScope.globals.currentUser.loggedUser.roles, $rootScope.globals.currentUser.loggedUser.businesses);
            else {
                AuthenticationService.ClearCredentials();
                $state.go("app.pages_auth_login");
            }
        }
        else {
                AuthenticationService.ClearCredentials();
                $state.go("app.pages_auth_login");
            }



        /**
         * Generate extra classes based on registered themes so we
         * can use same colors with non-angular-material elements
         */
        fuseGenerator.generate();
        /**
         * Disable md-ink-ripple effects on mobile
         * if 'disableMdInkRippleOnMobile' config enabled
         */
//        if ( fuseConfig.getConfig('disableMdInkRippleOnMobile') && msUtils.isMobile() )
//        {
//            var bodyEl = angular.element('body');
//            bodyEl.attr('md-no-ink', true);
//        }
//
//        /**
//         * Put isMobile() to the html as a class
//         */
//        if ( msUtils.isMobile() )
//        {
//            angular.element('html').addClass('is-mobile');
//        }
//
//        /**
//         * Put browser information to the html as a class
//         */
        var browserInfo = msUtils.detectBrowser();
        if (browserInfo)
        {
            var htmlClass = browserInfo.browser + ' ' + browserInfo.version + ' ' + browserInfo.os;
            angular.element('html').addClass(htmlClass);
        }
    }
})();