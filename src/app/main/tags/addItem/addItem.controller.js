
angular
        .module('app.tags')
        .controller('AddTagController', function($scope, $rootScope, $state, msApi, Upload, $http)
        {
            var vm = this;
            vm.item = {};
            $scope.translate = 'TAGS.';
            vm.submit = submit;
            function submit() {
                if (vm.item.is_featured === true)
                    vm.item.is_featured = '1';
                else
                    vm.item.is_featured = '0';
                msApi.request('tags.tags@save', {
                    name: vm.item.name,
                    is_featured: vm.item.is_featured,
                    weight: vm.item.weight
                },
                // SUCCESS
                function(response)
                {
                    console.log(response.data);
                    $scope.errorMessageToast("Tag has been added succesfully");
                    $state.go('app.tags');
                },
                        // ERROR
                                function(response)
                                {
                                    console.error(response.data);
                                    $scope.errorMessageToast(response.data.message);

                                }
                        );
                    }

        });
