(function()
{
    'use strict';

    angular
            .module('app.categories',[])
            .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        $stateProvider
                .state('app.categories', {
                    url: '/Categories',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/categories/categories.html',
                            controller: 'CategoriesController as vm'
                        }
                    }
                    ,
                    resolve: {
                        authenticate: function (permissions) {
                            permissions.getPermissions("CATEGORIES");
                        }
                    }

                })
                .state('app.categories.categories-view', {
                    url: '/Category/:id',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/categories/item/item.html',
                            controller: 'CategoryController as vm'
                        }
                    },
                    resolve: {
                        Category: function(msApi, $stateParams)
                        {
                           // console.log("$stateParams ", $stateParams);
                          //  msApiProvider.register('users.view', ['users/' + $stateParams.id, {}, 'get']);
                           // return msApiProvider.resolve('users.view@get', {'id': $stateParams});
                            
                            msApiProvider.register('categories.view', ['categories/' + $stateParams.id, {}, 'get']);                            
                            return msApi.resolve('categories.view@get', {'id': $stateParams});                   
                        }
                    }                   
                })
                .state('app.categories.add-category', {
                    url: '/AddCategory',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/categories/addItem/addItem.html',
                            controller: 'AddCategoryController as vm'
                        }
                    }                    
                })
                .state('app.categories.edit-category', {
                    url: '/EditCategory/:id',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/categories/editItem/editItem.html',
                            controller: 'EditCategoryController as vm'
                        }
                    },
                    resolve: {
                        Category: function(msApi, $stateParams)
                        {
                            //console.log("$stateParams ", $stateParams);
                             msApiProvider.register('categories.view', ['categories/' + $stateParams.id, {}, 'get']);                            
                            return msApi.resolve('categories.view@get', {'id': $stateParams});                                                  
                        }
                    }                        
                });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/categories');

        // Api
        msApiProvider.register('categories.categories', ['categories', {}, 'get']);
       // msApiProvider.register('categories.category', ['categories', {}, 'get']);     

        // Navigation
        msNavigationServiceProvider.saveItem('categories', {
            title: 'CATEGORIES',
           //group: true,
            icon  : 'icon-menu',
            state : 'app.categories',
            weight: 10,
            order:6
        });
    }

})();