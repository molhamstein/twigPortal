(function ()
{
    'use strict';

    angular
            .module('app.clicks')
            .controller('ClicksController', ClicksController)

    function ClicksController( $mdDialog, msApi,  $scope,  $http)
    {
        var vm = this;       
        $scope.itemsByPage = 10;
        $scope.displayed = [];
        $scope.result = [];

        this.callServer = function callServer(tableState) {
            vm.isLoading = true;
            $scope.clicks_csv = [];
            console.log("tableState ", tableState);
            $scope.tableState = tableState;
            var pagination = tableState.pagination;
            var start = pagination.start || 0,
                    number = pagination.number || 10,
                    currentPage = Math.floor(start / number) + 1;
            msApi.request('clicks.clicks@get', {limit: number, page: currentPage},
            function (res) {
                console.log(res);
                $scope.total_pages = res.paginator.total_count;
                tableState.pagination.numberOfPages = res.paginator.total_pages;
                $scope.displayed = res.data;
                $scope.clicks_csv = $scope.displayed.map(function (item) {
                    return {
                        user: item.user,  
                        business:item.twig_btn.business ? item.twig_btn.business.name : "",                        
                        title: item.twig_btn.title,
                        action: item.twig_btn.action,
                        hint: item.hint
                    };
                });
                vm.isLoading = false;
            }, function (result) {
                console.log(result);
            })
        };

        $scope.csvFilenameDialog = function (ev) {           
            $mdDialog.show({
                scope:$scope,
                preserveScope: true,              
                template: "<md-dialog>" +
                        "<md-dialog-content>" +
                        "<md-input-container>" +
                        "<label>File Name</label>" +
                        "<input ng-model='fileName'>" +
                        "</md-input-container>" +
                        "</md-dialog-content>" +
                        "<md-dialog-actions layout='row'>" +
                        "<md-button ng-click='export(fileName)' type='button' ng-csv='clicks_csv' csv-header='getHeader()'  filename='{{fileName}}.csv'>Export as CSV</md-button>" +
                        "<md-button ng-click='closeDialog()'>Cancel</md-button>" +
                        "</md-dialog-actions>" +
                        "</md-dialog>",
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen,
                controller: function DialogController($scope, $mdDialog) {                    
                    $scope.export = function (fileName) {
                        $scope.errorMessageToast("The file " + fileName + " has exported successfully");         
                        $mdDialog.hide();
                    };
                    $scope.closeDialog = function () {
                        $mdDialog.hide();
                    };
                     $scope.getHeader = function () {return ["user","business", "title","action", "hint"]};
                }
            })
                    .then(function (answer) {
                                      
                    }, function () {

                    });

            
        };


    } 
})();