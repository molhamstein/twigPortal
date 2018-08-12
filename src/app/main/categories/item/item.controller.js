angular
        .module('app.categories')
        .controller('CategoryController',
                function CategoryController(Category,msApi, $state, $mdDialog, $rootScope, $scope)
                {
                    var vm = this;
                    //console.log("Category ", Category);
                    vm.item = Category.data;
                     if (vm.item.color.charAt(0) !== '#') vm.item.color = '#'+vm.item.color;
                    $scope.translate = 'CATEGORIES.';
                    vm.editItem = editItem;
                    vm.deleteItemConfirm = deleteItemConfirm;                  
                    function editItem(item){
                       // console.log("item ", item);
                        $state.go('app.categories.edit-category', {id: item.id});
                    };                   

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
                                            //$scope.items.splice($scope.items.indexOf(item), 1);
                                      
                                            // console.log("$scope.items ", $scope.items);
                                            console.log(response);
                                            $state.go('app.categories');
                                            $scope.errorMessageToast(response.message);

                                        },
                                        function(response)
                                        {
                                            console.error(response.data);
                                            $scope.errorMessageToast(response.data.error.code + " " + response.data.error.message);
                                        }
                                );
                            }


                });



