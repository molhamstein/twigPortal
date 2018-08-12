(function ()
{
    'use strict';

    angular
        .module('app.reset-password', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider,msApiProvider)
    {
        // State
        $stateProvider.state('app.pages_auth_reset-password', {
            url      : '/pages/auth/reset-password',
            views    : {
                'main@'                                : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.pages_auth_reset-password': {
                    templateUrl: 'app/main/pages/auth/reset-password/reset-password.html',
                    controller : 'ResetPasswordController as vm'
                }
            },
            bodyClass: 'reset-password'
        });
        
        msApiProvider.register('resetpassword', ['auth/reset_password']);
               // msApiProvider.register('resetpassword', ['auth/reset_password',{},'get']);


        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/auth/reset-password');

        // Navigation
        msNavigationServiceProvider.saveItem('pages.auth.reset-password', {
            title : 'Reset Password',
            state : 'app.pages_auth_reset-password',
            weight: 6
        });
    }

})();