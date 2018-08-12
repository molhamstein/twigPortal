(function ()
{
    'use strict';

    angular
            .module('app.businesses')
            .controller('BusinessesController', function ($state, $mdDialog, msApi, $scope, $filter, msUtils, $rootScope, permissions)
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
                    msApi.request('businesses.businesses@get', {limit: number, page: currentPage},
                    function (res) {
                        console.log(res);
                        $scope.total_pages = res.paginator.total_count;
                        tableState.pagination.numberOfPages = res.paginator.total_pages;
                        
//                        res.data.forEach(function (item) {
//                            var hasPermission = permissions.hasPermission('list', item.id);
//                            console.log("hasPermission ", hasPermission);
//                            if(hasPermission) $scope.displayed.push(item);
//                        });

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
                            .title('Are you sure want to delete the business?')
                            .htmlContent('Business <b>' + item.name + '</b>' + ' will be deleted.')
                            .ariaLabel('delete business')
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
                    msApi.request('businesses.businesses@get', {limit: number, page: currentPage},
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
                    msApi.register('businesses.deletebusiness', ['businesses/' + item.id]);
                    msApi.request('businesses.deletebusiness@delete',
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
//
//        function deleteItem(item)
//        {
//            Upload.upload({
//                url: $rootScope.twigBigRoot + 'businesses/' + item.id,
//                method: 'POST',
//                data: {
//                    name: item.name,
//                    status: "Inactive",
//                    _method: 'PUT'}
//            }).then(function(resp) {
//                console.log(resp);
//                $scope.errorMessageToast("User has been de-activated succesfully");
//                $scope.callServer($scope.tableState);
//                //$state.go('app.users');
//                //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
//            }, function(response) {
//                console.log(response);
//                // $scope.errorMessageToast(msg);
//                // console.error(response.data);
//            });
//            //console.log("vm.items.indexOf(item) ", vm.items.indexOf(item));
//            // 
//        }



                function itemDetails(id) {
                    $state.go('app.businesses.business-view', {id: id});
                }

                function editItem(ev, item) {
                    $state.go('app.businesses.edit-business', {id: item.id});
                }
            })
        })();
