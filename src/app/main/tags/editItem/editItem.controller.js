
angular
        .module('app.tags')
        .controller('EditTagController',
                function($scope, $state, Tag, msApi, $http, Upload, $rootScope)
                {
                    var vm = this;
                    console.log('Tag', Tag);
                    vm.item = Tag.data;
                    $scope.translate = 'TAGS.';
                    if (vm.item.is_featured === 1)
                        vm.item.is_featured = true;
                    else
                        vm.item.is_featured = false;
                    vm.item.weight = parseFloat(vm.item.weight);
                    vm.submit = submit;
                    function submit() {
                        if (vm.item.is_featured === true)
                            vm.item.is_featured = 1;
                        else
                            vm.item.is_featured = 0;
                        $http.post($rootScope.twigBigRoot + "tags/" + vm.item.id,
                                {
                                    name: vm.item.name,
                                    is_featured: vm.item.is_featured,
                                    weight: vm.item.weight,
                                    _method: 'PUT'
                                })
                                .success(function(response) {
                                    console.log(response);
                                    $scope.errorMessageToast(response.message);
                                    $state.go("app.tags");
                                })
                                .error(function(response) {
                                    console.error(response);
                                    $scope.errorMessageToast(response.error.message);

                                });
                    }
                });
