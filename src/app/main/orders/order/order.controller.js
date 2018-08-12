var orders = angular.module("app.orders");

(function (app)
{
    'use strict';

    app.controller('OrderController',
            function ($state, $scope, msApi, Order, $mdDialog)
            {
                var vm = this;
                $scope.translate = 'ORDERS.';
                console.log("ORDERS ", Order.data);
                vm.item = Order.data;
                vm.editItem = editItem;
                vm.deleteItemConfirm = deleteItemConfirm;
                
                
                function editItem(item) {
                    $state.go('app.orders.edit-order', {id: item.id});
                }
                function deleteItemConfirm(item, ev)
                {
                    var confirm = $mdDialog.confirm()
                            .title('Are you sure want to delete the order?')
                            .htmlContent('The order will be deleted.')
                            .ariaLabel('delete order')
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
                     msApi.register('orders.deleteorder', ['orders/' + item.id]);
                    msApi.request('orders.deleteorder@delete',
                            // SUCCESS
                                    function (response)
                                    {
                                        console.log(response);
                                        $scope.errorMessageToast(response.message);
                                        $state.go("app.orders");
                                    },
                                    function (response)
                                    {
                                        console.error(response.data);
                                        $scope.errorMessageToast(response.data.error.code + " " + response.data.error.message);
                                    }
                            );
                        }


            });
        })(orders);