(function ()
{
    'use strict';
    angular
            .module('app.twigs', [])
            .config(config);
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        $stateProvider
                .state('app.twigs', {
                    url: '/twigs',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/twigs/twigs.html',
                            controller: 'TwigsController as vm'
                        }
                    },
                    resolve: {
                        authenticate: function (permissions) {
                            permissions.getPermissions("TWIGS");
                        }
                    }
                })
                .state('app.twigs.twigs-view', {
                    url: '/Twig/:id',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/twigs/item/item.html',
                            controller: 'TwigController as vm'
                        }
                    },
                    resolve: {
                        Twig: function (msApi, $stateParams)
                        {
                            msApiProvider.register('twigs.view', ['twigs/' + $stateParams.id, {}, 'get']);
                            return msApi.resolve('twigs.view@get', {'id': $stateParams});
                            //return msApi.resolve('twigs.twig@get');                          
                        }
                    }
                })
                .state('app.twigs.add-twig', {
                    url: '/AddTwig',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/twigs/addItem/addItem.html',
                            controller: 'AddTwigController as vm'
                        }
                    },
                    resolve: {
//                        Users: function(msApi)
//                        {
//                            return msApi.resolve('users.users@get');
//                        },
                        Feelings: function (msApi)
                        {
                            return msApi.resolve('feelings.feelings@get');
                        },
                        Categories: function (msApi)
                        {
                            return msApi.resolve('categories.categories@get');
                        },
                        Products: function (msApi)
                        {
                            return msApi.resolve('products.products@get');
                        },
                        Tags: function (msApi)
                        {
                            return msApi.resolve('tags.tags@get');
                        }

                    }
                })
                .state('app.twigs.edit-twig', {
                    url: '/EditTwig/:id',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/twigs/editItem/editItem.html',
                            controller: 'EditTwigController as vm'
                        }
                    },
                    resolve: {
                        Twig: function (msApi, $stateParams)
                        {
                            msApiProvider.register('twigs.view', ['twigs/' + $stateParams.id, {}, 'get']);
                            return msApi.resolve('twigs.view@get', {'id': $stateParams.id});
                            //msApiProvider.register('twigs.edittwig', ['twigs/?'+$stateParams.id,{},'post']);

                        },
                        Feelings: function (msApi)
                        {
                            return msApi.resolve('feelings.feelings@get');
                        },
                        Categories: function (msApi)
                        {
                            return msApi.resolve('categories.categories@get');
                        },
                        Products: function (msApi)
                        {
                            return msApi.resolve('products.products@get');
                        },
                        Tags: function (msApi)
                        {
                            return msApi.resolve('tags.tags@get');
                        }
                    }
                });
        // Translation
        $translatePartialLoaderProvider.addPart('app/main/twigs');
        // Api
        msApiProvider.register('twigs.twigs', ['twigs', {}, 'get']);
        msApiProvider.register('twigs.alltwigs', ['twigs/all', {}, 'get']);
        msApiProvider.register('twigs.twig', ['twigs', {}, 'get']);
        //   msApiProvider.register('twigs.addtwig', ['twigs', {},'get']);

        msApiProvider.register('categories.categories', ['categories', {}, 'get']);
        msApiProvider.register('locations.locations', ['locations', {}, 'get']);
        msApiProvider.register('products.products', ['products', {}, 'get']);
        msApiProvider.register('tags.tags', ['tags', {}, 'get']);
        msApiProvider.register('twigs.add-twig-btns', ['twig_btns', {}, 'save']);


        // Navigation
        msNavigationServiceProvider.saveItem('twigs', {
            title: 'TWIGS',
            icon: 'icon-format-size',
            state: 'app.twigs',
            weight: 10,
            order: 3
        });
    }

})();