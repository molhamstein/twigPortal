//var businessess = angular.module("app.businesses", []);
//
//(function (app)
//{
//    'use strict';
angular.module("app.businesses")
        .config(config);

/** @ngInject */
function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
{

    $stateProvider
            .state('app.businesses', {
                url: '/businesses',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/businesses/businesses.html',
                        controller: 'BusinessesController as vm'
                    }
                }
                ,
                    resolve: {
                        authenticate: function (permissions) {
                            permissions.getPermissions("BUSINESSES");
                        }
                    }
            })
                .state('app.businesses.business-view', {
                    url: '/Business/:id',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/businesses/business/business.html',
                            controller: 'BusinessController as vm'
                        }
                    },
                    resolve: {
                        Business: function(msApi, $stateParams)
                        {
                            msApiProvider.register('business.view', ['businesses/' + $stateParams.id, {}, 'get']);
                            return msApi.resolve('business.view@get', {});
                        }
                    }
                })

            .state('app.businesses.add-business', {
                url: '/AddBusiness',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/businesses/addBusiness/addBusiness.html',
                        controller: 'AddBusinessController as vm'
                    }
                },
                resolve: {
                    Products: function (msApi)
                    {
                        return msApi.resolve('products.products@get');
                    },
                    Categories: function (msApi)
                    {
                        return msApi.resolve('categories.categories@get', {'all': 'yes'});
                    },
                    Industries :function (msApi)
                    {
                        return msApi.resolve('industries.industries@get');
                    },
                    Cities:function (msApi)
                    {                        
                        return msApi.resolve('cities.cities@get');
                    }
                }
            })
            .state('app.businesses.edit-business', {
                url: '/EditBusiness/:id',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/businesses/editBusiness/editBusiness.html',
                        controller: 'EditBusinessController as vm'
                    }
                },
                resolve: {
                    Business: function (msApi, $stateParams)
                    {
                        msApiProvider.register('business.view', ['businesses/' + $stateParams.id, {}, 'get']);
                        //msApiProvider.register('users.edituser', ['auth/profile?' + $stateParams.id, {}, 'put']);
                        return msApi.resolve('business.view@get', {});
                    },
                    Products: function (msApi)
                    {
                        return msApi.resolve('products.products@get');
                    },
                    Categories: function (msApi)
                    {
                        return msApi.resolve('categories.categories@get',{'all': 'yes'});
                    },
                    Industries :function (msApi)
                    {                      
                        return msApi.resolve('industries.industries@get');
                    }
                    ,
                    Cities:function (msApi)
                    {                        
                        return msApi.resolve('cities.cities@get');
                    }
                }

            });

    // Translation
    $translatePartialLoaderProvider.addPart('app/main/businesses');

    // Api

    msApiProvider.register('businesses.businesses', ['businesses', {}, 'get']);
    msApiProvider.register('industries.industries', ['industries', {}, 'get']);
    msApiProvider.register('cities.cities', ['cities', {}, 'get']);
    msApiProvider.register('countries.countries', ['countries', {}, 'get']);


    // Navigation
    msNavigationServiceProvider.saveItem('businesses', {
        title: 'BUSINESSES',
        icon: 'icon-briefcase',
        state: 'app.businesses',
        // group: true,           
        // weight: 10,
        //   hidden: !AuthenticationProvider.setLoggedUser.globals.currentUser.loggedUser,
        order: 4
    });//     
}
//})(businessess);