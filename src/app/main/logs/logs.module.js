(function()
{
    'use strict';

    angular
            .module('app.logs')
            .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        $stateProvider
                .state('app.logs', {
                    url: '/Logs',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/logs/logs.html',
                            controller: 'LogsController as vm'
                        }
                    },
                    resolve: {
                        authenticate: function (permissions) {
                            permissions.getPermissions("LOGS");
                        }
                    }
                })
               
        // Translation
        $translatePartialLoaderProvider.addPart('app/main/logs');

        // Api

        msApiProvider.register('logs.logs', ['logs', {}, 'get']);
       
        // Navigation
        msNavigationServiceProvider.saveItem('logs', {
            title: 'LOGS',
            //group: true,
            icon: 'icon-chart-line',
            state: 'app.logs',
            //weight: 10,
            order:10
        });
    }
})();