(function()
{
    'use strict';

    angular
            .module('app.feelings')
            .controller('FeelingsController', FeelingsController);

    /** @ngInject */
    function FeelingsController($state, $mdDialog, msUtils,$filter, $scope, msApi)
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
            msApi.request('feelings.feelings@get', {limit: number, page: currentPage},
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

//        vm.items = Feelings.data;    
//        console.log("vm.items ", vm.items);
//        vm.dtInstance = {};
//        vm.dtOptions = {
//            dom: 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
//            columnDefs: [
//                {
//                    targets:3,
//                    render    : function (data, type)
//                    {
//                        if ( type === 'display' )
//                        {                           
//                            return "<div style='background-color:"+data+"; width:20px;height:20px'></div>";
//                        }
//
//                        if ( type === 'filter' )
//                        {
//                            if ( data )
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
//                    // Target the quantity column
//                    targets: 5,
//                    render : function (data, type)
//                    {
//                        if ( type === 'display' )
//                        {
//                           
//                            if ( parseInt(data) === 0 )
//                            {
//                                return '<div class="quantity-indicator md-red-500-bg"></div><div></div>';
//                            }
//                            else if ( parseInt(data) === 1 )
//                            {
//                                return '<div class="quantity-indicator md-green-600-bg"></div><div></div>';
//                            }                           
//                        }
//                        return data;
//                    }
//                },
//                  {
//                    // Target the quantity column
//                    targets: 6,
//                    render : function (data, type)
//                    {
//                        if ( type === 'display' )
//                        {
//                           
//                            if ( parseInt(data) === 0 )
//                            {
//                                return '<div class="quantity-indicator md-red-500-bg"></div><div></div>';
//                            }
//                            else if ( parseInt(data) === 1 )
//                            {
//                                return '<div class="quantity-indicator md-green-600-bg"></div><div></div>';
//                            }                           
//                        }
//                        return data;
//                    }
//                },
//                {
//                    //Target the actions column
//                    targets: 8,
//                    responsivePriority: 1,
//                    filterable: false,
//                    sortable: false
//                }
//            ],
//            initComplete: function()
//            {
//                var api = this.api(),
//                        searchBox = angular.element('body').find('#feelings-search');
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
//            pageLength: 10,
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
                    .title('Are you sure want to delete the feeling?')
                    .htmlContent('Feeling <b>' + item.name + '</b>' + ' will be deleted.')
                    .ariaLabel('delete feeling')
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
            msApi.register('feelings.deletefeeling', ['feelings/' + item.id]);
            msApi.request('feelings.deletefeeling@delete',
                    // SUCCESS
                            function(response)
                            {
                                //console.log("vm.items.indexOf(item) ", $scope.displayed.indexOf(item));
                                $scope.displayed.splice($scope.displayed.indexOf(item), 1);

                                console.log(response);
                                $scope.errorMessageToast(response.data.message);
                                $state.go("app.feelings");
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
                    .title('Are you sure want to delete the selected feelings?')
                    .htmlContent('<b>' + vm.selectedItems.length + ' selected</b>' + ' will be deleted.')
                    .ariaLabel('delete feelings')
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
            $state.go('app.feelings.feelings-view', {id: id});
        }
        function editItem(item) {
            $state.go('app.feelings.edit-feeling', {id: item.id});
        }

    }
})();