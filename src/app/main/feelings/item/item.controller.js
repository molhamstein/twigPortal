angular.module('app.feelings')
        .controller('feelingController',
                function(Feeling, $state, $scope, $mdDialog, msApi) {
                    var vm = this;
                   // console.log("feeling ", Feeling.data);
                    $scope.translate = 'FEELINGS.';
                    vm.item = Feeling.data;
                   
                    vm.editItem = editItem;
                    vm.deleteItemConfirm = deleteItemConfirm;
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
                                            console.log(response);
                                            $scope.errorMessageToast(response.message);
                                            $state.go("app.feelings");
                                        },
                                        function(response)
                                        {
                                            console.error(response.data);
                                            $scope.errorMessageToast(response.data.error.code + " " + response.data.error.message);
                                        }
                                );
                            }
                    function editItem(item) {
                        $state.go('app.feelings.edit-feeling', {id: item.id});
                    }

                });


