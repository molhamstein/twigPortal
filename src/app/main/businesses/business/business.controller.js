var businessess = angular.module("app.businesses");

(function (app)
{
    'use strict';

    app.controller('BusinessController',
            function ($state, $scope, msApi, Business, $mdDialog)
            {
                var vm = this;
                $scope.translate = 'BUSINESSES.';
                console.log("Business ", Business);
                vm.item = Business.data;
                vm.editItem = editItem;
                vm.deleteItemConfirm = deleteItemConfirm;
                
                
                function editItem(item) {
                    $state.go('app.businesses.edit-business', {id: item.id});
                }
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
                function deleteItem(item)
                {
                    msApi.register('businesses.deletebusiness', ['businesses/' + item.id]);
                    msApi.request('businesses.deletebusiness@delete',
                            // SUCCESS
                                    function (response)
                                    {
                                        console.log(response);
                                        $scope.errorMessageToast(response.message);
                                        $state.go("app.businesses");
                                    },
                                    function (response)
                                    {
                                        console.error(response.data);
                                        $scope.errorMessageToast(response.data.error.code + " " + response.data.error.message);
                                    }
                            );
                        }


            });
        })(businessess);