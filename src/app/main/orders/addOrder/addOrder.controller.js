var delivery = angular.module("app.orders");
(function (app) {
    app.controller('AddOrderController',
            function ($state, $scope, msApi, $timeout, $q, $rootScope)
            {
                var vm = this;
                vm.submit = submit;
                $scope.translate = 'ORDERS.';
               
                vm.item = {
                    user_id:null,
                    to_user_id:null,
                    currency_id:1,
                    product_id:null,
                    delivery_zone_id:null,
                    delivery_address:null,
                    phone_number:null,
                    quantity:null,
                    notes:null
                };
                $scope.searchUser = null;
                $scope.selectedUser = null;
                $scope.searchToUser = null;
                $scope.selectedToUser = null;
                $scope.searchProduct = null;
                $scope.selectedProduct = null;
                $scope.searchDeliveryZone = null;
                $scope.selectedDeliveryZone = null;
                
                $scope.querySearch = function (keyword, flag) {
                    console.log("keyword, flag", keyword, flag);
                    if (keyword && keyword !== null && keyword !== '') {
                        var deferred = $q.defer();
                         var results;
                            if (flag === "users")
                                results = getUsers(keyword);
                            else if (flag === "delivery")
                                results = getDZones(keyword);
                            else if (flag === "products")
                                results = getProducts(keyword);
                            console.log("results ", results);
                        $timeout(function () {                           
                            deferred.resolve(results);
                        }, 7000);
                        return deferred.promise;
                    } else {
                        return [];
                    }
                };
                function getUsers(keyword) {
                    $scope.users = [];
                    msApi.request('users.users@get', {
                        keyword: keyword
                    },
                    function (response) {
                        console.log("response", response);
                        if (response.data.length !== 0) {
                            for (var i = 0; i < response.data.length; i++)
                                $scope.users.push(response.data[i]);
                        }
                        console.log("$scope.users ", $scope.users);
                        return $scope.users;
                    }, function (response) {

                    }
                    );
                    return $scope.users;
                }

                function getProducts(keyword) {
                    $scope.products = [];
                    msApi.request('products.products@get', {
                        keyword: keyword
                    },
                    function (response) {
                        console.log("response", response);
                        if (response.data.length !== 0) {
                            for (var i = 0; i < response.data.length; i++)
                                $scope.products.push(response.data[i]);
                        }
                        console.log("$scope.products ", $scope.products);
                        return $scope.products;
                    }, function (response) {

                    }
                    );
                    return $scope.products;
                }

                function getDZones(keyword) {
                    $scope.delivery_zones = [];
                    msApi.request('delivery_zones.delivery_zones@get', {
                        keyword: keyword
                    },
                    function (response) {
                        console.log("response", response);
                        if (response.data.length !== 0) {
                            for (var i = 0; i < response.data.length; i++)
                                $scope.delivery_zones.push(response.data[i]);
                        }
                        console.log("$scope.delivery_zones ", $scope.delivery_zones);
                        return $scope.delivery_zones;
                    }, function (response) {

                    }
                    );
                    return $scope.delivery_zones;
                }

                $scope.selectedItemChange = function (item, flag, user) {
                    console.log("item", item);
                    if (item) {
                        if (flag === "users") {
                            if (user === "user")
                                vm.item.user_id = item.id;
                            if (user === "touser")
                                vm.item.to_user_id = item.id;
                        }
                        else if (flag === "delivery")
                            vm.item.delivery_zone_id = item.id;
                        else if (flag === "products")
                            vm.item.product_id = item.id;

                    }
                };
               

                
                function submit() {
                    console.log("item ", vm.item);
                       msApi.request('orders.orders@save', vm.item,
                // SUCCESS
                function(response)
                {
                    console.log(response.data);
                    $scope.errorMessageToast("Order has been added succesfully");
                    $state.go('app.orders');
                },
                        // ERROR
                                function(response)
                                {
                                    console.error(response.data);
                                    $scope.errorMessageToast(response.data.message);

                                }
                        );

                }

            });
})(delivery);