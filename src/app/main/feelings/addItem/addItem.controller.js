
angular
        .module('app.feelings')
        .controller('AddFeelingController',
                function($state, $scope, msApi, Categories, $element, Upload, $rootScope)
                {
                    var vm = this;
                    $scope.translate = 'FEELINGS.';
                    vm.submit = submit;
                    vm.categories = Categories.data;
                    $scope.searchTerm;
                    $scope.clearSearchTerm = function() {
                        $scope.searchTerm = '';
                    };
                    // The md-select directive eats keydown events for some quick select
                    // logic. Since we have a search input here, we don't need that logic.
                    $element.find('input').on('keydown', function(ev) {
                        ev.stopPropagation();
                    });
                    vm.item = {
                        categoryies: [],
                        name: "",
                        color: "",
                        icon: "",
                        visible_home: 0,
                        visible_twig: 0
                    };

                    function submit() {

                       // console.log("save", vm.item);
                        if (vm.item.color.charAt(0) === '#')
                            vm.item.color = vm.item.color.substr(1);
                       // console.log("vm.item.visible_home ", vm.item.visible_home);
                        if (vm.item.visible_home === true)
                            vm.item.visible_home = 1;
                        else
                            vm.item.visible_home = 0;
                        if (vm.item.visible_twig === true)
                            vm.item.visible_twig = 1;
                        else
                            vm.item.visible_twig = 0;

                        var categories = [];
                        if (vm.item.categories && vm.item.categories.length !== 0)
                            for (var i = 0; i < vm.item.categories.length; i++) {
                                categories[i] = vm.item.categories[i].id;
                            }
                        // vm.item.color = vm.item.color.substr(1);
                        vm.upload($scope.file1, categories);

                    }
                    ;
                    vm.upload = function(file, categories) {
                       // console.log("upload ", file);
                        Upload.upload({
                            url: $rootScope.twigBigRoot+"feelings",
                            method: 'POST',
                            data: {
                                categories: categories,
                                icon: file,
                                name: vm.item.name,
                                color: vm.item.color,
                                visible_home: vm.item.visible_home,
                                visible_twig: vm.item.visible_twig
                            }
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
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.icon.name);
                            // $scope.errorMessageToast('progress: ' + progressPercentage + '% ' + evt.config.data.icon.name);
                        });
                    };

                });
