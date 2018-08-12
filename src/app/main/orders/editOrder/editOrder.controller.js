var delivery = angular.module("app.orders");
(function (app) {
    app.controller('EditOrderController',
            function ($state, $scope, msApi, $http, $timeout, Order, $q, $rootScope)
            {
                var vm = this;
                vm.submit = submit;
                $scope.translate = 'ORDERS.';

                console.log("Order.data ", Order.data);
                vm.item = Order.data;
                if (vm.item.quantity !== '')
                    vm.item.quantity = parseFloat(vm.item.quantity);
                $scope.searchProduct = vm.item.product.name;
                $scope.selectedProduct = vm.item.product;
                $scope.searchDeliveryZone = vm.item.delivery_zone.name;
                $scope.selectedDeliveryZone = vm.item.delivery_zone;
                $scope.searchUser = vm.item.user.name;
                $scope.selectedUser = vm.item.user;
                $scope.searchToUser = vm.item.to_user.name;
                $scope.selectedToUser = vm.item.to_user;
                vm.item.phone_number = "";
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
//                        if (flag === "users") {
//                            if (user === "user")
//                                vm.item.user_id = item.id;
//                            if (user === "touser")
//                                vm.item.to_user_id = item.id;
//                        }
//                        else if (flag === "delivery")
//                            vm.item.delivery_zone_id = item.id;
//                        else if (flag === "products")
//                            vm.item.product_id = item.id;

                    }
                };




                function submit() {
                    console.log("item ", vm.item);
                    var newItem = {
                        currency_id :1,
                        user_id: $scope.selectedUser.id,
                        to_user_id: $scope.selectedToUser.id,
                        product_id: $scope.selectedProduct.id,
                        delivery_zone_id: $scope.selectedDeliveryZone.id,
                        delivery_address: vm.item.delivery_address,
                        phone_number: vm.item.phone_number,
                        quantity: vm.item.quantity,
                        notes: vm.item.notes,
                        _method:"PUT"
                    };
                    console.log("newItem ", newItem);
                    $http.post($rootScope.twigBigRoot + "orders/" + vm.item.id, newItem)
                            .success(function (response) {
                                console.log(response);
                                $scope.errorMessageToast(response.message);
                                $state.go("app.orders");
                            })
                            .error(function (response) {
                                console.error(response);
                                $scope.errorMessageToast(response.error.message);

                            });
                }

            });
})(delivery);