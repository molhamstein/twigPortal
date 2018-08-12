
angular
        .module('app.twigs')
        .controller('EditTwigController', function ($state, $element, $mdDialog, Upload, $scope, msApi, Tags, $timeout, Products, Feelings, $http, Categories, $q, $rootScope, Twig)
        {
            var vm = this;
            $scope.translate = 'TWIGS.';
            vm.submit = submit;

            vm.selectedItem = null;
            vm.searchText = null;
            vm.selectedItem2 = null;
            vm.searchText2 = null;
            vm.transformChip = transformChip;
            vm.querySearch = querySearch;
            vm.products = Products.data;
            vm.tags = Tags.data;


            function querySearch(query, group) {
                var results = query ? group.filter(createFilterFor(query)) : [];
                return results;
            }

            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(g) {
                    return (g.name.toLowerCase().indexOf(lowercaseQuery) === 0);
                };

            }
            function transformChip(chip) {
                // If it is an object, it's already a known chip
                if (angular.isObject(chip)) {
                    return chip;
                }

                // Otherwise, create a new one
                return {name: chip, type: 'new'};
            }


            //self.selectedVegetables = [];

            // vm.users = loadAll();
//            vm.selectedItem = null;
//            vm.searchText = null;
//            vm.querySearch = querySearch;

            vm.categories = Categories.data;
            // vm.locations = Locations.data;
            $scope.feelings = Feelings.data;
            $scope.searchTerm2;
            $scope.clearSearchTerm2 = function () {
                $scope.searchTerm2 = '';
            };
            // The md-select directive eats keydown events for some quick select
            // logic. Since we have a search input here, we don't need that logic.
            $element.find('input').on('keydown', function (ev) {
                ev.stopPropagation();
            });

            vm.item = Twig.data;
            console.log("vm.item ", vm.item);
            vm.item.price = parseFloat(vm.item.price);
            if (vm.item.nos !== '')
                vm.item.nos = parseFloat(vm.item.nos);
            if (vm.item.yeses !== '')
                vm.item.yeses = parseFloat(vm.item.yeses);
            vm.item.quality = parseFloat(vm.item.quality);
            vm.item.service = parseFloat(vm.item.service);
            vm.item.ambiance = parseFloat(vm.item.ambiance);
            vm.item.reasonable_price = parseFloat(vm.item.reasonable_price);
            vm.item.is_exceptional = parseInt(vm.item.is_exceptional);
            // console.log("vm.item.btns[0].type ", vm.item.btns[0].type);
            if (vm.item.location && vm.item.location !== "") {
                $scope.locationBusiness = 'location';
                $scope.selectedItem3 = vm.item.location;
                $scope.searchText3 = vm.item.location.name;
            } else {
                $scope.locationBusiness = 'business';
                $scope.searchBusiness = vm.item.business.name;
                $scope.selectedBusiness = vm.item.business;

//                msApi.register('business.view', ['businesses/' + vm.item.business_id, {}, 'get']);
//                msApi.request('business.view@get', {}, function (response)
//                {
//                    console.log(response);
//
//                },
//                        function (response)
//                        {
//                            console.log(response);
//                        });
            }

            $scope.selectedBusinessChange = function (item) {
                if (item)
                    //vm.item.business_id = item.id;
                    $scope.selectedBusiness = item;
            };
            $scope.onChangeBusiness = function (keyword) {
                if (keyword && keyword !== null && keyword !== '') {
                    var deferred = $q.defer();
                    msApi.request('businesses.businesses@get', {
                        keyword: keyword
                    },
                    function (response) {
                        console.log("response businesses", response);
                        deferred.resolve(response.data);
                    }, function (response) {
                        deferred.reject();
                        return [];
                    });
                    return deferred.promise;
                }
            };

            //===========================//

            $scope.onChangeAddress = function (keyword) {
                if (keyword && keyword !== null && keyword !== '') {
                    var deferred = $q.defer();
                    msApi.request('locations.locations@get', {
                        keyword: keyword
                    },
                    function (response) {
                        console.log("response", response);
                        deferred.resolve(response.data);
                    }, function (response) {
                        deferred.reject();
                        return [];
                    });
                    return deferred.promise;
                }
            };

            $scope.selectedItemChange = function (item) {
                console.log("item", item);
                if (item) {
                    $scope.selectedItem3 = item;
                    $scope.searchText3 = item.name;
                    // vm.item.location.id = item.id;
                }
            };

            $scope.locationBusinessChange = function () {
                $scope.searchBusiness = null;
                $scope.searchText3 = null;
            };

            ////=========================//

//            $scope.switchType = function () {
//                // console.log("vm.item.btns[0].type ", vm.item.btns[0].type);
//                switch (vm.item.btns[0].type) {
//                    case 'BUY':
//                    {
//                        vm.item.btns[0].icon = 'attatch_money';
//                        vm.item.btns[0].color = '#4bf442';
//                        vm.item.btns[0].pattern = "";
//                        vm.item.btns[0].inputType = "";
//                        break;
//                    }
//                    case 'OPEN_URL':
//                    {
//                        vm.item.btns[0].icon = 'launch';
//                        vm.item.btns[0].color = '#ff3399';
//                        vm.item.btns[0].pattern = "";
//                        vm.item.btns[0].inputType = "url";
//                        break;
//                    }
//                    case 'CALL':
//                    {
//                        vm.item.btns[0].icon = 'phone';
//                        vm.item.btns[0].color = '#ffff33';
//                        vm.item.btns[0].pattern = "/^[0-9]*$/";
//                        vm.item.btns[0].inputType = "text";
//                        break;
//                    }
//                    case 'ADD_TO_CART':
//                    {
//                        vm.item.btns[0].icon = 'add_shopping_cart';
//                        vm.item.btns[0].color = '#ff3385';
//                        vm.item.btns[0].pattern = '';
//                        vm.item.btns[0].inputType = "text"
//                        break;
//                    }
//                    case 'EXPRESS_INTEREST':
//                    {
//                        vm.item.btns[0].icon = 'thumb_up';
//                        vm.item.btns[0].color = '#3366ff';
//                        vm.item.btns[0].pattern = '';
//                        vm.item.btns[0].inputType = "text"
//                        break;
//                    }
//                }
//            };
            var loopBtns = function (btn) {
                // btn.editStatus = false;
                switch (btn.type) {
                    case 'BUY':
                    {
                        btn.icon = 'attach_money';
                        btn.color = 'rgba(210, 117, 240, 0.75)';
                        btn.pattern = "";
                        btn.inputType = "";
                        break;
                    }
                    case 'OPEN_URL':
                    {
                        btn.icon = 'launch';
                        btn.color = 'rgba(142, 20, 234, 0.68)';
                        btn.pattern = "";
                        btn.inputType = "url";
                        break;
                    }
                    case 'CALL':
                    {
                        btn.icon = 'phone';
                        btn.color = 'rgba(81, 45, 168, 0.51)';
                        btn.pattern = "/^[0-9]*$/";
                        btn.inputType = "text";
                        break;
                    }
                    case 'ADD_TO_CART':
                    {
                        btn.icon = 'add_shopping_cart';
                        btn.color = '#ff3385';
                        btn.pattern = '';
                        btn.inputType = "text"
                        break;
                    }
                    case 'EXPRESS_INTEREST':
                    {
                        btn.icon = 'thumb_up';
                        btn.color = 'rgba(168, 118, 248, 0.7)';
                        btn.pattern = '';
                        btn.inputType = "text"
                        break;
                    }
                }
            };
            function editOtherButtonsStatus(thisBtn, added) {
                angular.forEach(vm.item.btns, function (b) {
                    if(added) loopBtns(b);
                    if (b.status === "Active" && b.id !== thisBtn.id) {
                        var copyB = angular.copy(b);
                        delete b.color;
                        delete b.icon;
                        delete b.inputType;
                        delete b.pattern;
                        b._method = 'PUT';
                        b.status = "Inactive";
                        if (!b.action)
                            b.action = "";
                        $http.post($rootScope.twigBigRoot + "twig_btns/" + b.id, b)
                                .success(function (response) {
                                    console.log(response);
                                    b.color = copyB.color;
                                    b.icon = copyB.icon;
                                    //$scope.errorMessageToast(response.message);
                                })
                                .error(function (response) {
                                    console.error(response);
                                    $scope.errorMessageToast(response.error);
                                });
                    }
                })
            }
            ;

            $scope.addTwigBtn = function (btn) {
                console.log("item btn ", btn);
                if (btn)
                    msApi.request('twigs.add-twig-btns@save', btn,
                            function (response) {
                                console.log(response);
                                $scope.errorMessageToast(response.message);
                                vm.item.btns.push(response.data);

                                if (btn.status === "Active") {
                                    editOtherButtonsStatus(response.data, 'added');
                                }
                            },
                            function (response) {
                                console.error(response.data);
                                $scope.errorMessageToast(response.error);
                            }
                    );
            };
            $scope.editTwigBtn = function (btn, copyBtn) {
                if (btn) {
                    btn._method = 'PUT';
                    console.log("item btn ", btn);
                    $http.post($rootScope.twigBigRoot + "twig_btns/" + btn.id, btn)
                            .success(function (response) {
                                console.log(response);
                                btn.color = copyBtn.color;
                                btn.icon = copyBtn.icon;
                                $scope.errorMessageToast(response.message);
                                if (btn.status === "Active") {
                                    editOtherButtonsStatus(btn);
                                }

                            })
                            .error(function (response) {
                                console.error(response);
                                $scope.errorMessageToast(response.error);
                            });
                }
            }
            function EditBtnDialogController($scope, $mdDialog, btn) {
                console.log("btn ", btn);
                $scope.btn = btn;
                if (btn === null)
                    $scope.newBtn = {};

                $scope.switchType = function (btn) {
                    switch (btn.type) {
                        case 'BUY':
                        {
                            btn.icon = 'attach_money';
                            btn.color = '#4bf442';
                            btn.pattern = "";
                            btn.inputType = "";
                            break;
                        }
                        case 'OPEN_URL':
                        {
                            btn.icon = 'launch';
                            btn.color = '#ff3399';
                            btn.pattern = "";
                            btn.inputType = "url";
                            break;
                        }
                        case 'CALL':
                        {
                            btn.icon = 'phone';
                            btn.color = '#ffff33';
                            btn.pattern = "/^[0-9]*$/";
                            btn.inputType = "text";
                            break;
                        }
                        case 'ADD_TO_CART':
                        {
                            btn.icon = 'add_shopping_cart';
                            btn.color = '#ff3385';
                            btn.pattern = '';
                            btn.inputType = "text"
                            break;
                        }
                        case 'EXPRESS_INTEREST':
                        {
                            btn.icon = 'thumb_up';
                            btn.color = '#3366ff';
                            btn.pattern = '';
                            btn.inputType = "text"
                            break;
                        }
                    }
                };

                $scope.hide = function () {
                    $mdDialog.hide();
                };

                $scope.cancel = function () {
                    $mdDialog.cancel();
                };

                $scope.answer = function (answer) {
                    $mdDialog.hide(answer);
                };
            }
            $scope.editBtn = function (btn, ev) {
                //console.log("btn ", btn);
                // btn.editStatus = !btn.editStatus;
                $mdDialog.show({
                    locals: {btn: btn},
                    controller: EditBtnDialogController,
                    templateUrl: 'app/main/twigs/editItem/editTwigBtnTemplate.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                })
                        .then(function (btn) {
                            console.log("btn ", btn);
                            var copyBtn = angular.copy(btn);
                            delete btn.color;
                            delete btn.icon;
                            delete btn.inputType;
                            delete btn.pattern;
                            if (!btn.action || btn.type === "BUY")
                                btn.action = "";
                            //else if (vm.item.btns[0].type === "CALL")
                            //vm.item.btns[0].action = "'" + vm.item.btns[0].action + "'";
                            btn.twig_id = vm.item.id;
                            if (btn.id) {
                                console.log("btn ", btn);
                                $scope.editTwigBtn(btn, copyBtn);
                            } else if (!btn.id) {
                              if(vm.item.business) {
                                btn.business_id= vm.item.business.id;
                              }else if(vm.item.location) {
                                btn.business_id=vm.item.location.business_id;
                              }
                                console.log("btn ", btn);
                                $scope.addTwigBtn(btn);
                            }
                        }, function () {

                        });
            };
            if (vm.item.btns.length === 0) {
                $scope.addNewBtn = false;
                //$scope.isAddTwigBtn = true;
            }
            else {
                angular.forEach(vm.item.btns, function (btn) {
                    loopBtns(btn);
                });

                $scope.addNewBtn = true;
                // $scope.isAddTwigBtn = false;
                // $scope.switchType();
            }

            $scope.addNewButton = function () {
                $scope.addNewBtn = false;
            };
            $scope.cancelAddNewButton = function () {
                $scope.addNewBtn = true;
            };


            $scope.file1 = vm.item.media;
            // console.log("vm.item ", vm.item);


            if (vm.item.is_exceptional === 1)
                vm.item.is_exceptional = true;
            else
                vm.item.is_exceptional = false;

//            function compare(oldObj, newObj) {
//                var res = {};
//                console.log("oldObj ", oldObj);
//                console.log("newObj ", newObj);
//                for (var property in newObj) {
//                    console.log("property ", property);
//                    console.log("newObj.hasOwnProperty(property) ", newObj.hasOwnProperty(property));
//                    console.log("angular.equals(newObj[property], oldObj[property]) ", angular.equals(newObj[property], oldObj[property]));
//                    if (!newObj.hasOwnProperty(property) ||
//                            angular.equals(newObj[property], oldObj[property]))
//                        continue;
//
//                }
//
//                return res;
//            }

            function submit() {

                var feelings = [];
                if (vm.item.feelings.length !== 0)
                    for (var i = 0; i < vm.item.feelings.length; i++) {
                        feelings[i] = vm.item.feelings[i].id;
                    }
                //  console.log("vm.item.products ", vm.item.products);
                var products = [];
                if (vm.item.products.length !== 0)
                    for (var i = 0; i < vm.item.products.length; i++) {
                        //obj = {};
                        products[i] = vm.item.products[i].name;
                        //products[i] = obj;
                    }
                //  console.log("products ", products);
                var tags = [];
                if (vm.item.tags.length !== 0)
                    for (var i = 0; i < vm.item.tags.length; i++) {
                        //obj = {};
                        tags[i] = vm.item.tags[i].name;
                        //products[i] = obj;
                    }
                //  console.log("tags ", tags);
                if (vm.item.is_exceptional)
                    vm.item.is_exceptional = 1;
                else
                    vm.item.is_exceptional = 0;
                //console.log("item added ", vm.item);
                //  console.log("file1", $scope.file1);
                // if($scope.file1 === vm.item.media) $scope.file1 = "";
                //  console.log("vm.item ", vm.item);

                // var res = compare(angular.copy(Twig.data), vm.item);

                if (vm.item.nos !== '')
                    vm.item.nos = parseFloat(vm.item.nos);
                if (vm.item.yeses !== '')
                    vm.item.yeses = parseFloat(vm.item.yeses);
                var obj = {
                    yeses: vm.item.yeses,
                    nos: vm.item.nos,
                    feelings: feelings,
                    category_id: vm.item.category.id,
                    currency_id: 1,
                    price: vm.item.price,
                    reasonable_price: vm.item.reasonable_price,
                    is_exceptional: vm.item.is_exceptional,
                    products: products,
                    tags: tags,
                    quality: vm.item.quality,
                    service: vm.item.service,
                    ambiance: vm.item.ambiance,
                    media: $scope.file1,
                    description: vm.item.description,
                    _method: 'PUT'
                };
                if ($scope.locationBusiness === 'location') {
                    // delete vm.item.location_id;
                    obj.location_id = $scope.selectedItem3.id;
                    obj.business_id ="";
                    console.log("obj ", obj);
                } else {
                    // delete vm.item.location_id;
                    obj.business_id = $scope.selectedBusiness.id;
                    obj.location_id="";
                    console.log("obj ", obj);
                }
                // console.log("$scope.file", $scope.file1, vm.item.media)
                if ($scope.file1 === vm.item.media || $scope.file1 === null)
                    delete obj.media;
                console.log("obj ", obj);

                Upload.upload({
                    url: $rootScope.twigBigRoot + "twigs/" + vm.item.id,
                    method: 'POST',
                    data: obj
                }).then(function (response) {
                    console.log(response);
//                    if (vm.item.btns.length > 0) {
//                        delete vm.item.btns[0].color;
//                        delete vm.item.btns[0].icon;
//                        delete vm.item.btns[0].inputType;
//                        delete vm.item.btns[0].pattern;
//                        if (!vm.item.btns[0].status)
//                            vm.item.btns[0].status = "";
//                        if (!vm.item.btns[0].action)
//                            vm.item.btns[0].action = "";
//                        //else if (vm.item.btns[0].type === "CALL")
//                        //vm.item.btns[0].action = "'" + vm.item.btns[0].action + "'";
//                        vm.item.btns[0].twig_id = vm.item.id;
//                    }
                    // console.log("$scope.isAddTwigBtn ", $scope.isAddTwigBtn, vm.item.btns[0]);
//                    if ($scope.isAddTwigBtn)
//                        $scope.addTwigBtn(vm.item.btns[0]);
//                    else
//                        $scope.editTwigBtn(vm.item.btns[0]);

//                    if (!$scope.addNewBtn)
//                        $scope.addTwigBtn(vm.item.btns[0]);
//                    else
//                        $scope.editTwigBtn(vm.item.btns[0]);


                    $scope.errorMessageToast(response.data.message);
                    $state.go('app.twigs');
                    //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                }, function (response) {
                    console.log(response);
                    // $scope.errorMessageToast(response.error.code + " " + response.error.message);
                }, function (evt) {
                    //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.media.name);
                });


            }


        });
