(function ()
{
    'use strict';
    angular.module("app.businesses", []);
    angular.module("app.orders", []);
    angular.module("app.delivery", []);
    angular.module("app.logs", []);
    angular.module("app.clicks", []);
    angular.module('app.users', [])
            .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        $stateProvider
                .state('app.users', {
                    url: '/users',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/users/users.html',
                            controller: 'UsersController as vm',
                        }
                    },
                    resolve: {
                        authenticate: function (permissions) {
                            permissions.getPermissions("USERS");
                        }
                    }

                })
                .state('app.users.users-view', {
                    url: '/User/:id',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/users/item/item.html',
                            controller: 'UserController as vm'
                        }
                    },
                    resolve: {
                        User: function (msApi, $stateParams)
                        {
                            msApiProvider.register('users.view', ['users/' + $stateParams.id, {}, 'get']);
                            return msApi.resolve('users.view@get', {'id': $stateParams});
                        }
                    }
                })

                .state('app.users.add-user', {
                    url: '/AddUser',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/users/addItem/addItem.html',
                            controller: 'AddUserController as vm'
                        }
                    }

                })
                .state('app.users.edit-user', {
                    url: '/EditUser/:id',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/users/editItem/editItem.html',
                            controller: 'EditUserController as vm'
                        }
                    },
                    resolve: {
                        User: function (msApi, $stateParams)
                        {
                            msApiProvider.register('users.view', ['users/' + $stateParams.id, {}, 'get']);
                            //msApiProvider.register('users.edituser', ['auth/profile?' + $stateParams.id, {}, 'put']);
                            return msApi.resolve('users.view@get', {'id': $stateParams});
                        }
                    }

                });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/users');

        // Api

        msApiProvider.register('users.users', ['users', {}, 'get']);
        // msApiProvider.register('users.user', ['users', {}, 'get']);



        // Navigation
        msNavigationServiceProvider.saveItem('users', {
            title: 'USERS',
            icon: 'icon-account-box',
            state: 'app.users',
            // group: true,           
            //weight: 10,
            order: 2
        });//     
    }

})();
//window.loadedDependencies.push('app.users');