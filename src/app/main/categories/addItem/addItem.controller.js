
angular
        .module('app.categories')
        .controller('AddCategoryController', function AddCategoryController($scope, $rootScope, $state, msApi, Upload, $http)
        {
            var vm = this;
            vm.item = {};
            $scope.translate = 'CATEGORIES.';
            $scope.status = true;
            vm.submit = submit;
            //$scope.file1 = $rootScope.defaultBackground;
            function submit() {
//                if ($scope.file1 === $rootScope.defaultBackground) {
//                    $scope.file1 = "";
//                }
                if ($scope.status)
                    vm.item.status = 'Active';
                else
                    vm.item.status = 'Inactive';
               // console.log("vm.item", vm.item);
                $scope.upload($scope.file1, $scope.file2);
            }
            $scope.upload = function(file, file2) {
                Upload.upload({
                    url: $rootScope.twigBigRoot + "categories",
                    method: 'POST',
                    data: {
                        name: vm.item.name,
                        color: vm.item.color,
                        status: vm.item.status,
                        photo: file,
                        cover: file2}
                }).then(function(resp) {
                    console.log(resp);
                    $scope.errorMessageToast(resp.data.message);
                    $state.go('app.categories');
                }, function(response) {
                    console.log(response);
                    $scope.errorMessageToast(response.data.error.message);
                }, function(evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.photo.name);
                });
            };
        });
