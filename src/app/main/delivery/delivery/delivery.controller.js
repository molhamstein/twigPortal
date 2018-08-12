var delivery = angular.module("app.delivery");

(function (app)
{
    'use strict';

    app.controller('DeliveryController',
            function ($state, $scope, msApi, Delivery, $mdDialog)
            {
                var vm = this;
                $scope.translate = 'DELIVERY.';
                console.log("Delivery ", Delivery);
                vm.item = Delivery.data;
                vm.editItem = editItem;
                vm.deleteItemConfirm = deleteItemConfirm;
                
                
                function editItem(item) {
                    $state.go('app.delivery.edit-delivery', {id: item.id});
                }
                function deleteItemConfirm(item, ev)
                {
                    var confirm = $mdDialog.confirm()
                            .title('Are you sure want to delete the delivery zone?')
                            .htmlContent('Delivery <b>' + item.name + '</b>' + ' will be deleted.')
                            .ariaLabel('delete delivery')
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
                     msApi.register('delivery_zones.deletedelivery_zones', ['delivery_zones/' + item.id]);
                    msApi.request('delivery_zones.deletedelivery_zones@delete',
                            // SUCCESS
                                    function (response)
                                    {
                                        console.log(response);
                                        $scope.errorMessageToast(response.message);
                                        $state.go("app.delivery");
                                    },
                                    function (response)
                                    {
                                        console.error(response.data);
                                        $scope.errorMessageToast(response.data.error.code + " " + response.data.error.message);
                                    }
                            );
                        }


            });
        })(delivery);