(function()
{
    'use strict';

    angular
            .module('app.core')
            .provider('msApi', msApiProvider);
           

    /** @ngInject **/
    function msApiProvider()
    {
        /* ----------------- */
        /* Provider          */
        /* ----------------- */
        var provider = this;

        // Inject the $log service
        var $log = angular.injector(['ng']).get('$log');

        // Data
        var baseUrl = 'https://twigbig.com/api/public/index.php/api/v1/';
        var api = [];

        // Methods
        provider.setBaseUrl = setBaseUrl;
        provider.getBaseUrl = getBaseUrl;
        provider.getApiObject = getApiObject;
        provider.register = register;

        //////////

        /**
         * Set base url for API endpoints
         *
         * @param url {string}
         */
        function setBaseUrl(url)
        {
            baseUrl = url;
        }

        /**
         * Return the base url
         *
         * @returns {string}
         */
        function getBaseUrl()
        {
            return baseUrl;
        }

        /**
         * Return the api object
         *
         * @returns {object}
         */
        function getApiObject()
        {
            return api;
        }

        /**
         * Register API endpoint
         *
         * @param key
         * @param resource
         */
        function register(key, resource)
        {
            if (!angular.isString(key))
            {
                $log.error('"path" must be a string (eg. `dashboard.project`)');
                return;
            }

            if (!angular.isArray(resource))
            {
                $log.error('"resource" must be an array and it must follow $resource definition');
                return;
            }
           // console.log("resource ", resource);
            // Store the API object
            api[key] = {
                url: baseUrl + (resource[0] || ''),
                paramDefaults: resource[1] || [],
                actions: resource[2] || [],
                options: resource[3] || {}
            };
           // console.log("api[key] ", api[key]);
        }

        /* ----------------- */
        /* Service           */
        /* ----------------- */
        this.$get = function($log, $q, $resource, $rootScope)
        {
            // Data
            // console.log("$resource ", $resource);
            // Methods
            var service = {
                setBaseUrl: setBaseUrl,
                getBaseUrl: getBaseUrl,
                register: register,
                resolve: resolve,
                request: request
            };

            return service;

            //////////

            /**
             * Resolve an API endpoint
             *
             * @param action {string}
             * @param parameters {object}
             * @returns {promise|boolean}
             */
            function resolve(action, parameters)
            {
                //console.log("resolve ");
                // Emit an event
                $rootScope.$broadcast('msApi::resolveStart');
                // console.log("resolve ");
                var actionParts = action.split('@'),
                        resource = actionParts[0],
                        method = actionParts[1],
                        params = parameters || {};
                // console.log("resolve ");
                if (!resource || !method)
                {
                    //console.log("resolve ");
                    $log.error('msApi.resolve requires correct action parameter (resourceName@methodName)');
                    return false;
                }

                // Create a new deferred object
                var deferred = $q.defer();
                // console.log("resolve ");
                // Get the correct resource definition from api object
                var apiObject = api[resource];
                // console.log("resolve ");
                if (!apiObject)
                {
                    // console.log("resolve ");
                    $log.error('Resource "' + resource + '" is not defined in the api service!');
                    deferred.reject('Resource "' + resource + '" is not defined in the api service!');
                }
                else
                {
                   // console.log("resourceObject ", apiObject.url, apiObject.paramDefaults, apiObject.actions, apiObject.options);
                    // Generate the $resource object based on the stored API object
                    var resourceObject = $resource(apiObject.url, apiObject.paramDefaults, apiObject.actions, apiObject.options);
                    //conaole.log("resourceObject" , resourceObject);
                    // Make the call...
                    resourceObject[method](params,
                            // Success
                                    function(response)
                                    {
                                       // console.log("response s", response);
                                        deferred.resolve(response);

                                        // Emit an event
                                        $rootScope.$broadcast('msApi::resolveSuccess');
                                    },
                                    // Error
                                            function(response)
                                            {
                                               // console.log("response f", response);
                                                deferred.reject(response);

                                                // Emit an event
                                                $rootScope.$broadcast('msApi::resolveError');
                                            }
                                    );
                                }

                        // Return the promise
                        return deferred.promise;
                    }

            /**
             * Make a request to an API endpoint
             *
             * @param action {string}
             * @param [parameters] {object}
             * @param [success] {function}
             * @param [error] {function}
             *
             * @returns {promise|boolean}
             */
            function request(action, parameters, success, error)
            {
               // console.log("parameters ", parameters);
                // Emit an event
                $rootScope.$broadcast('msApi::requestStart');
               // console.log("action ", action);
                var actionParts = action.split('@'),
                        resource = actionParts[0],
                        method = actionParts[1],
                        params = parameters || {};
               // console.log("actionParts ", actionParts);
                //console.log("resource ", resource);
               // console.log("method ", method);
                if (!resource || !method)
                {
                    $log.error('msApi.resolve requires correct action parameter (resourceName@methodName)');
                    return false;
                }

                // Create a new deferred object
                var deferred = $q.defer();

                // Get the correct resource definition from api object
                var apiObject = api[resource];
               // console.log("apiObject ", apiObject);

                if (!apiObject)
                {
                    $log.error('Resource "' + resource + '" is not defined in the api service!');
                    deferred.reject('Resource "' + resource + '" is not defined in the api service!');
                }
                else
                {
                   // console.log("apiObject.actions ", apiObject.actions);
                    // Generate the $resource object based on the stored API object
                    var resourceObject = $resource(apiObject.url, apiObject.paramDefaults, apiObject.actions, apiObject.options);
                   // console.log("resourceObject ", resourceObject);
                    // Make the call...
                    resourceObject[method](params,
                            // SUCCESS
                                    function(response)
                                    {
                                       // console.log("response ", response);
                                        // Emit an event
                                        $rootScope.$broadcast('msApi::requestSuccess');

                                        // Resolve the promise
                                        deferred.resolve(response);

                                        // Call the success function if there is one
                                        if (angular.isDefined(success) && angular.isFunction(success))
                                        {
                                          //  console.log("response ", response);
                                            success(response);
                                        }
                                    },
                                    // ERROR
                                            function(response)
                                            {
                                               // console.log("response ", response);

                                                // Emit an event
                                                $rootScope.$broadcast('msApi::requestError');

                                                // Reject the promise
                                                deferred.reject(response);

                                                // Call the error function if there is one
                                                if (angular.isDefined(error) && angular.isFunction(error))
                                                {//console.log("response ", response);
                                                    error(response);
                                                }
                                            }
                                    );
                                }

                        // Return the promise
                        return deferred.promise;
                    }



            ;

        };
    }
})();