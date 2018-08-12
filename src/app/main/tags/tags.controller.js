(function()
{
    'use strict';

    angular
            .module('app.tags')
            .controller('TagsController', TagsController);

    function TagsController($state, $mdDialog, msApi, $filter, $scope, msUtils, $http)
    {
        var vm = this;
        $scope.itemsByPage = 10;
        $scope.displayed = [];
        this.callServer = function callServer(tableState) {
            vm.isLoading = true;
            console.log("tableState ", tableState);
            var pagination = tableState.pagination;
            var start = pagination.start || 0,
                    number = pagination.number || 10,
                    currentPage = Math.floor(start / number) + 1;
            msApi.request('tags.tags@get', {limit: number, page: currentPage},
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
//        vm.items = Tags.data;
//        vm.dtInstance = {};
//        vm.dtOptions = {
//            dom: 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
//            columnDefs: [
//                {
//                    // Target the id column
//                    targets: 0,
//                    width: '72px',
//                    orderable: false,
//                    className: 'select-checkbox'
//                },
//                {
//                    // Target the status column
//                    targets: 2,
//                    render: function(data, type, row, meta)
//                    {
//                        if (type === 'display')
//                        {
//                            if (parseInt(data) === 1)
//                            {
//                                return '<i class="icon-checkbox-marked-circle green-500-fg"></i>';
//                            }
//
//                            return '<i class="icon-cancel red-500-fg"></i>';
//                        }
//
//                        if (type === 'filter')
//                        {
//                            if (data)
//                            {
//                                return '1';
//                            }
//
//                            return '0';
//                        }
//
//                        return data;
//                    }
//                },
//                {
//                    // Target the actions column
//                    targets: 4,
//                    responsivePriority: 1,
//                    filterable: false,
//                    sortable: false
//                }
//            ],
//            initComplete: function()
//            {
//                var api = this.api(),
//                        searchBox = angular.element('body').find('#tags-search');
//
//                // Bind an external input as a table wide search box
//                if (searchBox.length > 0)
//                {
//                    searchBox.on('keyup', function(event)
//                    {
//
//                        api.search(event.target.value).draw();
//                    });
//                }
//            },
//            select: {
//                style: 'os',
//                selector: 'td:first-child'
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
        vm.deselectContacts = deselectContacts;
        vm.selectAllContacts = selectAllContacts;
        vm.exists = msUtils.exists;
        vm.toggleInArray = msUtils.toggleInArray;


        function deleteItemConfirm(contact, ev)
        {
            var confirm = $mdDialog.confirm()
                    .title('Are you sure want to delete the tag?')
                    .htmlContent('<b>' + contact.name + '</b>' + ' will be deleted.')
                    .ariaLabel('delete tag')
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
            msApi.register('tags.deletetag', ['tags/' + item.id]);
            msApi.request('tags.deletetag@delete',
                    // SUCCESS
                            function(response)
                            {
                                //console.log("vm.items.indexOf(item) ", vm.items.indexOf(item));
                                $scope.displayed.splice($scope.displayed.indexOf(item), 1);
                                // console.log("vm.items ", $scope.items);
                                console.log(response);
                                $scope.errorMessageToast(response.message);
                                $state.go("app.tags");
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
                    .title('Are you sure want to delete the selected tags?')
                    .htmlContent('<b>' + vm.selectedItems.length + ' selected</b>' + ' will be deleted.')
                    .ariaLabel('delete tags')
                    .targetEvent(ev)
                    .ok('OK')
                    .cancel('CANCEL');

            $mdDialog.show(confirm).then(function()
            {

                vm.selectedItems.forEach(function(contact)
                {
                    deleteItem(contact);
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


        function deselectContacts()
        {
            vm.selectedItems = [];
        }
        function selectAllContacts()
        {
            vm.selectedItems = vm.tags;
        }
        function itemDetails(id) {
            $state.go('app.tags.tags-view', {id: id});
        }

        function editItem(item) {
            console.log("item.id ", item.id);
            $state.go('app.tags.edit-tag', {id: item.id});
        }
    }
})();