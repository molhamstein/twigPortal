
angular
        .module('app.feelings')
        .controller('EditFeelingController', function($state, $scope, msApi, Feeling, Categories, $element, Upload, $rootScope)
        {         

            var vm = this;
            $scope.translate = 'FEELINGS.';
            vm.submit = submit;
            vm.item = Feeling.data;
            console.log("vm.item ", vm.item);
             if (vm.item.color.charAt(0) !== '#')
                    vm.item.color = '#'+vm.item.color;
            $scope.categories = Categories.data;
//            var categories = [];
//                for (var i = 0; i < vm.item.categories.length; i++) {
//                    categories[i] = vm.item.categories[i].id;
//                }
//            vm.item.categories = categories;
            //$scope.categories = [{id: 1, name: "Administrator"}, {id: 2, name: "Student"}];
            $scope.searchTerm;
            $scope.clearSearchTerm = function() {
                $scope.searchTerm = '';
            };
            // The md-select directive eats keydown events for some quick select
            // logic. Since we have a search input here, we don't need that logic.
            $element.find('input').on('keydown', function(ev) {
                ev.stopPropagation();
            });

            $scope.file1 = vm.item.icon;
           // console.log("vm.item ", vm.item);
            if (vm.item.visible_home === 1)
                vm.item.visible_home = true;
            else
                vm.item.visible_home = false;
            if (vm.item.visible_twig === 1)
                vm.item.visible_twig = true;
            else
                vm.item.visible_twig = false;
            function submit() {
                console.log("save", vm.item);
                //if ($scope.file1.$valid && $scope.file1) {
                //  console.log("$scope.file ", $scope.file1);
                if (vm.item.visible_home === true)
                    vm.item.visible_home = 1;
                else
                    vm.item.visible_home = 0;
                if (vm.item.visible_twig === true)
                    vm.item.visible_twig = 1;
                else
                    vm.item.visible_twig = 0;
               // console.log("$scope.file1 ", $scope.file1);
              

                var categories = [];
                if (vm.item.categories.length !== 0)
                    for (var i = 0; i < vm.item.categories.length; i++) {
                        categories[i] = vm.item.categories[i].id;
                    }
                if (vm.item.color.charAt(0) === '#')
                    vm.item.color = vm.item.color.substr(1);
                var obj = {
                    categories: categories,
                        icon: $scope.file1,
                        name: vm.item.name,
                        color: vm.item.color,
                        visible_home: vm.item.visible_home,
                        visible_twig: vm.item.visible_twig,
                        _method: 'PUT'
                };
                 if ($scope.file1 === vm.item.icon || $scope.file1 === null)
                    delete obj.icon;
                vm.upload(obj);
                // }
            }
            ;
            vm.upload = function(obj) {               
                console.log("upload ", obj);
                Upload.upload({
                    url: $rootScope.twigBigRoot+"feelings/" + vm.item.id,
                    method: 'POST',
                    data:obj
                }).then(function(resp) {
                    console.log(resp);
                   // console.log('Success ' + resp);
                    $scope.errorMessageToast(resp.data.message);
                    $state.go("app.feelings");
                }, function(resp) {
                    console.log(resp);
                   // console.log('Error status: ', resp);
                    $scope.errorMessageToast(resp.data.error.message);
                }, function(evt) {
                    //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.icon.name);
                    // $scope.errorMessageToast('progress: ' + progressPercentage + '% ' + evt.config.data.icon.name);
                });
            };
        });


