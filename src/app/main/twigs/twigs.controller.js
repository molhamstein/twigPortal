(function ()
{
    'use strict';

    angular
            .module('app.twigs')
            .controller('TwigsController', ItemsController);

    /** @ngInject */
    function ItemsController($state, $mdDialog, $mdSidenav, msUtils, $filter, $scope, msApi, $q, $rootScope) {
        var vm = this;

        $scope.itemsByPage = 10;
        $scope.displayed = [];
        this.callServer = function callServer(tableState) {
            vm.isLoading = true;
            $scope.tableState = tableState;
            //console.log("tableState ", tableState);
            var pagination = tableState.pagination;
            var start = pagination.start || 0,
                    number = pagination.number || 10,
                    currentPage = Math.floor(start / number) + 1;
            // console.log("$rootScope.globals.currentUser.loggedUser ", $rootScope.globals.currentUser.loggedUser);
            msApi.request('twigs.twigs@get', {limit: number, page: currentPage, latitude: 0, longitude: 0},
            function (res) {
                //console.log(res);
                $scope.total_pages = res.paginator.total_count;
                tableState.pagination.numberOfPages = res.paginator.total_pages;
                $scope.displayed = res.data;
                angular.forEach($scope.displayed, function (item) {
                    item.average = (parseFloat(item.quality) + parseFloat(item.service) + parseFloat(item.reasonable_price) + parseFloat(item.ambiance)) / 4;
                });
                vm.isLoading = false;
            }, function (result) {
                //console.log(result);
            });
        };




        // Methods
        vm.selectedItems = [];
        vm.editItem = editItem;
        vm.itemDetails = itemDetails;
        vm.businessesFilter = businessesFilter;
        vm.closeBusinessesFilter = closeBusinessesFilter;
        //vm.deleteItemConfirm = deleteItemConfirm;
        vm.deleteSelectedItems = deleteSelectedItems;
        vm.toggleSelectItem = toggleSelectItem;
        vm.exists = msUtils.exists;
        vm.toggleInArray = msUtils.toggleInArray;
        //vm.querySearch = querySearch;
        //vm.getData = getData;
        vm.removeFilter = removeFilter;
      //  vm.businessesList = [];
        vm.filterApplied = false;
//        vm.editItem = editItem;
//        vm.openOrderDialog = openOrderDialog;
//        vm.openOrderDialog1 = openOrderDialog1;
//        vm.gotoOrderDetail = gotoOrderDetail;
//        
//        function querySearch(query) {
//            var results = query ? vm.businessesList.filter(createFilterFor(query)) : vm.businessesList;
//            var deferred = $q.defer();
//            $timeout(function () {
//                deferred.resolve(results);
//            }, Math.random() * 1000, false);
//            return deferred.promise;
//        }
//        function createFilterFor(query) {
//            var lowercaseQuery = angular.lowercase(query);
//            return function filterFn(state) {
//                return (state.name.indexOf(lowercaseQuery) === 0);
//            };
//
//        }
        function closeBusinessesFilter() {
            $mdSidenav('right').toggle();
        }


        $scope.searchBusiness = null;
        $scope.selectedBusiness = null;
        $scope.selectedBusinessChange = function (item) {
            if (item) {
                vm.filterApplied = true;
                $scope.itemsByPage = 10;
                $scope.displayed = [];
                $scope.selectedLocation = null;
                $scope.searchLocation = null;
                $scope.callServer($scope.tableState, item.id, null);
            }
        };
        $scope.onChangeBusiness = function (keyword) {
            if (keyword && keyword !== null && keyword !== '') {
                var deferred = $q.defer();
                msApi.request('businesses.businesses@get', {
                    keyword: keyword
                },
                function (response) {
                    console.log("response businesses", response);
                    deferred.resolve(response.data);
                }, function (response) {
                    deferred.reject();
                    return [];
                });
                return deferred.promise;
            }
        };

        $scope.selectedLocation = null;
        $scope.searchLocation = null;
        $scope.onChangeLocation = function (keyword) {
            if (keyword && keyword !== null && keyword !== '') {
                var deferred = $q.defer();
                msApi.request('locations.locations@get', {
                    keyword: keyword
                },
                function (response) {
                    console.log("response", response);
                    deferred.resolve(response.data);
                }, function (response) {
                    deferred.reject();
                    return [];
                });
                return deferred.promise;
            }
        };

        $scope.selectedLocationChange = function (item) {
            console.log("item", item);
            if (item) {
                vm.filterApplied = true;
                $scope.itemsByPage = 10;
                $scope.displayed = [];
                $scope.callServer($scope.tableState, null, item.id);
                $scope.searchBusiness = null;
                $scope.selectedBusiness = null;
            }
        };


        function businessesFilter() {
            $mdSidenav('right').toggle()
                    .then(function () {
                        console.log("toggle is done");
                    });
            $scope.selectedBusiness = null;
            $scope.searchBusiness = null;
            $scope.selectedLocation = null;
            $scope.searchLocation = null;
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
        }
        ;

        $scope.callServer = function (tableState, business_id, location_id) {
            vm.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0,
                    number = pagination.number || 10,
                    currentPage = Math.floor(start / number) + 1;
            msApi.request('twigs.alltwigs@get', {limit: number, page: currentPage, business_id: business_id, location_id: location_id},
            function (res) {
                console.log("twigs.alltwigs@get", res);
                $scope.total_pages = res.paginator.total_count;
                tableState.pagination.numberOfPages = res.paginator.total_pages;
                $scope.displayed = res.data;
                angular.forEach($scope.displayed, function (item) {
                    item.average = (parseFloat(item.quality) + parseFloat(item.service) + parseFloat(item.reasonable_price) + parseFloat(item.ambiance)) / 4;
                });
                vm.isLoading = false;
            }, function (result) {
                //console.log(result);
            });
        };
//        function getData(business_id) {
//            vm.filterApplied = true;
//            $scope.itemsByPage = 10;
//            $scope.displayed = [];
//            $scope.callServer($scope.tableState, business_id);
//        }
        function removeFilter(tableState) {
            $mdSidenav('right').close();
            vm.filterApplied = false;
            tableState = $scope.tableState;
            $scope.displayed = [];
            vm.isLoading = true;
            $scope.tableState = tableState;
            //console.log("tableState ", tableState);
            var pagination = tableState.pagination;
            var start = pagination.start || 0,
                    number = pagination.number || 10,
                    currentPage = Math.floor(start / number) + 1;
            // console.log("$rootScope.globals.currentUser.loggedUser ", $rootScope.globals.currentUser.loggedUser);
            msApi.request('twigs.twigs@get', {limit: number, page: currentPage, latitude: 0, longitude: 0},
            function (res) {
                //console.log(res);
                $scope.total_pages = res.paginator.total_count;
                tableState.pagination.numberOfPages = res.paginator.total_pages;

                $scope.displayed = res.data;
                angular.forEach($scope.displayed, function (item) {
                    item.average = (parseFloat(item.quality) + parseFloat(item.service) + parseFloat(item.reasonable_price) + parseFloat(item.ambiance)) / 4;
                });
                vm.isLoading = false;
            }, function (result) {
                //console.log(result);
            });
        }

        $scope.deleteItemConfirm = function (item, ev) {
            var confirm = $mdDialog.confirm()
                    .title('Are you sure want to delete the twig?')
                    .htmlContent('Twig <b>' + item.id + '</b>' + ' will be deleted.')
                    .ariaLabel('delete twig')
                    .targetEvent(ev)
                    .ok('OK')
                    .cancel('CANCEL');

            $mdDialog.show(confirm).then(function ()
            {
                deleteItem(item);
                vm.selectedItems = [];

            }, function ()
            {

            });
        }
        function deleteItem(item)
        {
            msApi.register('twigs.deletetwig', ['twigs/' + item.id]);
            msApi.request('twigs.deletetwig@delete',
                    // SUCCESS
                            function (response)
                            {
                                // console.log("$scope.items.indexOf(item) ", $scope.displayed.indexOf(item));
                                $scope.displayed.splice($scope.displayed.indexOf(item), 1);

                                //console.log("$scope.items ", $scope.items);
                                console.log(response);
                                $scope.errorMessageToast(response.message);

                            },
                            function (response)
                            {
                                console.error(response.data);
                                $scope.errorMessageToast(response.data.error.code + " " + response.data.error.message);
                            }
                    );
                }


        function deleteSelectedItems(ev)
        {
            var confirm = $mdDialog.confirm()
                    .title('Are you sure want to delete the selected twigs?')
                    .htmlContent('<b>' + vm.selectedItems.length + ' selected</b>' + ' will be deleted.')
                    .ariaLabel('delete twigs')
                    .targetEvent(ev)
                    .ok('OK')
                    .cancel('CANCEL');

            $mdDialog.show(confirm).then(function ()
            {

                vm.selectedItems.forEach(function (item) {
                    deleteItem(item);
                });

                vm.selectedItems = [];

            });

        }



        function toggleSelectItem(contact, event)
        {
            if (event)
            {
                event.stopPropagation();
            }

            if (vm.selectedItems.indexOf(contact) > -1)
            {
                vm.selectedItems.splice(vm.selectedItems.indexOf(contact), 1);
            }
            else
            {
                vm.selectedItems.push(contact);
            }
        }


        function itemDetails(id) {
            $state.go('app.twigs.twigs-view', {id: id});
        }
        function editItem(item) {
            $state.go('app.twigs.edit-twig', {id: item.id});
        }


    }
})();