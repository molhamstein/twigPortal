(function()
{
    'use strict';

    angular
            .module('app.locations',
                    [              
                        'uiGmapgoogle-maps'                                  
                    ]
                    )
            .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        $stateProvider
                .state('app.locations', {
                    url: '/Locations',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/locations/locations.html',
                            controller: 'LocationsController as vm'
                        }
                    },
                    resolve: {
                        authenticate: function (permissions) {
                            permissions.getPermissions("LOCATIONS");
                        }
                    }
                })
                .state('app.locations.locations-view', {
                    url: '/Locations/:id',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/locations/item/item.html',
                            controller: 'ViewLocationController as vm'
                        }
                    },
                    resolve: {
                        Location: function(msApi, $stateParams)
                        {
                           msApiProvider.register('locations.view', ['locations/'+$stateParams.id, {},'get']);
                           return msApi.resolve('locations.view@get', {'id': $stateParams});                                                        
                        }
                    }                   
                })
                .state('app.locations.add-location', {
                    url: '/AddLocation',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/locations/addItem/addItem.html',
                            controller: 'AddLocationController as vm'
                        }
                    }                             
                })
                .state('app.locations.edit-location', {
                    url: '/EditLocation/:id',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/locations/editItem/editItem.html',
                            controller: 'EditLocationController as vm'
                        }
                    },
                    resolve: {
                        Location: function(msApi,$stateParams)
                        {
                            msApiProvider.register('locations.view', ['locations/'+$stateParams.id, {},'get']);
                            return msApi.resolve('locations.view@get', {'id': $stateParams.id});                            
                           
                                                                            
                        }
                    }                        
                });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/locations');

        // Api
         msApiProvider.register('locations.locations', ['locations', {},'get']);
         msApiProvider.register('locations.nearby', ['locations/nearby', {},'get']);
         //msApiProvider.register('locations.addfeeling', ['feelings', {},'get']);
        // Navigation
        msNavigationServiceProvider.saveItem('locations', {
            title: 'LOCATIONS',
            //group: true,
            icon  : 'icon-map-marker',
            state : 'app.locations',
            weight: 4,
            order:4
        });

    }

})();