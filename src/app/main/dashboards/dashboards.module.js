(function()
{
    'use strict';

    angular
            .module('app.dashboards',
                    [
                        // 3rd Party Dependencies
                        //'nvd3',
                      //  'datatables'
                    ]
                    )
            .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.dashboards', {
            url: '/dashboard',
            views: {
                'content@app': {
                    templateUrl: 'app/main/dashboards/dashboard.html',
                    controller: 'DashboardProjectController as vm'
                }
            },
            resolve: {
                DashboardData: function(msApi)
                {
                    //return msApi.resolve('dashboard.project@get');
                }
            },
            bodyClass: 'dashboard-project'
        });

        // Api
        //msApiProvider.register('dashboard.project', ['app/data/dashboard/project/data.json']);     
        
        msNavigationServiceProvider.saveItem('dashboard', {
            title: 'DASHBOARD',
            // group: true,
            icon: 'icon-tile-four',
            state: 'app.dashboards',
            weight: 10,
            order: 1
        });

    }

})();