
angular
        .module('app.twigs')
        .controller('AddTwigController',
                function ($state, $scope, msApi, Tags, Products, Feelings, $timeout, Upload, Categories, $q, $rootScope)
                {
                    var vm = this;
                    $scope.translate = 'TWIGS.';
                    vm.submit = submit;
                    vm.selectedItem = null;
                    vm.searchText = null;
                    vm.selectedItem2 = null;
                    vm.searchText2 = null;
                    vm.querySearch = querySearch;
                    vm.transformChip = transformChip;
                    vm.products = Products.data;
                    vm.tags = Tags.data;

                    vm.categories = Categories.data;
                    vm.feelings = Feelings.data;
                    $scope.locationBusiness = 'location';
                    //==================================//
                    $scope.searchBusiness = null;
                    $scope.selectedBusiness = null;
                    $scope.selectedBusinessChange = function (item) {
                        if (item)
                            vm.item.business_id = item.id;
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

                    $scope.selectedItem3 = null;
                    $scope.searchText3 = null;
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
                            vm.item.location_id = item.id;
                        }
                    };
                    //vm.querySearch = querySearch;

                    $scope.locationBusinessChange = function () {
                        $scope.searchBusiness = null;
                        $scope.searchText3 = null;
                    };

                    function querySearch(query, group) {
                        var results = query ? group.filter(createFilterFor(query)) : [];
                        return results;
                    }
                    function createFilterFor(query) {
                        var lowercaseQuery = angular.lowercase(query);
                        return function filterFn(g) {
                            // console.log("g.name.toLowerCase().indexOf(lowercaseQuery) ", g.name.toLowerCase().indexOf(lowercaseQuery));
                            return (g.name.toLowerCase().indexOf(lowercaseQuery) === 0);
                        };
                    }
                    function transformChip(chip) {
                        if (angular.isObject(chip)) {
                            return chip;
                        }
                        return {name: chip, type: 'new'};

                    }

                    vm.feelings = Feelings.data;
                    $scope.searchTerm2;
                    $scope.clearSearchTerm2 = function () {
                        $scope.searchTerm2 = '';
                    };
                    vm.item = {
                        yeses: "",
                        nos: "",
                        feelings: "",
                        category_id: "",
                        location_id: "",
                        business_id: "",
                        media: "",
                        price: "",
                        currency_id: "",
                        quality: 5,
                        service: 5,
                        ambiance: 5,
                        reasonable_price: 5,
                        is_exceptional: false,
                        description: "",
                        tags: [],
                        products: []
                    };
                    function submit() {

                        var feelings = [];
                        if (vm.item.feelings.length !== 0)
                            for (var i = 0; i < vm.item.feelings.length; i++) {
                                feelings[i] = vm.item.feelings[i].id;
                            }
                        // console.log("vm.selectedItem3 ", vm.selectedItem3);
                        var products = [];
                        for (var i = 0; i < vm.item.products.length; i++) {
                            //obj = {};
                            products[i] = vm.item.products[i].name;
                            //products[i] = obj;
                        }
                        // console.log("products ", products);
                        var tags = [];
                        for (var i = 0; i < vm.item.tags.length; i++) {
                            //obj = {};
                            tags[i] = vm.item.tags[i].name;
                            //products[i] = obj;
                        }
                        // console.log("tags ", tags);
                        vm.item.currency_id = 1;
                        // vm.item.price = parseFloat(vm.item.price);
                        // vm.item.reasonable_price = parseFloat(vm.item.reasonable_price);
                        if (vm.item.is_exceptional)
                            vm.item.is_exceptional = 1;
                        else
                            vm.item.is_exceptional = 0;

//                        if (vm.item.media === $rootScope.defaultBackground)
//                            vm.item.media = "";
                        // console.log("item added ", vm.item, $scope.file1);
                        var obj = {
                            yeses: parseInt(vm.item.yeses),
                            nos: parseInt(vm.item.nos),
                            feeling: feelings,
                            category_id: vm.item.category_id,
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
                            description: vm.item.description
                        };
                        if ($scope.locationBusiness === 'location') {
                            delete vm.item.business_id;
                            //vm.item.location_id = $scope.selectedItem3.id;
                            obj.location_id = $scope.selectedItem3.id;
                        } else {
                            delete vm.item.location_id;
                            obj.business_id =  vm.item.business_id;
                        }
                        Upload.upload({
                            url: $rootScope.twigBigRoot + "twigs",
                            method: 'POST',
                            data: obj
                        }).then(function (resp) {
                            console.log(resp);
                            $scope.errorMessageToast(resp.data.message);
                            $state.go('app.twigs');
                            //console.log('Success ' + resp.config.data.media.name + 'uploaded. Response: ' + resp.data);
                        }, function (resp) {

                            $scope.errorMessageToast(resp.error.code + " " + resp.error.message);
                            console.log(resp);
                            // console.log('Error status: ' + resp.status);
                        }, function (evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.media.name);
                        });




//                        msApi.request('twigs.addtwig@save', {
//                            category_id: vm.item.category_id,
//                            location_id: vm.item.location_id,
//                            currency_id: vm.item.currency_id,
//                            price: vm.item.price,
//                            reasonable_price: vm.item.reasonable_price,
//                            is_exceptional: vm.item.is_exceptional,
//                            products: products,
//                            tags: tags,
//                            quality: vm.item.quality,
//                            service: vm.item.service,
//                            ambiance: vm.item.ambiance,
//                            media: vm.item.media
//                        },
//                        // SUCCESS
//                        function(response)
//                        {
//                            console.log(response.data);
//                            var msg = "Twig has been added successfully";
//                            $scope.errorMessageToast(msg);
//                            $state.go("app.twigs");
//                        },
//                                // ERROR
//                                        function(response)
//                                        {
//                                            console.error(response.data);
//                                            var msg = "";
//                                            if (response.data.error.details.media)
//                                                msg += response.data.error.details.media[0] + " ";
//                                            $scope.errorMessageToast(msg);
//
//
//                                        }
//                                );
                    }



                    vm.mediacopy = '../../../../assets/images/patterns/rain-grey.png';
                    $scope.changePhoto = function (ev) {
                        vm.mediacopy = ev.currentTarget.files[0];
                        vm.item.media = ev.currentTarget.files[0];
                        // console.log("ev.currentTarget.files[0]; ", ev.currentTarget.files[0]);
                        var reader = new FileReader();
                        // console.log("vm.reader ", reader);
                        reader.onload = function (e) {

                            $scope.$apply(function ($scope) {
                                $scope.myImage = e.target.result;
                                // vm.mediacopy = angular.copy( $scope.myImage);
                                // console.log("vm.mediacopy ", vm.mediacopy);
                                vm.mediacopy = $scope.myImage;
                            });
                            // if ($scope.addItem.photo.$valid) {
                            //$scope.imgCropDialog(ev);
                            // }
                        };
                        reader.readAsDataURL(vm.mediacopy);
                    };
                });
