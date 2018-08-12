angular
        .module('app.users')
        .controller('UserController',
                function(User, $state, $scope, $rootScope, $mdDialog,Upload, msApi)
                {
                    var vm = this;
                    console.log("User ", User.data);
                    vm.item = User.data;
                    $scope.translate = 'USERS.';
                    vm.editItem = editItem;
                    vm.deleteItemConfirm = deleteItemConfirm;
                    function editItem(item) {
                        $state.go('app.users.edit-user', {id: item.id});
                    }

                    function deleteItemConfirm(contact, ev)
                    {
                        var confirm = $mdDialog.confirm()
                                .title('Are you sure want to de-activate the user?')
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
                            $state.go('app.users');
                            //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                        }, function(response) {
                            console.log(response);
                            // $scope.errorMessageToast(msg);
                            // console.error(response.data);
                        });
                        //console.log("vm.items.indexOf(item) ", vm.items.indexOf(item));
                        // 
                    }

                });



