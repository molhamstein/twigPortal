
angular
        .module('app.categories')
        .controller('EditCategoryController', function EditCategoryController($scope, $rootScope, $state, msApi, Upload, $http, Category)
        {
            var vm = this;
           // console.log("Category ", Category);
            vm.item = Category.data;
            $scope.file1 = vm.item.photo;
            $scope.file2 = vm.item.cover;
             if (vm.item.color.charAt(0) !== '#') vm.item.color = '#' + vm.item.color;
            $scope.translate = 'CATEGORIES.';
            vm.submit = submit;
            if (vm.item.status === 'Active')
                $scope.status = true;
            else
                $scope.status = false;
            //$scope.file1 = $rootScope.defaultBackground;
            function submit() {
                if ($scope.status)
                    vm.item.status = 'Active';
                else
                    vm.item.status = 'Inactive';
                //console.log("vm.item", vm.item);
                if (vm.item.color.charAt(0) === '#')
                    vm.item.color = vm.item.color.substr(1);
                var obj = {
                    name: vm.item.name,
                    color: vm.item.color,
                    status: vm.item.status,
                    photo: $scope.file1,
                    cover: $scope.file2,
                    _method: 'PUT'
                };
               // vm.item.photo = $scope.file1;
               // vm.item.cover = $scope.file2;
               //console.log("$scope.file", $scope.file1, $scope.file2)
                if ($scope.file1 === vm.item.photo || $scope.file1 === null)
                    delete obj.photo;
                if ($scope.file2 === vm.item.cover || $scope.file2 === null)
                    delete obj.cover;
                
                $scope.upload(obj);
            }
            $scope.upload = function(obj) {
                Upload.upload({
                    url: $rootScope.twigBigRoot+"categories/" + vm.item.id,
                    method: 'POST',
                    data: obj
                }).then(function(resp) {
                    console.log(resp);
                    $scope.errorMessageToast(resp.data.message);
                    $state.go('app.categories');
                }, function(response) {
                    console.log(response);
                    $scope.errorMessageToast(response.data.error.message);
                }, function(evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.photo.name);
                });
            };
        });
