//var delivery = angular.module("app.delivery", []);

(function ()
{
    'use strict';
    angular
            .module("app.delivery")
            .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {

        $stateProvider
                .state('app.delivery', {
                    url: '/Delivery-zones',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/delivery/delivery.html',
                            controller: 'DeliveryZonesController as vm'
                        }
                    },
                    resolve: {
                        authenticate: function (permissions) {
                            permissions.getPermissions("DELIVERY");
                        }
                    }
                })
                .state('app.delivery.delivery-view', {
                    url: '/Delivery/:id',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/delivery/delivery/delivery.html',
                            controller: 'DeliveryController as vm'
                        }
                    },
                    resolve: {
                        Delivery: function (msApi, $stateParams)
                        {
                            msApiProvider.register('delivery.view', ['delivery_zones/' + $stateParams.id, {}, 'get']);
                            return msApi.resolve('delivery.view@get', {});
                        }
                    }
                })

                .state('app.delivery.add-delivery', {
                    url: '/AddDeliveryZone',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/delivery/addDelivery/addDelivery.html',
                            controller: 'AddDeliveryController as vm'
                        }
                    }                    
                })
                .state('app.delivery.edit-delivery', {
                    url: '/EditDelivery/:id',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/delivery/editDelivery/editDelivery.html',
                            controller: 'EditDeliveryController as vm'
                        }
                    },
                    resolve: {
                        Delivery: function (msApi, $stateParams)
                        {
                            msApiProvider.register('delivery.view', ['delivery_zones/' + $stateParams.id, {}, 'get']);
                            //msApiProvider.register('users.edituser', ['auth/profile?' + $stateParams.id, {}, 'put']);
                            return msApi.resolve('delivery.view@get', {});
                        }
                    }

                });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/delivery');

        // Api

        msApiProvider.register('delivery_zones.delivery_zones', ['delivery_zones', {}, 'get']);

        // Navigation
        msNavigationServiceProvider.saveItem('delivery', {
            title: 'DELIVERY ZONES',
            icon: 'icon-earth',
            state: 'app.delivery',
            // group: true,           
            // weight: 10,
            //   hidden: !AuthenticationProvider.setLoggedUser.globals.currentUser.loggedUser,
            order: 7
        });//     
    }
})();