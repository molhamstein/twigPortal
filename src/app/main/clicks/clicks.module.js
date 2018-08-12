(function()
{
    'use strict';

    angular
            .module('app.clicks')
            .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        $stateProvider
                .state('app.clicks', {
                    url: '/Clicks',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/clicks/clicks.html',
                            controller: 'ClicksController as vm'
                        }
//                    },
//                    resolve: {
//                        authenticate: function (permissions) {
//                            permissions.getPermissions("CLICKS");
//                        }
                    }
                })
               
        // Translation
        $translatePartialLoaderProvider.addPart('app/main/clicks');

        // Api

        msApiProvider.register('clicks.clicks', ['twig_btns/stats', {}, 'get']);
       
        // Navigation
        msNavigationServiceProvider.saveItem('clicks', {
            title: 'CLICKS',
            //group: true,
            icon: 'icon-chart-line',
            state: 'app.clicks',
            //weight: 10,
            order:11
        });
    }
})();