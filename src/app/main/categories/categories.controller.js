(function()
{
    'use strict';

    angular
            .module('app.categories')
            .controller('CategoriesController', CategoriesController);

    /** @ngInject */
    function CategoriesController($state, $mdDialog, msApi,$filter, $scope)
    {
        var vm = this;
        $scope.itemsByPage = 10;
        $scope.displayed = [];
        this.callServer = function callServer(tableState) {
            vm.isLoading = true;
            //console.log("tableState ", tableState);
            var pagination = tableState.pagination;
            var start = pagination.start || 0,
                    number = pagination.number || 10,
                    currentPage = Math.floor(start / number) + 1;
            msApi.request('categories.categories@get', {limit: number, page: currentPage,'all':'yes'},
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
//        vm.items = Categories.data;
//        vm.dtInstance = {};
//        vm.dtOptions = {
//            dom: 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
//            columnDefs: [
//                {
//                    targets: 2,
//                    render: function(data, type)
//                    {
//                        if (type === 'display')
//                        {
//                            return "<div style='background-color:#" + data + "; width:20px;height:20px'></div>";
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
//                    // Target the status column
//                    targets: 5,
//                    render: function(data, type, row, meta)
//                    {
//                        
//
//                        if (type === 'display')
//                        {
//                            if (data === 'Active')
//                            {
//                                return '<i class="icon-checkbox-marked-circle green-500-fg"></i>';
//                                //return '<i class="material-icons" style="color:green">&#xE876;</i>';
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
//                        searchBox = angular.element('body').find('#categories-search');
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
        vm.editItem = editItem;
        vm.deleteItemConfirm = deleteItemConfirm;
        vm.itemDetails = itemDetails;
        function editItem(item)
        {
            //console.log("item ", item);
            $state.go('app.categories.edit-category', {id: item.id});
        }
        function itemDetails(item)
        {
           // console.log("item ", item);
            $state.go('app.categories.categories-view', {id: item.id});
        }

        function deleteItemConfirm(item, ev)
        {
            var confirm = $mdDialog.confirm()
                    .title('Are you sure want to delete the category?')
                    .htmlContent('<b>' + item.name + '</b>' + ' will be deleted.')
                    .ariaLabel('delete category')
                    .targetEvent(ev)
                    .ok('OK')
                    .cancel('CANCEL');

            $mdDialog.show(confirm).then(function()
            {
                deleteItem(item);
                //vm.selectedContacts = [];

            }, function()
            {

            });
        }

        /**
         * Delete Contact
         */
        function deleteItem(item)
        {
            msApi.register('categories.deletecategory', ['categories/' + item.id]);
            msApi.request('categories.deletecategory@delete',
                    // SUCCESS
                            function(response)
                            {
                                //console.log("$scope.items.indexOf(item) ", $scope.items.indexOf(item));
                                $scope.displayed.splice($scope.displayed.indexOf(item), 1);

                                // console.log("$scope.items ", $scope.items);
                                console.log(response);
                                $scope.errorMessageToast(response.message);

                            },
                            function(response)
                            {
                                console.error(response.data);
                                $scope.errorMessageToast(response.data.error.code + " " + response.data.error.message);
                            }
                    );
                }



    }
})();