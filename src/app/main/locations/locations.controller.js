(function()
{
    'use strict';

    angular
            .module('app.locations')
            .controller('LocationsController', LocationsController);

    /** @ngInject */
    function LocationsController($state, $scope, $filter, $mdDialog, msUtils, msApi)
    {
        var vm = this;
        $scope.itemsByPage = 10;
        $scope.displayed = [];
        this.callServer = function callServer(tableState) {
            vm.isLoading = true;
           // console.log("tableState ", tableState);
            var pagination = tableState.pagination;
            var start = pagination.start || 0,
                    number = pagination.number || 10,
                    currentPage = Math.floor(start / number) + 1;
            msApi.request('locations.locations@get', {limit: number, page: currentPage},
            function(res) {
               // console.log(res);           
                $scope.total_pages = res.paginator.total_count;              
                tableState.pagination.numberOfPages = res.paginator.total_pages;
                $scope.displayed = res.data;              
                vm.isLoading = false;
            }, function(result) {
               // console.log(result);
            });
        };
//        vm.dtInstance = {};
//        vm.dtOptions = {
//            dom: 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
//            columnDefs: [
//                {
//                    //Target the actions column
//                    targets: 6,
//                    responsivePriority: 1,
//                    filterable: false,
//                    sortable: false
//                }
//            ],
//            initComplete: function()
//            {
//                var api = this.api(),
//                        searchBox = angular.element('body').find('#locations-search');
//
//                // Bind an external input as a table wide search box
//                if (searchBox.length > 0)
//                {
//                    searchBox.on('keyup', function(event)
//                    {
//                        api.search(event.target.value).draw();
//                    });
//                }
//            },
//            pagingType: 'simple',
//            lengthMenu: [10, 20, 30, 50, 100],
//            pageLength: 20,
//            scrollY: 'auto',
//            responsive: true
//        };

        // Methods
        vm.selectedItems = [];
        vm.editItem = editItem;
        vm.itemDetails = itemDetails;
        vm.deleteItemConfirm = deleteItemConfirm;
        vm.deleteSelectedItems = deleteSelectedItems;
        vm.toggleSelectItem = toggleSelectItem;
        vm.exists = msUtils.exists;
        vm.toggleInArray = msUtils.toggleInArray;

        function deleteItemConfirm(item, ev)
        {
            var confirm = $mdDialog.confirm()
                    .title('Are you sure want to delete the Location?')
                    .htmlContent('Location <b>' + item.name + '</b>' + ' will be deleted.')
                    .ariaLabel('delete location')
                    .targetEvent(ev)
                    .ok('OK')
                    .cancel('CANCEL');

            $mdDialog.show(confirm).then(function()
            {
                deleteItem(item);
                vm.selectedItems = [];

            }, function()
            {

            });
        }
        function deleteItem(item)
        {
           // console.log("item ", item)
            msApi.register('locations.deleteLocation', ['locations/' + item.id]);
            msApi.request('locations.deleteLocation@delete',
                    // SUCCESS
                            function(response)
                            {
                               // console.log("$scope.items.indexOf(item) ", $scope.displayed.indexOf(item));
                                $scope.displayed.splice($scope.displayed.indexOf(item), 1);
                                console.log(response);
                                $scope.errorMessageToast(response.message);
                                //$state.go("app.Locations");
                            },
                            function(response)
                            {
                                console.error(response.data);
                                $scope.errorMessageToast(response.data.error.code + " " + response.data.error.message);
                            }
                    );
                }


        function deleteSelectedItems(ev)
        {
            var confirm = $mdDialog.confirm()
                    .title('Are you sure want to delete the selected Locations?')
                    .htmlContent('<b>' + vm.selectedItems.length + ' selected</b>' + ' will be deleted.')
                    .ariaLabel('delete Locations')
                    .targetEvent(ev)
                    .ok('OK')
                    .cancel('CANCEL');

            $mdDialog.show(confirm).then(function()
            {

                vm.selectedItems.forEach(function(item) {
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
            $state.go('app.locations.locations-view', {id: id});
        }
        function editItem(item) {
            $state.go('app.locations.edit-location', {id: item.id});
        }

    }

})();