(function ()
{
    'use strict';

    angular
            .module('app.logs')
            .controller('LogsController', LogsController);

    function LogsController($state, $mdDialog, msApi, $filter, $scope, msUtils, $http)
    {
        var vm = this;
        $scope.action_filter = "ACTION_BUTTON_PRESSED";
        $scope.itemsByPage = 10;
        $scope.displayed = [];
        $scope.result = [];
//        function userExists(action) {
//            return $scope.result.some(function (el) {
//                return el === action;
//            });
//        }
//        ;
//        function addUser(action) {
//            if (userExists(action)) {
//                return false;
//            }
//            $scope.result.push(action);
//            return true;
//        }

        this.callServer = function callServer(tableState) {
            vm.isLoading = true;
            console.log("tableState ", tableState);
            $scope.tableState = tableState;
            var pagination = tableState.pagination;
            var start = pagination.start || 0,
                    number = pagination.number || 10,
                    currentPage = Math.floor(start / number) + 1;
            msApi.request('logs.logs@get', {limit: number, page: currentPage, action:$scope.action_filter},
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
        $scope.callServer = function (tableState) {
            vm.isLoading = true;
            console.log("tableState ", tableState);
            $scope.tableState = tableState;
            var pagination = tableState.pagination;
            var start = pagination.start || 0,
                    number = pagination.number || 10,
                    currentPage = Math.floor(start / number) + 1;
            msApi.request('logs.logs@get', {limit: number, page: currentPage, action:$scope.action_filter},
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
        
        $scope.onChangeFilter = function(){
            $scope.callServer($scope.tableState);
        };



        
//        for (var i = 2; i <= 342; i++) {
//            msApi.request('logs.logs@get', {limit: 10, page: i},
//            function (res) {
//                console.log("logs.logs@get" , res.data);
//                for (var j = 0; j < res.data.length; j++) {
//                    console.log("res.data[j] ", res.data[j]);
//                    if(res.data[j] )addUser(res.data[j].action);
//                }              
//            }, function (result) {
//                console.log(result);
//            });
//            console.log("$scope.result ", $scope.result);
//        }
//        console.log("$scope.result ", $scope.result);
//        ;
        

    }
})();