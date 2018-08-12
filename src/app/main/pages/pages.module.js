(function ()
{
    'use strict';

    angular
        .module('app.pages', [
            'app.login',
          //  'app.pages.auth.login-v2',
            'app.register',
           // 'app.pages.auth.register-v2',
            'app.forgot-password',
            'app.reset-password',           
          //  'app.pages.auth.lock'
           // 'app.pages.coming-soon',
            'app.error-404'
            //'app.pages.error-500',
           // 'app.pages.invoice',
            //'app.pages.maintenance',
            //'app.pages.profile',
            //'app.pages.search',
            //'app.pages.timeline'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        // Navigation
        msNavigationServiceProvider.saveItem('pages', {
            title : 'PAGES',
            hidden:true,
            group : true,
            weight: 2
        });
    }
})();