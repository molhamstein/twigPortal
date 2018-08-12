(function()
{
    'use strict';

    angular
            .module('app.tags',[])
            .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        $stateProvider
                .state('app.tags', {
                    url: '/Tags',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/tags/tags.html',
                            controller: 'TagsController as vm'
                        }
                    },
                    resolve: {
                        authenticate: function (permissions) {
                            permissions.getPermissions("TAGS");
                        }
                    }
                })
                .state('app.tags.tags-view', {
                    url: '/Tag/:id',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/tags/item/item.html',
                            controller: 'TagController as vm'
                        }
                    },
                    resolve: {
                        Tag: function(msApi, $stateParams)
                        {
                            msApiProvider.register('tags.view', ['tags/' + $stateParams.id, {}, 'get']);
                            return msApi.resolve('tags.view@get', {'id': $stateParams});
                        }
                    }
                })

                .state('app.tags.add-tag', {
                    url: '/AddTag',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/tags/addItem/addItem.html',
                            controller: 'AddTagController as vm'
                        }
                    }

                })
                .state('app.tags.edit-tag', {
                    url: '/EditTag/:id',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/tags/editItem/editItem.html',
                            controller: 'EditTagController as vm'
                        }
                    },
                    resolve: {
                        Tag: function(msApi, $stateParams)
                        {
                            msApiProvider.register('tags.view', ['tags/' + $stateParams.id, {}, 'get']);                         
                            return msApi.resolve('tags.view@get', {'id': $stateParams});
                        }
                    }

                });
        // Translation
        $translatePartialLoaderProvider.addPart('app/main/tags');

        // Api

        msApiProvider.register('tags.tags', ['tags', {}, 'get']);
        msApiProvider.register('tags.tag', ['tags', {}, 'get']);
        // Navigation
        msNavigationServiceProvider.saveItem('tags', {
            title: 'TAGS',
            //group: true,
            icon: 'icon-tag',
            state: 'app.tags',
            //weight: 10,
            order:8
        });
    }
})();