(function()
{
    'use strict';

    angular
            .module('app.feelings',[])
            .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
       
       $stateProvider
                .state('app.feelings', {
                    url: '/Feelings',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/feelings/feelings.html',
                            controller: 'FeelingsController as vm'
                        }
                    },
                    resolve: {
                        authenticate: function (permissions) {
                            permissions.getPermissions("FEELINGS");
                        }
                    }
                })
                .state('app.feelings.feelings-view', {
                    url: '/Feelings/:id',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/feelings/item/item.html',
                            controller: 'feelingController as vm'
                        }
                    },
                    resolve: {
                        Feeling: function(msApi, $stateParams)
                        {
                           msApiProvider.register('feelings.view', ['feelings/'+$stateParams.id, {},'get']);
                           return msApi.resolve('feelings.view@get', {'id': $stateParams});                                                        
                        }
                    }                   
                })
                .state('app.feelings.add-feeling', {
                    url: '/AddFeeling',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/feelings/addItem/addItem.html',
                            controller: 'AddFeelingController as vm'
                        }
                    },
                    resolve: {
                         Categories: function(msApi)
                        {
                            return msApi.resolve('categories.categories@get');
                        }
//                        Users: function(msApi)
//                        {
//                            return msApi.resolve('users.users@get');
//                        },
//                        Categories: function(msApi)
//                        {
//                            return msApi.resolve('categories.categories@get');
//                        },
//                        Locations: function(msApi)
//                        {
//                            return msApi.resolve('locations.locations@get');
//                        },
//                        Products: function(msApi)
//                        {
//                            return msApi.resolve('products.products@get');
//                        },
//                        Tags: function(msApi)
//                        {
//                            return msApi.resolve('tags.tags@get');
//                        }
                        
                    }                    
                })
                .state('app.feelings.edit-feeling', {
                    url: '/EditFeeling/:id',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/feelings/editItem/editItem.html',
                            controller: 'EditFeelingController as vm'
                        }
                    },
                    resolve: {
                        Feeling: function(msApi,$stateParams)
                        {
                            msApiProvider.register('feelings.view', ['feelings/'+$stateParams.id, {},'get']);
                            return msApi.resolve('feelings.view@get', {'id': $stateParams.id});                            
                           
                                                                            
                        },
                        Categories: function(msApi)
                        {
                            return msApi.resolve('categories.categories@get');
                        },
//                        Locations: function(msApi)
//                        {
//                            return msApi.resolve('locations.locations@get');
//                        },
//                        Products: function(msApi)
//                        {
//                            return msApi.resolve('products.products@get');
//                        },
//                        Tags: function(msApi)
//                        {
//                            return msApi.resolve('tags.tags@get');
//                        }
                    }                        
                });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/feelings');

        // Api
         msApiProvider.register('feelings.feelings', ['feelings', {},'get']);
        // msApiProvider.register('feelings.feeling', ['feelings', {},'get']);
         msApiProvider.register('feelings.addfeeling', ['feelings', {},'get']);
         
//         msApiProvider.register('categories.categories', ['categories', {},'get']);
//         msApiProvider.register('locations.locations', ['locations', {},'get']);
//         msApiProvider.register('products.products', ['products', {},'get']);
//         msApiProvider.register('tags.tags', ['tags', {},'get']);        
         
        // Navigation
        msNavigationServiceProvider.saveItem('feelings', {
            title: 'FEELINGS',
           // group: true,
            icon  : 'icon-emoticon-happy',
            state : 'app.feelings',
            weight: 10,
            order:5
        });
 

    }

})();