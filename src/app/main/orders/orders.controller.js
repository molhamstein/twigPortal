(function()
{
    'use strict';

    angular
            .module('app.orders')
            .controller('OrdersController', OrdersController)
    /** @ngInject */
    function OrdersController($state, $mdDialog, msApi, $scope, $filter, msUtils, Upload, $rootScope,$http,$mdSidenav,$q)
    {
        var vm = this;
        vm.adminRole = $rootScope.userRole == "ADMIN";
        console.log($rootScope);
        $scope.searchKeyword = "";
        $scope.itemsByPage = 10;
        $scope.displayed = [];
        this.callServer = function callServer(tableState) {
            vm.isLoading = true;
            console.log("tableState ", tableState);
            $scope.tableState = tableState;
            var pagination = tableState.pagination;
            var start = pagination.start || 0,
                    number = pagination.number || 10,
                    currentPage = Math.floor(start / number) + 1;
            msApi.request('orders.orders@get', {limit: number, page: currentPage},
            function(res) {
                console.log(res);
                $scope.total_pages = res.paginator.total_count;
                tableState.pagination.numberOfPages = res.paginator.total_pages;
                $scope.displayed = res.data;

                vm.isLoading = false;

            }, function(result) {
                console.log(result);
            });
        };




        // Methods
        vm.selectedItems = [];
        vm.editItem = editItem;
        vm.itemDetails = itemDetails;
        vm.deleteItemConfirm = deleteItemConfirm;
        // vm.submit = submit;
        vm.paymentStateChange = paymentStateChange;
        vm.deliveryStateChange = deliveryStateChange;
        vm.exists = msUtils.exists;
        vm.toggleInArray = msUtils.toggleInArray;
        vm.ordersFilter = ordersFilter;
        vm.closeOrdersFilter = closeOrdersFilter;
        vm.removeFilter = removeFilter;
        vm.filterApplied = false;


        function closeOrdersFilter() {
            $mdSidenav('right').toggle();
        }

        $scope.callServer = function (tableState, user_id, product_id,  business_id, payment_state, delivery_state) {
                vm.isLoading = true;
                business_id= !business_id && $scope.selectedBusiness ? $scope.selectedBusiness.id :business_id;
                product_id= !product_id && $scope.selectedProduct ? $scope.selectedProduct.id :product_id;
                user_id= !user_id && $scope.selectedUser ? $scope.selectedUser.id :user_id;
                payment_state= !payment_state? $scope.selectedPaymentState: payment_state;
                delivery_state= !delivery_state? $scope.selectedDeliveryState: delivery_state;
                console.log("tableState ", tableState);
                $scope.tableState = tableState;
                var pagination = tableState.pagination;
                var start = pagination.start || 0,
                        number = pagination.number || 10,
                        currentPage = Math.floor(start / number) + 1;
                msApi.request('orders.orders@get', {limit: number, page: currentPage, user_id: user_id, product_id: product_id, business_id: business_id, payment_state: payment_state,delivery_state: delivery_state},
                function(res) {
                    console.log(res);
                    $scope.total_pages = res.paginator.total_count;
                    tableState.pagination.numberOfPages = res.paginator.total_pages;
                    $scope.displayed = res.data;

                    vm.isLoading = false;

                }, function(result) {
                    console.log(result);
                });
        };
        function removeFilter(tableState) {
            $mdSidenav('right').close();
            vm.filterApplied = false;
            tableState = $scope.tableState;
            $scope.displayed = [];
            vm.isLoading = true;
            $scope.searchBusiness = null;
            $scope.selectedBusiness = null;
            $scope.searchProduct = null;
            $scope.selectedProduct = null;
            $scope.searchUser = null;
            $scope.selectedUser = null;
            $scope.selectedPaymentState=null;
            $scope.selectedDeliveryState=null;
            console.log("tableState ", tableState);
            $scope.tableState = tableState;
            var pagination = tableState.pagination;
            var start = pagination.start || 0,
                    number = pagination.number || 10,
                    currentPage = Math.floor(start / number) + 1;
            msApi.request('orders.orders@get', {limit: number, page: currentPage},
            function(res) {
                console.log(res);
                $scope.total_pages = res.paginator.total_count;
                tableState.pagination.numberOfPages = res.paginator.total_pages;
                $scope.displayed = res.data;

                vm.isLoading = false;

            }, function(result) {
                console.log(result);
            });
        }

        function deleteItemConfirm(contact, ev)
        {
            var confirm = $mdDialog.confirm()
                    .title('Are you sure want to delete the order?')
                    .htmlContent('The order will be deleted.')
                    .ariaLabel('delete order')
                    .targetEvent(ev)
                    .ok('OK')
                    .cancel('CANCEL');

            $mdDialog.show(confirm).then(function()
            {
                deleteItem(contact);
                vm.selectedItems = [];

            }, function()
            {

            });
        }



        function deleteItem(item)
        {
            msApi.register('twigs.deleteorder', ['orders/' + item.id]);
            msApi.request('twigs.deleteorder@delete',
                    // SUCCESS
                            function (response)
                            {
                                // console.log("$scope.items.indexOf(item) ", $scope.displayed.indexOf(item));
                                $scope.displayed.splice($scope.displayed.indexOf(item), 1);

                                //console.log("$scope.items ", $scope.items);
                                console.log(response);
                                $scope.errorMessageToast("Order has been deleted succesfully");

                            },
                            function (response)
                            {
                                console.error(response.data);
                                //$scope.errorMessageToast(response.data.error.code + " " + response.data.error.message);
                            }
                    );

        }


        function itemDetails(id) {
            $state.go('app.orders.order-view', {id: id});
        }

        function editItem(ev, item) {
          if($rootScope.userRole == "ADMIN")
            $state.go('app.orders.edit-order', {id: item.id});
        }


        function submit(newItem, item) {
            console.log("item ", item);
            console.log("newItem ", newItem);
            $http.post($rootScope.twigBigRoot + "orders/" + item.id, newItem)
                    .success(function (response) {
                        console.log(response);
                        $scope.errorMessageToast(response.message);
                        // $state.go("app.orders");
                    })
                    .error(function (response) {
                        console.error(response);
                        $scope.errorMessageToast(response.error.message);

                    });
        }

        function deliveryStateChange(item,ev) {
          // var address= "";
          // if(item.delivery_zone.business)
          //   address= item.delivery_zone.business.address;
          // else if(item.delivery_zone.location)
          //   address= item.delivery_zone.location.address;

          var newItem = {
            currency_id: item.currency.id,
            delivery_address: "address",
            delivery_zone_id: item.delivery_zone.id,
            phone_number:"99999999",
            product_id: item.product.id,
            quantity: item.quantity,
            to_user_id: item.to_user.id,
            user_id: item.user.id,
            delivery_state: item.delivery_state,
              _method:"PUT"
          };
          submit(newItem,item);
        }
        function paymentStateChange(item,ev) {
          var newItem = {
            currency_id: item.currency.id,
            delivery_address: "address",
            delivery_zone_id: item.delivery_zone.id,
            phone_number:"99999999",
            product_id: item.product.id,
            quantity: item.quantity,
            to_user_id: item.to_user.id,
            user_id: item.user.id,
            payment_state: item.payment_state,
              _method:"PUT"
          };
          submit(newItem,item);
        }

        $scope.searchBusiness = null;
        $scope.selectedBusiness = null;
        $scope.selectedBusinessChange = function (item) {
            if (item) {
                vm.filterApplied = true;
                $scope.itemsByPage = 10;
                $scope.displayed = [];

                $scope.callServer($scope.tableState, null, null,item.id);
            }
        };
        $scope.onChangeBusiness = function (keyword) {
            if (keyword && keyword !== null && keyword !== '') {
                var deferred = $q.defer();
                if($rootScope.userRole == "ADMIN"){
                  msApi.request('businesses.businesses@get', {
                      keyword: keyword
                  },
                  function (response) {
                      // console.log("response businesses", response);
                      deferred.resolve(response.data);
                  }, function (response) {
                      deferred.reject();
                      return [];
                  });
                }else{
                  deferred.resolve(querySearch(keyword ,$rootScope.globals.currentUser.loggedUser.businesses));
                }

                return deferred.promise;
            }else
            return [];
        };

        function querySearch(query, group) {
            var results = query ? group.filter(createFilterFor(query)) : [];
            return results;
        }

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(g) {
                return (g.name.toLowerCase().indexOf(lowercaseQuery) === 0);
            };
        }

        $scope.searchProduct = null;
        $scope.selectedProduct = null;
        $scope.selectedProductChange = function (item) {
            if (item) {
                vm.filterApplied = true;
                $scope.itemsByPage = 10;
                $scope.displayed = [];

                $scope.callServer($scope.tableState, null, item.id);
            }
        };
        $scope.onChangeProduct = function (keyword) {
            if (keyword && keyword !== null && keyword !== '') {
                var deferred = $q.defer();
                msApi.request('products.products@get', {
                    keyword: keyword
                },
                function (response) {
                    // console.log("response businesses", response);
                    deferred.resolve(response.data);
                }, function (response) {
                    deferred.reject();
                    return [];
                });
                return deferred.promise;
            }else
            return [];
        };

        $scope.searchUser = null;
        $scope.selectedUser = null;
        $scope.selectedUserChange = function (item) {
            if (item) {
                vm.filterApplied = true;
                $scope.itemsByPage = 10;
                $scope.displayed = [];

                $scope.callServer($scope.tableState, item.id);
            }
        };
        $scope.onChangeUser = function (keyword) {
            if (keyword && keyword !== null && keyword !== '') {
                var deferred = $q.defer();
                msApi.request('users.users@get', {
                    keyword: keyword
                },
                function (response) {
                    // console.log("response businesses", response);
                    deferred.resolve(response.data);
                }, function (response) {
                    deferred.reject();
                    return [];
                });
                return deferred.promise;
            }else
            return [];
        };

        $scope.selectedPaymentState=null;
        $scope.selectedDeliveryState=null;
        $scope.paymentStateFilterChange = function () {
          if ($scope.selectedPaymentState) {
              vm.filterApplied = true;
              $scope.itemsByPage = 10;
              $scope.displayed = [];

              $scope.callServer($scope.tableState, null,null,null,$scope.selectedPaymentState);
          }
        };
        $scope.deliveryStateFilterChange = function () {
          if ($scope.selectedDeliveryState) {
              vm.filterApplied = true;
              $scope.itemsByPage = 10;
              $scope.displayed = [];

              $scope.callServer($scope.tableState, null,null,null,null,$scope.selectedDeliveryState);
          }
        };

        function ordersFilter() {
            $mdSidenav('right').toggle()
                    .then(function () {
                        console.log("toggle is done");
                    });
            // $scope.selectedBusiness = null;
            // $scope.searchBusiness = null;

//            if (vm.businessesList.length === 0) {
//                $scope.isSideNavLoading = true;
//                var number = null, currentPage = null;
//                msApi.request('businesses.businesses@get', {limit: number, page: currentPage},
//                function (res) {
//                    console.log(res);
//                    vm.businessesList = res.data;
//                    $scope.isSideNavLoading = false;
//                }, function (result) {
//                    console.log(result);
//                });
//            }
        };
    }
})();
