angular
        .module('app.twigs')
        .controller('TwigController',
                function(Twig, $state, $scope, $mdDialog, msApi)
                {
                    var vm = this;
                    // Data
                    console.log("Twig ", Twig.data);
                    $scope.translate = 'TWIGS.';
                    vm.item = Twig.data;
                    if (vm.item.btns.length !== 0)
                        switch (vm.item.btns[0].type) {
                            case 'OPEN_URL':
                                {
                                    vm.item.btns[0].icon = 'launch';
                                    vm.item.btns[0].color = '#ff3399';
                                    break;
                                }
                            case 'CALL':
                                {
                                    vm.item.btns[0].icon = 'phone';
                                    vm.item.btns[0].color = '#ffff33';
                                    break;
                                }
                            case 'ADD_TO_CART':
                                {
                                    vm.item.btns[0].icon = 'add_shopping_cart';
                                    vm.item.btns[0].color = '#ff3385';
                                    break;
                                }
                            case 'EXPRESS_INTEREST':
                                {
                                    vm.item.btns[0].icon = 'thumb_up';
                                    vm.item.btns[0].color = '#3366ff';
                                    break;
                                }
                        }
                    vm.item.price = parseFloat(vm.item.price);
                    vm.item.quality = parseFloat(vm.item.quality);
                    vm.item.service = parseFloat(vm.item.service);
                    vm.item.ambiance = parseFloat(vm.item.ambiance);
                    vm.item.reasonable_price = parseFloat(vm.item.reasonable_price);
                    vm.item.is_exceptional = parseFloat(vm.item.is_exceptional);
                    if (vm.item.is_exceptional === 1)
                        vm.item.is_exceptional = 'Yes';
                    else
                        vm.item.is_exceptional = 'No';
                    vm.editItem = editItem;
                    vm.deleteItemConfirm = deleteItemConfirm;
                    function editItem(item) {
                        $state.go('app.twigs.edit-twig', {id: item.id});
                    }
                    function deleteItemConfirm(item, ev)
                    {
                        var confirm = $mdDialog.confirm()
                                .title('Are you sure want to delete the twig?')
                                .htmlContent('Twig <b>' + item.id + '</b>' + ' will be deleted.')
                                .ariaLabel('delete twig')
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
                        msApi.register('twigs.deletetwig', ['twigs/' + item.id]);
                        msApi.request('twigs.deletetwig@delete',
                                // SUCCESS
                                        function(response)
                                        {
                                            console.log(response);
                                            $scope.errorMessageToast(response.message);
                                            $state.go("app.twigs");
                                        },
                                        function(response)
                                        {
                                            console.error(response.data);
                                            $scope.errorMessageToast(response.data.error.code + " " + response.data.error.message);
                                        }
                                );
                            }


                });



