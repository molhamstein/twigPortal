(function ()
{
    'use strict';

    angular
        .module('app.login', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider, msApiProvider)
    {
        // State
        $stateProvider.state('app.pages_auth_login', {
            url      : '/pages/auth/login',
            views    : {
                'main@'                       : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.pages_auth_login': {
                    templateUrl: 'app/main/pages/auth/login/login.html',
                    controller : 'LoginController as vm'
                }
            },
            bodyClass: 'login'
        });

        msApiProvider.register('login', ['auth/login',{},'get']);
        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/auth/login');

        // Navigation
//        msNavigationServiceProvider.saveItem('pages.auth', {
//            title : 'Authentication',
//            icon  : 'icon-lock',
//            weight: 1
//        });
//
//        msNavigationServiceProvider.saveItem('pages.auth.login', {
//            title : 'Login',
//            state : 'app.pages_auth_login',
//            weight: 1
//        });
    }

})();