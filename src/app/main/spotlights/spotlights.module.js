(function()
{
    'use strict';

    angular
            .module('app.spotlights',
                    [
                        // 3rd Party Dependencies
                //        'xeditable',
                      //  'datatables',
                //        'textAngular'
                    ]
                    )
            .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
       
        // Navigation
        msNavigationServiceProvider.saveItem('spotlights', {
            title: 'SPOTLIGHTS',
           // group: true,
            icon  : 'icon-flash',
            state : 'app.spotlights',
            weight: 10
        });
//        msNavigationServiceProvider.saveItem('spotlights.list', {
//            title: 'List',
//            //group : true,
//            icon: 'highlight',
//            state: 'app.spotlights',
//            weight: 3
//        });      

    }

})();