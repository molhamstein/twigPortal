(function ()
{
    'use strict';

    angular
            .module('app.delivery')
            .controller('DeliveryZonesController', function ($state, $mdDialog, msApi, $scope, $filter, msUtils, $rootScope)
            {
                var vm = this;
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
                    msApi.request('delivery_zones.delivery_zones@get', {limit: number, page: currentPage},
                    function (res) {
                        console.log(res);
                        $scope.total_pages = res.paginator.total_count;
                        tableState.pagination.numberOfPages = res.paginator.total_pages;
                        $scope.displayed = res.data;
                        vm.isLoading = false;
                    }, function (result) {
                        console.log(result);
                    });
                };

                // Methods
                vm.selectedItems = [];
                vm.editItem = editItem;
                vm.itemDetails = itemDetails;
                vm.deleteItemConfirm = deleteItemConfirm;

                function deleteItemConfirm(item, ev)
                {
                    var confirm = $mdDialog.confirm()
                            .title('Are you sure want to delete the delivery zone?')
                            .htmlContent('Delivery zone <b>' + item.name + '</b>' + ' will be deleted.')
                            .ariaLabel('delete delivery zone')
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


                $scope.callServer = function (tableState) {
                    vm.isLoading = true;
                    console.log("tableState ", tableState);
                    var pagination = tableState.pagination;
                    var start = pagination.start || 0,
                            number = pagination.number || 10,
                            currentPage = Math.floor(start / number) + 1;
                    msApi.request('delivery_zones.delivery_zones@get', {limit: number, page: currentPage},
                    function (res) {
                        console.log(res);
                        $scope.total_pages = res.paginator.total_count;
                        tableState.pagination.numberOfPages = res.paginator.total_pages;

                        $scope.displayed = res.data;

                        vm.isLoading = false;

                    }, function (result) {
                        console.log(result);
                    });
                };
                function deleteItem(item)
                {
                    msApi.register('delivery_zones.deletedelivery_zones', ['delivery_zones/' + item.id]);
                    msApi.request('delivery_zones.deletedelivery_zones@delete',
                            // SUCCESS
                                    function (response)
                                    {
                                        console.log(response);
                                        $scope.errorMessageToast(response.message);
                                        $scope.callServer($scope.tableState);
                                        //$state.go("app.businesses");
                                    },
                                    function (response)
                                    {
                                        console.error(response.data);
                                        $scope.errorMessageToast(response.data.error.code + " " + response.data.error.message);
                                    }
                            );
                        }

                function itemDetails(id) {
                    $state.go('app.delivery.delivery-view', {id: id});
                }

                function editItem(ev, item) {
                    $state.go('app.delivery.edit-delivery', {id: item.id});
                }
            });
        })();
