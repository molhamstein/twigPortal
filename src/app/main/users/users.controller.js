(function()
{
    'use strict';

    angular
            .module('app.users')
            .controller('UsersController', UsersController)
    /** @ngInject */
    function UsersController($state, $mdDialog, msApi, $scope, $filter, msUtils, Upload, $rootScope)
    {
        
        //var mc = this;
        var vm = this;
//        this.displayed = [];
//
//        this.callServer = function callServer(tableState) {
//            console.log("ssss")
//            vm.isLoading = true;
//
//            var pagination = tableState.pagination;
//
//            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
//            var number = pagination.number || 10;  // Number of entries showed per page.
//            console.log("start, start + number ", start, start + number);
//            var currentPage = Math.floor(start / number) + 1;
//            msApi.request('users.users@get', {limit: number, page: currentPage},
//            function(res) {
//                
//                var filtered = tableState.search.predicateObject ? $filter('filter')(res.data, tableState.search.predicateObject) : res.data;
//
//                if (tableState.sort.predicate) {
//                    filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
//                }
//
//                var result = filtered.slice(start, start + number);
//
//                vm.displayed = result;
//                tableState.pagination.numberOfPages = res.paginator.total_pages;
//                vm.isLoading = false;
//            });
//        };

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
            msApi.request('users.users@get', {limit: number, page: currentPage},
            function(res) {
                console.log(res);
                $scope.total_pages = res.paginator.total_count;
                tableState.pagination.numberOfPages = res.paginator.total_pages;

//                 var filtered = tableState.search.predicateObject ? $filter('filter')(res.data, tableState.search.predicateObject) : res.data;
//
//                if (tableState.sort.predicate) {
//                    filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
//                }
//
//                var result = filtered.slice(start, start + number);

                $scope.displayed = res.data;

                vm.isLoading = false;

            }, function(result) {
                console.log(result);
            });
        };




        // Methods
        vm.selectedItems = [];
        vm.editItem = editItem;
        vm.addItem = addItem;
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
                    .title('Are you sure want to delete the user?')
                    .htmlContent('<b>' + contact.name + '</b>' + ' will be de-activated.')
                    .ariaLabel('delete user')
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


        $scope.callServer = function(tableState) {
            vm.isLoading = true;
            console.log("tableState ", tableState);
            var pagination = tableState.pagination;
            var start = pagination.start || 0,
                    number = pagination.number || 10,
                    currentPage = Math.floor(start / number) + 1;
            msApi.request('users.users@get', {limit: number, page: currentPage},
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
        function deleteItem(item)
        {
            Upload.upload({
                url: $rootScope.twigBigRoot + 'users/' + item.id,
                method: 'POST',
                data: {
                    name: item.name,
                    status: "Inactive",
                    _method: 'PUT'}
            }).then(function(resp) {
                console.log(resp);
                $scope.errorMessageToast("User has been de-activated succesfully");
                $scope.callServer($scope.tableState);
                //$state.go('app.users');
                //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            }, function(response) {
                console.log(response);
                // $scope.errorMessageToast(msg);
                // console.error(response.data);
            });
            //console.log("vm.items.indexOf(item) ", vm.items.indexOf(item));
            // 
        }

        function deleteSelectedItems(ev)
        {
            var confirm = $mdDialog.confirm()
                    .title('Are you sure want to de-activate the selected users?')
                    .htmlContent('<b>' + vm.selectedItems.length + ' selected</b>' + ' will be de-activated.')
                    .ariaLabel('de-activate users')
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
            vm.selectedItems = vm.users;
        }
        function itemDetails(id) {
            $state.go('app.users.users-view', {id: id});
        }
        function addItem(ev) {
            //$state.go('app.users.add-user');
        }
        function editItem(ev, item) {
            $state.go('app.users.edit-user', {id: item.id});
        }
    }
})();