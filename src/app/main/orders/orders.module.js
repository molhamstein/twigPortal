
(function ()
{
    'use strict';
    angular
            .module("app.orders")
            .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {

        $stateProvider
                .state('app.orders', {
                    url: '/orders',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/orders/orders.html',
                            controller: 'OrdersController as vm'
                        }
                    }
                })
                .state('app.orders.order-view', {
                    url: '/Orders/:id',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/orders/order/order.html',
                            controller: 'OrderController as vm'
                        }
                    },
                    resolve: {
                        Order: function (msApi, $stateParams)
                        {
                            msApiProvider.register('order.view', ['orders/' + $stateParams.id, {}, 'get']);
                            return msApi.resolve('order.view@get', {});
                        }
                    }
                })

                .state('app.orders.add-order', {
                    url: '/AddOrder',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/orders/addOrder/addOrder.html',
                            controller: 'AddOrderController as vm'
                        }
                    }
                })
                .state('app.orders.edit-order', {
                    url: '/EditOrder/:id',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/orders/editOrder/editOrder.html',
                            controller: 'EditOrderController as vm'
                        }
                    },
                    resolve: {
                        Order: function (msApi, $stateParams)
                        {
                            msApiProvider.register('order.view', ['orders/' + $stateParams.id, {}, 'get']);
                            return msApi.resolve('order.view@get', {});
                        }
                    }

                });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/orders');

        // Api

        msApiProvider.register('orders.orders', ['orders', {}, 'get']);
        // msApiProvider.register('orders.order', ['orders', {}, 'get']);

        // Navigation
        msNavigationServiceProvider.saveItem('orders', {
            title: 'ORDERS',
            icon: 'icon-cart',
            state: 'app.orders',
            // group: true,           
            // weight: 10,
            //   hidden: !AuthenticationProvider.setLoggedUser.globals.currentUser.loggedUser,
            order: 7
        });//     
    }
})();